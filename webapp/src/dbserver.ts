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

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDomain = process.env.DB_DOMAIN;
let propertiesAvailable = true;
let client;

if (!dbUser) {
    console.warn(`Environment property 'DB_USER' is missing: `);
    propertiesAvailable = false;
}
if (!dbPassword) {
    console.warn(`Environment property 'DB_PASSWORD' is missing: `);
    propertiesAvailable = false;
}
if (!dbDomain) {
    console.warn(`Environment property 'DB_USER' is missing: `);
    propertiesAvailable = false;
}
if (propertiesAvailable) {
    console.log(`starting db server...`);
    // Opening a connection takes time, so we only do it once when the server starts, and never close it.
    client = MongoClient.connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbDomain}/test?retryWrites=true&w=majority`, {
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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', frontendDomain);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
    const modelId = req.params['modelId'];
    const model = await findOneWhere(getQueryById(modelId));
    sendResponse(res, async () => await deleteModel(model));
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const filename = req.file['filename'];
    saveImage(req.body['thumbnailDataUrl'], filename);
    const toInsert = {
        name: req.body['name'].trim(),
        filename: filename,
        filetype: req.file['originalname'].split('.').pop(),
        creationDate: new Date(),
        uploaderId: '1'
    };

    const collection = await getModelsCollection();
    const result = await collection.insertOne(toInsert);
    sendResponse(res, async () => await collection.findOne(getQueryById(result.insertedId)));
});

app.post('/login', upload.single(), async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const RSA_PRIVATE_KEY = 'MySecretKey';

    if (validateAuthentication(username, password)) {
        const expiresIn = 60 * 60;
        const data = {};
        const options = {
            // algorithm: 'RS256',
            expiresIn,
            subject: username
        };
        const idToken = jwt.sign(data, RSA_PRIVATE_KEY, options);
        res.status(200).json({ idToken, expiresIn, username });
    } else {
        res.sendStatus(401);
    }
});

function validateAuthentication(username, passsword) {
    return username === 'PiratePeter';
}

function saveImage(dataUrl, filename) {
    const data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
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
