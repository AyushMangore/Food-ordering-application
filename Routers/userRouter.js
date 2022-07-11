const express = require('express')

// The express. Router() function is used to create a new router object. 
// This function is used when you want to create a new router object in your program to handle requests.
const userRouter = express.Router();


// Multer adds a body object and a file or files object to the request object. 
// The body object contains the values of the text fields of the form, 
// the file or files object contains the files uploaded via the form
const multer = require('multer');

// requiring all the controller methods 
const {getUser,getAllUser,updateUser,deleteUser,updateProfileImage} = require('../controller/userController')

const {signup,login,isAuthorised,protectRoute,forgetpassword,resetpassword,logout} = require('../controller/authController');

// user specific routes, user will only be able to access them when they call api along with the user id
// with these routes user can update or delete
userRouter
.route('/:id')
.patch(updateUser)
.delete(deleteUser)

// this is the signup route
userRouter
.route('/signup')
.post(signup)

// this is the login route
userRouter
.route('/login')
.post(login)

// this is the forget password route
userRouter
.route('/forgetpassword')
.post(forgetpassword)

// this is the reset password route, passing token along to ensure authenticity
// A token is an object that can be used to authenticate a user to a server. 
// Tokens contain embedded user data that is used to identify and authenticate the user. 
// JSON Web Tokens (JWTs) are an open standard, 
// that define a secure way to transmit information between parties using a JSON object.
userRouter
.route('/resetpassword/:token')
.post(resetpassword)

// multer for file upload 
// storage, filter
// The disk storage engine gives you full control on storing files to disk.
const multerStorage = multer.diskStorage({
    // we have to specify the destination, where we want to save our data
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    // we are giving unique name to our saved file everytime
    filename: function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

// we are filtering the files those are of image type else we will refuse
const filter = function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("Not An Image! Please Upload An Image"), false)
    }
}

// specifying storage and filter
const upload = multer({
    storage: multerStorage,
    fileFilter: filter
})


// profile routes
// we want only one photo to be selected therefore specifying single
userRouter.post("/ProfileImage",upload.single('photo'), updateProfileImage);
userRouter.get('/ProfileImage',(req,res) => {
    res.sendFile("C:/Users/Ayush mangore/Desktop/Web/Backend/foodApp/multer.html");
});

// this is the forget password route
userRouter
.route('/logout')
.get(logout)

// this is the get user route
userRouter.use(protectRoute);
userRouter
.route('/userProfile')
.get(getUser)




//admin specific
// we have created isAuthorised function and used it as a middleware to check whether admin is accessing or not
userRouter.use(isAuthorised(['admin']));

userRouter
.route('/')
.get(getAllUser)

module.exports = userRouter