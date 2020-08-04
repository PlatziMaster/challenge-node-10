const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const slackTemplate = require('./utils/slackTemplate');
require('dotenv').config();

const dbUrl = process.env.BD_URL;
const PORT = process.env.PORT;
let db;

MongoClient.connect(dbUrl, {
  useUnifiedTopology: true
}, (err, database) => {
  if (err) return console.log(err);
  console.log('Connected to Database');
  db = database;
});

const app = express();
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send('¡Hola Mundo!');
});

app.get('/quotes', (resquest, response) => {
  const data = db.db('platzi-quotes');
  data.collection('quotes').find().toArray()
    .then(results => {
      response.json(results);
    })
    .catch(err => console.log(err));
});

app.get('/slack', (request, response) => {
  const data = db.db('platzi-quotes');
  data.collection('quotes').find().toArray()
    .then(results => {
      let slackQuote = slackTemplate(results[1]);
      response.json(slackQuote);
    })
    .catch(err => console.log(err));
});

app.post('/quotes', (request, response) => {
  const data = db.db('platzi-quotes');
  const parseData = JSON.parse(request.body);
  data.collection('quotes').insertOne(parseData)
    .then(results => {
      response.json(results);
    })
    .catch(err => console.log(err));
});


app.put('/quotes', (request, response) => {
  const data = db.db('platzi-quotes');
  data.collection('quotes').findOneAndUpdate(
    { "_id": ObjectId(request.body._id) },
    {
      $set: {
        name: request.body.name,
        quote: request.body.quote
      }
    },
    {
      upsert: true
    }
  )
    .then(results => {
      response.json(results);
    })
    .catch(err => console.log(err));
});

app.delete('/quotes', (request, response) => {
  const data = db.db('platzi-quotes');
  data.collection('quotes').deleteOne(
    { "_id": ObjectId(request.body._id) }
  )
    .then(results => {
      response.json(results);
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log('Servidor funcionando http://localhost:8000');
});