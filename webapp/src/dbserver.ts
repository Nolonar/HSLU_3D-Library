const frontendDomain = 'http://localhost:4200';

/**
 * How to use:
 * $ node dbserver.ts
 * 
 * Since this is backend only, must be run BEFORE the frontend (ng serve).
 * Otherwise, frontend will receive no data from database.
 * 
 * Remember to edit frontendDomain for CORS (Cross-Origin Ressource Sharing).
 */

require('dotenv').load();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;

const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer({ dest: 'src/assets/models/' });

const filesystem = require('fs');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DOMAIN = process.env.DB_DOMAIN;
const SECRET_KEY = process.env.SECRET_KEY;


let propertiesAvailable = true;
let client;

if (!DB_USER) {
    console.warn(`Environment property 'DB_USER' is missing: `);
    propertiesAvailable = false;
}
if (!DB_PASSWORD) {
    console.warn(`Environment property 'DB_PASSWORD' is missing: `);
    propertiesAvailable = false;
}
if (!DB_DOMAIN) {
    console.warn(`Environment property 'DB_DOMAIN' is missing: `);
    propertiesAvailable = false;
}
if (!SECRET_KEY) {
    console.warn(`Environment property 'SECRET_KEY' is missing: `);
    propertiesAvailable = false;
}
if (propertiesAvailable) {
    console.log(`starting db server...`);
    // Opening a connection takes time, so we only do it once when the server starts, and never close it.
    client = MongoClient.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_DOMAIN}/test?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
} else {
    throw 'Server can not be started due to missing properties';
}

async function getDb() {
    return (await client).db('test');
}

async function getModelsCollection() {
    const db = await getDb();
    return db.collection('models');
}

async function getUsersCollection() {
    const db = await getDb();
    return db.collection('users');
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', frontendDomain);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/models', async (req, res) => {
    sendResponse(res, async () => await findWhere(req.query));
});

app.get('/model/:modelId', async (req, res) => {
    const modelId = req.params['modelId'];
    sendResponse(res, async () => await findOneWhere(getQueryById(modelId)));
});

app.delete('/model/:modelId', async (req, res) => {
    try {
        verifyToken(req);
        const modelId = req.params['modelId'];
        const model = await findOneWhere(getQueryById(modelId));
        sendResponse(res, async () => await deleteModel(model));
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const filename = req.file['filename'];
    try {
        const decoded = verifyToken(req);
        const toInsert = {
            name: req.body['name'].trim(),
            filename: filename,
            filetype: req.file['originalname'].split('.').pop(),
            creationDate: new Date(),
            uploaderId: decoded.sub
        };

        const collection = await getModelsCollection();
        const result = await collection.insertOne(toInsert);

        // Save image only after successful insert.
        saveImage(req.body['thumbnailDataUrl'], filename);
        sendResponse(res, async () => await collection.findOne(getQueryById(result.insertedId)));
    } catch (err) {
        try {
            await deleteFile(`src/assets/models/${filename}`);
        } catch { /* Best effort */ }
        res.status(403).json({ message: err.message });
    }
});

app.post('/login', upload.none(), async (req, res) => {
    if (req.body) {
        const username = req.body.username;
        const password = req.body.password;

        if (await validateAuthentication(username, password)) {
            const expiresIn = 60 * 60;
            const data = {};
            const options = {
                expiresIn,
                subject: username
            };
            const idToken = jwt.sign(data, SECRET_KEY, options);
            res.status(200).json({ idToken, expiresIn, username });
        } else {
            res.status(403).json({ message: 'Username or password is incorrect' });
        }
    } else {
        res.status(401).json({ message: 'No credentials provided' });
    }
});

async function validateAuthentication(username, password) {
    const collection = await getUsersCollection();
    const result = await collection.findOne({ username });
    if (result) {
        return await bcrypt.compare(password, result.password);
    }
    return false;
}

function verifyToken(req) {
    const idToken = req.headers.authorization;

    // verify signature
    const decoded = jwt.verify(idToken, SECRET_KEY);

    // verify time range
    const issuedAt = new Date(1000 * decoded.iat);
    const expiresAt = new Date(1000 * decoded.exp);
    const now = new Date();

    if (now < issuedAt) {
        throw Error('Invalid token iat');
    } else if (expiresAt < now) {
        throw Error('Invalid token exp');
    }
    return decoded;
}

function saveImage(dataUrl, filename) {
    const data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');
    filesystem.writeFile(`src/assets/images/previews/${filename}`, buffer, error => {
        console.error(error);
    });
}

function getQueryById(id) {
    return { '_id': ObjectId.createFromHexString(`${id}`) };
}

async function sendResponse(res, getResponse) {
    try {
        res.json(await getResponse());
    } catch (error) {
        console.error(error);
        res.json(null);
    }
}

async function findWhere(query) {
    const collection = await getModelsCollection();
    return await collection.find(query).toArray();
}

async function findOneWhere(query) {
    const collection = await getModelsCollection();
    return await collection.findOne(query);
}

async function deleteModel(model) {
    const collection = await getModelsCollection();
    await collection.deleteOne(getQueryById(model._id));
    return await deleteModelFiles(model.filename);
}

async function deleteModelFiles(filename) {
    const response = {
        success: true,
        errors: []
    };
    const pathsToDeleteFrom = [
        'src/assets/models',
        'src/assets/images/previews'
    ];
    for (const path of pathsToDeleteFrom) {
        try {
            await deleteFile(`${path}/${filename}`);
        } catch (error) {
            response.success = false;
            response.errors.push(error);
        }
    }

    return response;
}

async function deleteFile(path) {
    return new Promise((resolve, reject) => {
        filesystem.unlink(path, error => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

const server = app.listen(3000, () => {
    console.log('Listening on port ' + server.address().port);
});
