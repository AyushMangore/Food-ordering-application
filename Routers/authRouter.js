const express = require('express')

//  The express. Router() function is used to create a new router object. 
// This function is used when you want to create a new router object in your program to handle requests.
const authRouter = express.Router();

// requiring the database model that we have created in mondo db
const userModel = require('../models/userModel')

// JSON Web Token is an open standard for securely transferring data within parties using a JSON object. 
// JWT is used for stateless authentication mechanisms for users and providers, 
// /this means maintaining session is on the client-side instead of storing sessions on the server.
const jwt = require('jsonwebtoken')
// JWT is created with a secret key and that secret key is private to you which means 
// you will never reveal that to the public or inject inside the JWT token. 
// When you receive a JWT from the client, 
// you can verify that JWT with this that secret key stored on the server.
const {JWT_KEY} = require('../../secrets')

// specifying route for sign up
authRouter
.route('/signup')
.get(middleware,getSignUp)
.post(postSignUp)

// specifying route for login in
authRouter
.route('/login')
.post(loginUser)

// function middleware(req,res,next){
//     console.log("Middle ware detected here");
//     next();
// }


//mounting



function getSignUp(req,res){
    console.log("get signup called");
    res.sendFile('./public/index.html',{root:__dirname});
}

 async function postSignUp(req,res){
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    // we will gat data in the body of our request
    // let obj = req.body;
    // console.log("backend",obj);

    res.json({
        message : "User Signed UP",
        data : user
    })
}

async function loginUser(req,res){
    try{
        let data = req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
                // becrypt has to be used
                if(user.password == data.password){
                    // use cookie
                    
                    let uid = user['_id'];
                    let token = jwt.sign({payload:uid},JWT_KEY) // default HMAC SHA256

                    res.cookie('login',token,
                    {httpOnly:true});

                    return res.json({
                        message : 'User Logged In Successfully',
                        userDetails : data
                    })
                }else{
                    return res.json({
                        message : 'Wrong credentials'
                    })
                }
            }else{
                return res.json({
                    message : 'User not found'
                })
            }
        }else{
            return res.json({
                message : 'Empty field found'
            })
        }
    }
    catch(err){
        return res.json({
            message : err.message
        })
    }
}
module.exports = authRouter