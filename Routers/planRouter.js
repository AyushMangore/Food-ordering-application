const express = require('express');
const { protectRoute, isAuthorised } = require('../controller/authController');

const{getPlan,getAllPlans,createPlan,deletePlan,updatePlan, top3plans} = require('../controller/planController');

//  The express. Router() function is used to create a new router object. 
// This function is used when you want to create a new router object in your program to handle requests.
const planRouter = express.Router();

// all plans routes
planRouter
.route('/allPlans')
.get(getAllPlans)

// top three plans route
planRouter
.route('/topthree')
.get(top3plans)

// own plan : logged in
// therefore used protectroute middle ware function to ensure that user has logged in
planRouter.use(protectRoute)
planRouter
.route('/plan/:id')
.get(getPlan)

// create retrieve update delete
// plans can be modified through admin or restaurant owner
planRouter.use(isAuthorised(['admin','restaurantowner']));
planRouter
.route('/crudplan')
.post(createPlan)

planRouter
.route('/crudplan/:id')
.patch(updatePlan)
.delete(deletePlan)



module.exports = planRouter


