const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

let exerciseSessionSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
});

let userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  log: [exerciseSessionSchema]
});

let User = mongoose.model('User', userSchema);
let Session = mongoose.model('Session', exerciseSessionSchema);

//Create a user by posting form data username to /api/exercise/ and will be returned with username and id

app.post('/api/users', bodyParser.urlencoded({extended: false}),(req, res) => {
  let newUser = new User({username: req.body.username})
  newUser.save((err, savedUser) => {
    if(!err){
      res.json({
        username: savedUser.username,
        _id: savedUser.id,
        })
    }
  })
});

//Getting all Users
//Second function calls find method on user model which gives an empty object as the query filter (first argument) which means all documents are returned.

//Assuming there is no error, call the json method which returns the array of users
app.get('/api/users', (req, res) => {
  User.find({}, (err, userArray) => {
    if(!err){
      res.json(userArray);
    }
  })
});

//Add an exercise to any user given the id, desc, duration (date optional)
app.post('/api/users/:_id/exercises', bodyParser.urlencoded({extended: false}), (req, res) =>{
  let newSession = new Session({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })

  //Substring gets us the first 10 characters for the date. The rest isn't needed 
  if(newSession.date == ''){
    newSession.date = new Date().toISOString().substring(0,10);
  }

  //$push appends the newSession into the updated user's log
  User.findByIdAndUpdate(
    req.params._id, 
    {$push: {log: newSession}},
    {new: true},
    (err, updatedUser) => {
      if(!err){
        res.json({
          _id: updatedUser.id,
          username: updatedUser.username,
          description: newSession.description,
          duration: newSession.duration,
          date: new Date(newSession.date).toDateString()
          })
      }
    })
});

//Recieve a full excercise log of any user
app.get('/api/users/:_id/logs', (req, res) => {
  
  User.findById(req.params._id, (error, result) => {
    if(!error){
      let responseObject = result
      if(req.query.from || req.query.to){
        
        let fromDate = new Date(0)
        let toDate = new Date()
        
        if(req.query.from){
          fromDate = new Date(req.query.from)
        }
        
        if(req.query.to){
          toDate = new Date(req.query.to)
        }
        
        fromDate = fromDate.getTime()
        toDate = toDate.getTime()
        
        responseObject.log = responseObject.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime()
          return sessionDate >= fromDate && sessionDate <= toDate
        })
      }
      
      if(req.query.limit){
        responseObject.log = responseObject.log.slice(0, req.query.limit)
      }
      
      responseObject = responseObject.toJSON()
      responseObject['count'] = result.log.length
      res.json(responseObject)
    }
  })
  
})


