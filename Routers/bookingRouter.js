const { protectRoute } = require("../controller/authController");

const express = require('express')

//  The express. Router() function is used to create a new router object. 
// This function is used when you want to create a new router object in your program to handle requests.
const bookingRouter = express.Router();


const {createSession} = require('../controller/bookingController')


// here we have integrated stripe api for payment purspose
bookingRouter.post('/createSession',protectRoute,createSession)
bookingRouter.get('/createSession',function(req,res){
    res.sendFile("C:/Users/Ayush mangore/Desktop/Web/Backend/foodApp/booking.html")
})


module.exports = bookingRouter