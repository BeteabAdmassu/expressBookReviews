const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  username = req.body.username;
  password = req.body.password;

  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({
    username: username,
    password: password,
  });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  if(books.length == 0)
    return res.status(404).json({ message: "No books found" })
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  if (books[req.params.isbn] === undefined)
    return res.status(404).json({ message: "Book not found" });
  // Get book details based on ISBN
  return res.status(200).json(books[req.params.isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  author = req.params.author;
  const bookArray = Object.values(books);
  filteredBooks = bookArray.filter((book) => book.author === author);
  if (filteredBooks.length == 0) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  title = req.params.title;
  const bookArray = Object.values(books);
  filteredBooks = bookArray.filter((book) => book.title === title);
  if (filteredBooks.length == 0) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = book.reviews;

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
