const express = require('express');
const app = express();
const Short = require('../models/short');
const validUrl = require('valid-url');
const bodyParser = require('body-parser');
const router = express.Router();

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// your first API endpoint... 
router.get("/hello", (req, res) => {
  res.json({greeting: 'hello API'});
});

//Shortener route
router.get('/new/:url(*)', (req, res) => {
    
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

router.get('/:forwardURL', (req, res) => {
  
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

module.exports = router;