// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


//Setting up the route
app.get('/api/:date_string', (req, res) => {
  //Capture input
  let date_string = req.params.date_string;
  let dateObject;
  //Check if the input is a date string
  if(parseInt(date_string) < 10000){
    dateObject = new Date(date_string);
  }
  else{
    //Is a timestamp
    dateObject = new Date(parseInt(date_string));
    //Ensure that we're returning a proper date
  }

  //If either input's unix time or utc time is invalid....
  if(dateObject == "Invalid Date"){
    res.json({error: 'Invalid Date'});
  }
  else{
    res.json({
      'unix': dateObject.getTime(),
      'utc': dateObject.toUTCString()
    });
  }
});

let responseObject = {}
  app.get('/api/', (req, res) => {
    responseObject['unix'] = new Date().getTime();
    responseObject['utc'] = new Date().toUTCString();

    res.json(responseObject); 
  });
