var express = require('express');
var app = express();
var bodyParser = require('body-parser');


console.log("Hello World");
const mySecret = process.env['.env'];
process.env.MESSAGE_STYLE= "uppercase";

app.use("/", function middleware(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});


app.get("/", function(req, res){
    //res.send("Hello Express");
    res.sendFile(__dirname + "/views/index.html");
    app.use("/public", express.static(__dirname + "/public"));
    
});

let message = "Hello json";
app.get("/json", function(req, res) {
  if(process.env.MESSAGE_STYLE == "uppercase"){
    res.json({"message": message.toUpperCase()});
  }
  else{
    res.json({"message": message});
  }
});

app.get(
  "/now", (req, res, next) => {
    // adding a new property to req object
    // in the middleware function
    req.time = new Date().toString();    next();
  },
  (req, res) => {
    // accessing the newly added property
    // in the main function
    res.json({"time": req.time});
  }
);

app.get("/:word/echo", function(req, res){
    //res.send("Hello Express");
    let word = req.params.word;
    res.json({"echo": word});   
});

app.get("/name", function(req, res){
    let first = req.query.first;
    let last = req.query.last;

    res.json({"name": `${first} ${last}`});
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/name",
function(req, res){
  let name = req.body.first + " " + req.body.last;

  res.json({"name": `${name}`});
})

module.exports = app;


