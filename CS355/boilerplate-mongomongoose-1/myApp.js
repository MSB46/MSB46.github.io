require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


let Person;

/*We need to create a schema
Each schema maps to a MongoDB collection. It defines the shape of the documents within that collection
*/

const personSchema = new mongoose.Schema({
  name: {type: String , required: true},
  age :  Number,
  favoriteFoods : [String]
});


//Creates a new model of the Schema
Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  // Create a new instance of a person and provide their values
  var Bob = new Person({
    name:"John Dole",
    age:45,
    favoriteFoods: ["Bananas","Banana Bread", "Banana Cream Pie"]});
  
  // Save the data of this person
  Bob.save(function(err, data){
    if(err){
      return console.log(err);
    }
    else{
      done(null, data);
      return console.log(data);
    }
  });
  

};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data){
    if(err){
      return console.log(err);
    }
    else{
      done(null, data);
      return console.log(data);
    }

  });
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function(err, data){
    if(err){
      return console.log(err);
    }
    else{
      done(null , data);
    }
  });
  
  
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, function(err, data){
    if(err){
      return console.log(err);
    }
    else{
      done(null , data);
    }
  });
};

const findPersonById = (personId, done) => {
    //Use findById to retrieve a model (in this case, Person's) provided id value
    Person.findById({_id: personId}, function(err, data){
    if(err){
      return console.log(err);
    }
    else{
      done(null , data);
      //return console.log(data);
    }
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  //First find a person with a certain ID
  findPersonById(personId, function(err, person){
      if(err){
        return console.log(err);
      }

      //Push foodToAdd to this person's array of favoriteFoods
      else{
        person.favoriteFoods.push(foodToAdd);
        
        //Save the person's modified data
        person.save(function(err, data){
          if(err) return console.log(err);
          else done(null, data);
        });

        return console.log(person);
      }
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, 
  function(err, data){
    if(err) return console.log(err);
    else{ 
      done(null , data);
      return console.log(data); 
    }
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function(err,removedData){
    if(err) return console.log(err);
    else{ 
      done(null , removedData);
      return console.log(removedData); 
    }
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({name: nameToRemove}, 
  function(err, person){
    if(err){
        return console.log(err);
      }
      //Push foodToAdd to this person's array of favoriteFoods
      else{
        done(null , person);
        return console.log(person);
      }
  }); 
};

var queryChain = (done) => {
  /*
  Modify the queryChain function to find people who like the food specified by the variable named foodToSearch. Sort them by name, limit the results to two documents, and hide their age. Chain .find(), .sort(), .limit(), .select(), and then .exec(). Pass the done(err, data) callback to exec().
  */

  //Sort: {name:1} sorts name in ascending order
  //Limit(2): Limit the results to two documents
  //Select: {age: 0} Doesn't consider age. Removes age from output

  const foodToSearch = "burrito";
  Person
  .find({favoriteFoods: foodToSearch})
  .sort({name: 1})
  .limit(2)
  .select({age: 0})
  .exec((err, data) => {
    if(err) return console.log(err);
    else done(null, data);
  });
};



/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
