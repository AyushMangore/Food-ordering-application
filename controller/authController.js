// Express is a node js web application framework that provides broad features 
// for building web and mobile applications. 
// It is used to build a single page, multipage, and hybrid web application. 
// It's a layer built on the top of the Node js that helps manage servers and routes.
// Easy to configure and customize. Allows you to define routes of your application based on HTTP methods and URLs. 
// Includes various middleware modules which you can use to perform additional tasks on request and response. 
// Easy to integrate with different template engines like Jade, Vash, EJS etc.
const express = require('express')


const authRouter = express.Router();

// requiring user model
const userModel = require('../models/userModel')

// JSON Web Token is a proposed Internet standard for creating data with optional 
// signature and/or optional encryption whose payload holds JSON that asserts some number of claims. 
// The tokens are signed either using a private secret or a public/private key.
const jwt = require('jsonwebtoken')

// JWT is created with a secret key and that secret key is private to you which means 
// you will never reveal that to the public or inject inside the JWT token. 
// When you receive a JWT from the client, 
// you can verify that JWT with this that secret key stored on the server.
const { JWT_KEY } = require('../../secrets')

// we have implemented mailing facitility in nodemailer file
const {sendMail} = require('../utility/nodemailer')

//signup user
module.exports.signup = async function signup(req, res) {
    try {
        // extracting the data of the user
        let dataObj = req.body;
        // creating the user in model
        let user = await userModel.create(dataObj);
        // sending mail on successful signup
        sendMail("signup",user);
        if (user) {
            res.json({
                message: "User Signed UP",
                data: user
            })
        } else {
            res.json({
                message: "Error while signing up"
            })
        }
        // we will get data in the body of our request
        // let obj = req.body;
        // console.log("backend",obj);
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
}
//login
module.exports.login = async function loginUser(req, res) {
    try {
        // extracting data required for login purpose
        let data = req.body;
        if (data.email) {
            // finding user will the help of email
            let user = await userModel.findOne({ email: data.email });
            if (user) {
                // becrypt has to be used
                // matching the password
                if (user.password == data.password) {
                    // use cookie

                    // extracting  the uid of the user
                    let uid = user['_id'];
                    // generating token
                    let token = jwt.sign({ payload: uid }, JWT_KEY) // default HMAC SHA256

                    // generating cookie
                    res.cookie('login', token,
                        { httpOnly: true });

                    return res.json({
                        message: 'User Logged In Successfully',
                        userDetails: data
                    })
                } else {
                    return res.json({
                        message: 'Wrong credentials'
                    })
                }
            } else {
                return res.json({
                    message: 'User not found'
                })
            }
        } else {
            return res.json({
                message: 'Empty field found'
            })
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        })
    }
}

// isAuthorised middleware function : to check the user role
// admin,user,restaurant,deliveryboy
module.exports.isAuthorised = function isAuthorised(roles) {
    return function (req, res, next) {
        // console.log(req);
        // if our roles array contains the role then only access
        if (roles.includes(req.role) == true) {

            next();
        } else {
            res.status(401).json({
                message: "Operation not allowed"
            })
        }
    }
}

// protectRoute
module.exports.protectRoute = async function protectRoute(req, res, next) {
    // console.log(JWT_KEY);
    try {
        let token;
        if (req.cookies.login) {
            // checking the information stored in cookies
            token = req.cookies.login
            // JWT verify method is used for verify the token the take two arguments 
            // one is token string value, and second one is secret key for matching the token is valid or not. 
            // The validation method returns a decode object that we stored the token in.
            let payload = jwt.verify(token, JWT_KEY)
            // {payload:dgggdddgdd}
            if (payload) {
                // finding the user with the id stored in payload
                const user = await userModel.findById(payload.payload);
                // extracting the role of the user
                req.role = user.role
                // extracting the id of user
                req.id = user.id
                // console.log(req.role);
                // console.log(req.id);
                next();
            } else {
                return res.json({
                    message: "User not verified"
                })
            }
        } else {
            // browser
            // if cookie is not there then redirect to login
            const client = req.get('User-Agent');
            if(client.includes("Mozilla") == true){
                return res.redirect('/login');
            }
            // postman
            return res.json({
                message: "Please log in first"
            })
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        })
    }
}

//forget password
module.exports.forgetpassword = async function forgetpassword(req, res) {
    let { email } = req.body;
    try {
        // finding the user with the help of email
        const user = await userModel.findOne({ email: email });
        if (user) {
        // For security reasons, passwords are never sent out across the Internet. 
        // Instead a token will be sent to your email instead. 
        // A token is a one-time generated link that contains numbers and letters that'll allow you to reset your password.
            const resetToken = user.createResetToken();
            let resetPasswordLink = `${req.protocol}://${req.get.host}/resetpassword/${resetToken}`;
            // send email to the user
            // node mailer
            let obj = {
                resetPasswordLink : resetPasswordLink,
                email : email
            }
            sendMail("resetpassword",obj);
        } else {
            res.json({
                message: "Sign up first"
            })
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//reset password
module.exports.resetpassword = async function resetpassword(req, res) {
    const token = req.params.token;
    let { password, confirmPassword } = req.body;
    try {
        const user = await userModel.findOne({ resetToken: token })
        if (user) {
            user.resetPasswordHandler(password, confirmPassword);
            await user.save()
            res.json({
                message: "Password changed successfully, Login again!"
            })
        } else {
            res.json({
                message: "User not found"
            })
        } 
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

// Logout : we will destroy unique JWT token
module.exports.logout = function logout(req,res){
    res.cookie('login','',{maxAge:1});// overwrite value corresponding to login to ''
    //or we can change it's life time through maxAge in milliseconds
    res.json({
        message : "User logged out successfully"
    })
}