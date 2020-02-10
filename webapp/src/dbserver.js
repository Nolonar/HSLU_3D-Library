const frontendDomain = 'http://localhost:4200';

/**
 * How to use:
 * $ node dbserver.js
 * 
 * Since this is backend only, must be run BEFORE the frontend (ng serve).
 * Otherwise, frontend will receive no data from database.
 * 
 * Remeber to edit frontendDomain for CORS (Cross-Origin Ressource Sharing).
 */

require('dotenv').load();
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbDomain = process.env.DB_DOMAIN;
// Opening a connection takes time, so we only do it once when the server starts, and never close it.
let client = MongoClient.connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbDomain}/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function getDb() {
    return (await client).db('test');
}

async function getModelsCollection() {
    const db = await getDb();
    return db.collection('models');
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', frontendDomain);
    next();
});

app.use(express.json());

app.get('/models', async (req, res) => {
    console.log('GET /models');

    const collection = await getModelsCollection();
    const allModels = await collection.find({}).toArray();
    res.json(allModels);
});

app.get('/model/:modelId', async (req, res) => {
    const modelId = req.params['modelId'];
    console.log('GET /model/' + modelId);

    const collection = await getModelsCollection();
    const model = await collection.findOne({ '_id': +modelId });
    res.json(model);
});

app.post('/upload', async (req, res) => {
    console.log('POST /upload')
    console.log(req);
});

const server = app.listen(3000, () => {
    console.log('Listening on port ' + server.address().port);
});
