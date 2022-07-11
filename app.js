// Author : Ayush Mangore
// This project is bascially a complete backend for a food ordering application, It involves facilities like
// register, login, creating plans, fetching all the plans,providing reviews etc.
// I have used mondoDB as a backend database and express to build API's 

// MongoDB is an open source NoSQL database management program. 
// NoSQL is used as an alternative to traditional relational databases. 
// NoSQL databases are quite useful for working with large sets of distributed data. 
// MongoDB is a tool that can manage document-oriented information, store or retrieve information.

// Express is a node js web application framework that provides broad features 
// for building web and mobile applications. 
// It is used to build a single page, multipage, and hybrid web application. 
// It's a layer built on the top of the Node js that helps manage servers and routes.
// Easy to configure and customize. Allows you to define routes of your application based on HTTP methods and URLs. 
// Includes various middleware modules which you can use to perform additional tasks on request and response. 
// Easy to integrate with different template engines like Jade, Vash, EJS etc.

// The route is a section of Express code that associates an HTTP verb (GET, POST, PUT, DELETE, etc.), 
// an URL path/pattern, and a function that is called to handle that pattern. 
// Node. js is an open-source, cross-platform JavaScript run-time environment 
// that executes JavaScript code outside of a browser.

const express = require('express')

const app = express();



// requiring all the routers
const userRouter = require('./Routers/userRouter')

const planRouter = require('./Routers/planRouter')

// const authRouter = require('./Routers/authRouter')


// Cookie-parser middleware is used to parse the cookies that are 
// attached to the request made by the client to the server.
var cors = require('cors');

const cookieParser = require('cookie-parser');

const reviewRouter = require('./Routers/reviewRouter');
const bookingRouter = require('./Routers/bookingRouter');


// middleware function front -> json
// App. use() is used to bind *application-level middleware to an instance of the app object 
// which is instantiated on the creation of the Express server (router. use() for router-level middleware)
// json() is a built-in middleware function in Express. 
// This method is used to parse the incoming requests with 
// JSON payloads and is based upon the bodyparser. 
// This method returns the middleware that only parses 
// JSON and only looks at the requests where the content-type header matches the type option.
app.use(cors())
app.use(express.static('public/build'));

app.use(express.json());


// The app. listen() method binds itself with the specified host and port to 
// bind and listen for any connections. 
// If the port is not defined or 0, 
// an arbitrary unused port will be assigned by the operating system 
// that is mainly used for automated tasks like testing, etc.
const port = process.env.PORT || 5000;
app.listen(port,function(){
    console.log(`listening ${port}`);
});
// app.listen(3000);

// middleware to access cookies from anywhere
app.use(cookieParser());

// defined api root names to access the routes
app.use('/user',userRouter);

app.use('/plans',planRouter)

app.use('/review',reviewRouter)

app.use('/booking',bookingRouter)


// npm install --save stripe to install stripe library
// npm i nodemailer