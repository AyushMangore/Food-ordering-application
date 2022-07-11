// Mongoose is a Node.js-based Object Data Modeling (ODM) library for MongoDB. 
// It is akin to an Object Relational Mapper (ORM) such as. SQLAlchemy. 
// for traditional SQL databases. 
// The problem that Mongoose aims to solve is allowing developers to enforce a specific schema at the application layer.
const mongoose = require('mongoose')
// You can identify the real email address in Node. js easily by using the Deep Email Validator package. 
// It can eliminate fake email IDs efficiently by checking common typos, DNS records, and the SMTP server response
const emailValidator = require('email-validator')
// Bcrypt is a popular and trusted method for salt and hashing passwords. 
// You have learned how to use bcrypt's NodeJS library to salt and hash a password before storing it in a database. 
// You have also learned how to use the bcrypt compare function to compare a password to a hash, which is necessary for authentication.
const becrypt = require('bcrypt')
// Crypto is a module in Node. js which deals with an algorithm that performs data encryption and decryption. 
// This is used for security purpose like user authentication where storing the password in Database in the encrypted form. 
// Crypto module provides set of classes like hash, HMAC, cipher, decipher, sign, and verify.
const crypto = require('crypto')


// link to the mongo database
const db_link = 'mongodb+srv://Admin:QXhkAUCmlIQ1Uhb1@cluster0.urgpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection to MongoDB.
mongoose.connect(db_link)
.then(function(db){
    // console.log(db);
    console.log("Database Connected");
})
.catch(function(err){
    console.log(err);
})


// creating the schema of the user
const userSchema = mongoose.Schema({
    // first attribute is the name and it can not be empty
    name : {
        type : String,
        required : true
    },
    // email is the second attribute, we are validating email through third party email validator provided by npm
    email : {
        type : String,
        required : true,
        unique : true,
        validate : function(){
            return emailValidator.validate(this.email);
        }
    },
    // another attribute is the password
    password : {
        type : String,
        required : true,
        minLength : 8
    },
    // no need to store confirm password
    // we will remove it in post hook
    confirmPassword : {
        type : String,
        required : true,
        minLength : 8,
        validate : function(){
            return this.password == this.confirmPassword;
        }
    },
    // another attribute called role
    role : {
        type : String,
        enum : ['admin','user','restaurantowner','deliveryboy'],
        default : 'user'
    },
    // this attribute will contain the url to image
    profileImage : {
        type : String,
        default : 'img/users/default.jpeg'
    },
    // reset token attribute for authentication purpose
    resetToken : String
});

// pre post hooks
// before saving to database
// userSchema.pre('save',function(){
//     console.log('Before saving in the database',this);
// })

// middleware function hook, it will work after when all pre hooks are executed
// after saving to database
// userSchema.post('save',function(doc){
//     console.log('After saving in the database',doc);
// })

// pre hooks, runs before saving to database, confirm password will not be stored
userSchema.pre('save',function(){
    // confirm password will not be saved in database
    this.confirmPassword = undefined;
})


// userSchema.pre('save',async function(){
//     let salt = await becrypt.genSalt();
//     let hashedString = await becrypt.hash(this.password,salt);
//     console.log(hashedString);
//     this.password = hashedString;
// });

// model

userSchema.methods.createResetToken = function(){
    // we use npm package crypto
    // creating unique token  using crypto
    // 32 bytes hexadecimal code
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password,confirmPassword){
    this.password = password;
    this.confirmPassword = this.confirmPassword;
    this.resetToken = undefined; // don't save in database
}

const userModel = mongoose.model('userModel',userSchema);





module.exports = userModel;