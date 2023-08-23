'use strict';

console.log('Hello World');

// require
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// bringing in mongoose
const mongoose = require('mongoose');

// bring in code from model
const Book = require('./models/book');

// add validation to confirm we are wired up to mongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection.error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});

// connect mongoose to mongoDB
mongoose.connect(process.env.DB_URL);

// use
const app = express();

//middleware
app.use(cors());

// Define port and validate .env is running
const PORT = process.env.PORT || 3001;

// Routes
app.get('/test', (request, response) => {
  response.send('test request received');
});

app.get('/books', getBooks);

// let getBooks = async (req, res, next) => {
async function getBooks(req, res, next) {
  try {
    let results = await Book.find();
    res.status(200).send(results);
  } catch(error) {
    next(error);
  }
}

app.get('*', (request, response) => {
  response.status(200).send('welcome');
});

// errors
app.get((error, request, response) => {
  response.status(500).send(error.message);
});

// listen
app.listen(PORT, () => console.log(`listening on ${PORT}`));
