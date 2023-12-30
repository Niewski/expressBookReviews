const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn]; 
    if (book) {
      res.send(book);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching book by ISBN");
  }
});

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    let booksbyauthor = Object.values(books).filter((book) => {
      return book.author === author;
    });
    res.send(JSON.stringify(booksbyauthor, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books by author");
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    let booksbytitle = Object.values(books).filter((book) => {
      return book.title === title;
    });
    res.send(JSON.stringify(booksbytitle, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books by title");
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
