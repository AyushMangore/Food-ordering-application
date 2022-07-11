// Mongoose is a Node.js-based Object Data Modeling (ODM) library for MongoDB. 
// It is akin to an Object Relational Mapper (ORM) such as. SQLAlchemy. 
// for traditional SQL databases. 
// The problem that Mongoose aims to solve is allowing developers to enforce a specific schema at the application layer.
const mongoose = require('mongoose')

const db_link = 'mongodb+srv://Admin:QXhkAUCmlIQ1Uhb1@cluster0.urgpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection to MongoDB.
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log("Review Database Connected");
})
.catch(function(err){
    console.log(err);
})

// creating the review schema
const reviewSchema = mongoose.Schema({
    // review is the first attribute
    review : {
        type : String,
        required : [true, 'Review is required'],
    },
    // another attribute is the rating
    rating : {
        type : Number,
        min : 1,
        max : 10,
        required : [true, 'Rating is required']
    },
    // this attribute will store the date and time
    createdAt : {
        type : Date,
        default : Date.now()
    },
    // this attribute contain the id of the user who is giving the review
    // Object ID is treated as the primary key within any MongoDB collection. 
    // It is a unique identifier for each document or record.
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'userModel',
        required : [true, 'Review must belong to a user']
    },
    // this attribute contain the id of the plan for which user is giving the review
    plan : {
        type : mongoose.Schema.ObjectId,
        ref : 'planModel',
        required : [true, 'Review must belong to a plan']
    }
})


// /^find/ regex : whenever any function started with find
// then populate users 

// populate() function in mongoose is used for populating the data inside the reference
reviewSchema.pre(/^find/,function (next){
    this.populate({
        path : "user",
        select : "name profileImage"
    }).populate("plan");
    next();
})


const reviewModel = mongoose.model('reviewModel',reviewSchema);

module.exports = reviewModel