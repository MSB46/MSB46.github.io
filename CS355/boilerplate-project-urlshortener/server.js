require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//Connect to database
const mongoose = require('mongoose');



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  orig : {type: String, required: true},
  short : Number
});

let URL = mongoose.model('URL', urlSchema);

app.post('/api/shorturl', bodyParser.urlencoded({extended: false}) , (req, res) => {

  // console.log(req.body);
  //Getting the URL Parameter
  let inputUrl = req.body['url'];

  //https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  //https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
  let urlRegex = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);


  if(!inputUrl.match(urlRegex)){
    res.json({'error': 'invalid url'});
    return;
  }
  

  let inputShort = 1;

  //Highest URL number is at top
  URL.findOne({})
  .sort({short: 'desc'})
  .exec((error, result) => {
    if(!error && result != undefined){
      inputShort = result.short + 1;
    }

    if(!error){
      URL.findOneAndUpdate(
        {orig: inputUrl},
        {orig: inputUrl, short: inputShort},
        {new: true, upsert: true},
        (error, savedUrl) => {
          if(!error)
            res.json({'original_url': inputUrl,
                      'short_url': savedUrl.short});
        }
      )
    }
    // new:true - whatever is created will be saved
    //upsert: true - creates the object if it doesn't exist

  });

});

app.get('/api/shorturl/:input', (req, res) => {
  let input = req.params.input;
  URL.findOne({short: input}, (error, result) => {
    if(!error & result != undefined)
      res.redirect(result.orig);
    else{
      res.json('Uh oh. URL not found.');
    }
  })
});

