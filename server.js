"use strict";

console.log("Hello World");

// require
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// bringing in mongoose
const mongoose = require("mongoose");

// bring in code from model
const Book = require("./models/book");

// bring in auth code
const verifyUser = require("./auth");

// add validation to confirm we are wired up to mongoDB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection.error:"));
db.once("open", function () {
  console.log("Mongoose is connected");
});

// connect mongoose to mongoDB
mongoose.connect(process.env.DB_URL);

// use
const app = express();

//middleware
app.use(cors());
app.use(express.json()); // must have this to receive json from a request

// Define port and validate .env is running
const PORT = process.env.PORT || 3001;

app.use(verifyUser);

// Routes
app.get("/test", (request, response) => {
  response.send("test request received");
});

app.get("/books", getBooks);

app.post("/books", postBooks);

// We are sending the ID of the cat we want to delete as a path parameter
// Ex:
// http://localhost:3001/books/64e7946a9f6341831bf7908d
// the colon in the search query declares a variable -> ex: let id = ...
app.delete("/books/:id", deleteBooks);
app.put("/books/:id", putBooks);

async function getBooks(req, res, next) {
  console.log(req.user);
  const email = req.user.email;
  // console.log('req object --------->>>>>>', email);
  try {
    let results = await Book.find({userEmail: email});
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }

}

async function postBooks(req, res, next) {
  const email = req.user.email;
  // adding a new Book object to database
  console.log(req.body); // req.body is when we request/post new Book from front end into our json
  try {
    // we will want to add code here to add book to the database
    let createdBook = await Book.create({...req.body, userEmail: email});
    res.status(200).send(createdBook);
  } catch (err) {
    next(err);
  }
}

async function deleteBooks(req, res, next) {
  try {
    // http://localhost:3001/books/64e7946a9f6341831bf7908d
    // to extract the value where the id is (in this case: 64e7946a9f6341831bf7908d)
    console.log(req.params.id);
    let id = req.params.id;
    // delete the book from our database
    await Book.findByIdAndDelete(id);
    // don't bother sending the deleted book in the response, it won't always be there
    res.status(200).send("book deleted");
  } catch (err) {
    next(err);
  }
}

async function putBooks(req, res, next) {
  const email = req.user.email;
  try {
    let id = req.params.id;
    let bookFromReq = {...req.body, userEmail: email};
    let options = {
      new: true,
      overwrite: true,
    };
    let updatedBook = await Book.findByIdAndUpdate(id, bookFromReq, options);
    res.status(200).send(updatedBook);
  } catch (err) {
    next(err);
  }
}

app.get("*", (request, response) => {
  response.status(200).send("welcome");
});

// errors
app.get((error, request, response) => {
  response.status(500).send(error.message);
});

// listen
app.listen(PORT, () => console.log(`listening on ${PORT}`));
