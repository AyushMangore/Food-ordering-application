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
    console.log("Plan Database Connected");
})
.catch(function(err){
    console.log(err);
})

// creating the plan schema
const planSchema = new mongoose.Schema({
    // first attribute is the name of the plan
    name : {
        type : String,
        required : true,
        unique : true,
        maxlength : [20,'Plan Name Should Not Exceed more than 20 Characters']
    },
    // this attribute will store the duration of the plan
    duration : {
        type : Number,
        required : true
    },
    // here is the attribute to store price
    price : {
        type : Number,
        required : [true,'Price Not Entered']
    },
    // this attribute will contain the average rating
    ratingsAverage : {
        type : Number,
        default : 0
    },
    // this attribute will contain the discount on the plan
    discount : {
        type : Number,
        validate : [function(){
            return this.discount < 100
        },'Discount Should Not Exceed Price']
    },
    // total is basically the price of the plan
    total : {
        type : Number,
        default : 1
    }
});


planSchema.pre('save',function(){
    // confirm password will not be saved in database
    this.total = undefined;
})

const planModel = mongoose.model('planModel',planSchema);




// (async function createPlan(){
//     let plan = {
//         name : "Super Food",
//         duration : 30,
//         price : 560,
//         ratingsAverage : 5,
//         discount : 30
//     }
//     const doc = new planModel(plan);
//     await doc.save();

//     // let data = await planModel.create(plan);
//     // console.log(doc);
// })()

module.exports = planModel