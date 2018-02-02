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

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI); 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('We\'re open for business!')); 

//Shortener route
app.get('/api/:url(*)', (req, res) => {
    
  const inputURL = req.params.url;
  const outputURL = Math.floor(Math.random() * 10000).toString();
  
  const data = new Short({
    longURL: inputURL,
    shortURL: outputURL
  });
  
  data.save( err => {
    if (err) {
      res.send('Error saving to DB'); 
    }
  });

  
  if (validUrl.isUri(inputURL)) {
    res.json(data);  
  } else {
    res.json({ error: 'Not a valid URL' }); 
  }
  
  res.json(data);
  
});

app.get('/:forwardURL', (req, res) => {
  
  const forward = req.params.forwardURL;
  
  Short.findOne({ shortURL: forward }, (err, data) => {

    const regex = new RegExp('^(http|https)://', 'i');
    const originalURL = data.longURL;
    
    if (err) {
      res.json({ error: 'Error reading database' }); 
    }
    if (regex.test(originalURL)) {
      res.redirect(301, data.longURL);
    } else {
      res.redirect(301, `http://${data.longURL}`); 
    }
    
  });
  
});

// your first API endpoint... 
app.get("/api/hello", (req, res) => {
  res.json({greeting: 'hello API'});
});


app.listen(port, () => {
  console.log('Node.js listening ...');
});