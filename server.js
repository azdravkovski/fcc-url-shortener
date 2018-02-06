'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const path = require('path');
const cors = require('cors');
const router = require('./routes/routes'); 

// Basic Configuration 
const port = process.env.PORT || 3000;

app.use(cors());

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI); 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('We\'re open for business!')); 


app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

//This is where we load the router
app.use('/api', router);

//===SERVER SETUP===//
app.listen(port, () => {
  console.log('Node.js listening ...');
});