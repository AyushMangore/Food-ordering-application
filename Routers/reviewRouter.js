const express = require('express')

const { protectRoute, isAuthorised } = require('../controller/authController');

const {getAllReviews,top3reviews,getPlanReviews,createReview,updateReview,deleteReview} = require('../controller/reviewController');

//  The express. Router() function is used to create a new router object. 
// This function is used when you want to create a new router object in your program to handle requests.
const reviewRouter = express.Router();

// all reviews route
reviewRouter
.route('/all')
.get(getAllReviews)

// top 3 review route
reviewRouter
.route('/top3')
.get(top3reviews)

// get plans reviews, thorugh plan id as a parameter
reviewRouter
.route('/:id')
.get(getPlanReviews)

// crud
// can only we accessed if the user has logged in and given the review on a particular plan
reviewRouter.use(protectRoute)
reviewRouter
.route('/crud/:plan')
.post(createReview)
.patch(updateReview)
.delete(deleteReview)

module.exports = reviewRouter