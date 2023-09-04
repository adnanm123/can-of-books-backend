'use strict';

/*
  Each book in our database should look something like this:
  let aBook = {
    title: 'ABC',
    description: 'abc',
    status: 'xyz'
  }
*/

// bring in mongoose here
const mongoose = require('mongoose');

// extract the schema
const { Schema } = mongoose;

// create a book schema
const bookSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  status: {type: String, required: true},
  userEmail: {type: String, required: true}
});

// create a model and tell the model about the rules AKA schema
const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;
