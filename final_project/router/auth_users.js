const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (authenticatedUser(username, password)) {
    let token = jwt.sign({ username: username }, "access");
    req.session.authorization = {
      username: username,
      accessToken: token,
    };  
    return res.status(200).json({ token: token });
  }
  return res.status(403).json({ message: "User not authenticated" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  if (books[isbn] === undefined)
    return res.status(404).json({ message: "Book not found" });
  username = req.session.authorization['username'];
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added successfully' });
});

//Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn] === undefined)
    return res.status(404).json({ message: "Book not found" });
  books[isbn].reviews = {};
  return res.status(200).json({ message: 'Review deleted successfully' });
}
);

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
