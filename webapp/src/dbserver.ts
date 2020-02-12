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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/models', async (req, res) => {
    sendResponse(res, async () => await findWhere(req.query));
});

app.get('/model/:modelId', async (req, res) => {
    const modelId = req.params['modelId'];
    sendResponse(res, async () => await findOneWhere({ '_id': ObjectId.createFromHexString(`${modelId}`) }));
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
    sendResponse(res, async () => await collection.findOne({ '_id': ObjectId.createFromHexString(`${result.insertedId}`) }));
});

function saveImage(dataUrl, filename) {
    const data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(data, 'base64');
    filesystem.writeFile(`src/assets/images/previews/${filename}`, buffer, error => {
        console.error(error);
    });
}

async function sendResponse(res, getResponse) {
    try {
        res.json(await getResponse());
    } catch (error) {
        console.error('error occured: ');
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

const server = app.listen(3000, () => {
    console.log('Listening on port ' + server.address().port);
});
