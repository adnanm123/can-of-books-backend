'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);

const Book = require('./models/book');

async function seed() {
  // the structure of each book I add has to be the same as my book schema
  /* title: {type: String, required: true},
  description: {type: String, required: true},
  status: {type: String, required: true}, */
  await Book.create({
    title: 'Captain Underpants',
    description: 'A dude in underpants that saved the day',
    status: 'Completed'
  });
  console.log('Captain Underpants was added to the DB');
  await Book.create({
    title: 'Diary of a Wimpy Kid',
    description: 'The life and experiences of a middle schooler, Greg Heffley',
    status: 'In Progress'
  });
  console.log('Diary of a Wimpy Kid was added to the DB');
  await Book.create({
    title: '1984',
    description: 'A bleak future under the rule of the oppressive Party led by Big Brother, where individualism is suppressed through surveillance, manipulation of truth, and totalitarian control.',
    status: 'Not started'
  });
  console.log('1984 was added to the DB');

  mongoose.disconnect();
}

seed();
