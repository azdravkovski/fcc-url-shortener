'use strict';

const express = require('express');
const app = express();
const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;
const path = require('path');
const cors = require('cors');
const shortid = require('shortid');
const validUrl = require('valid-url');
const Short = require('./models/short');


// Basic Configuration 
const port = process.env.PORT || 3000;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

//Shortener route
app.get('/api/new/:url(*)', (req, res, next) => {
  
  /** this project needs a db !! **/ 
  mongoose.connect(process.env.MONGOLAB_URI); 
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => console.log('We\'re open for business!')); 
  
  const inputURL = req.params.url;
  const outputURL = Math.floor(Math.random() * 1000).toString();
  
  const data = new Short({
    longURL: inputURL,
    shortURL: outputURL
  });

  
  if (validUrl.isUri(inputURL)) {
    res.json({ originalURL: inputURL,
               
             });  
  } else {
    res.json({ error: 'Not a valid URL' }); 
  }
  

});

  
// your first API endpoint... 
app.get("/api/hello", (req, res) => {
  res.json({greeting: 'hello API'});
});


app.listen(port, () => {
  console.log('Node.js listening ...');
});