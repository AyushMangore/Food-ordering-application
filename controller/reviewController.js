// requiring review and plan model
const planModel = require("../models/planModel");
const reviewModel = require("../models/reviewModel");

// this method will fetch all the reviews
module.exports.getAllReviews = async function getAllReviews(req, res) {
    try {
        // finding all the reviews
        const reviews = await reviewModel.find();
        if (reviews) {
            return res.json({
                message: "Reviews retrieved successfully",
                data: reviews
            })
        } else {
            return res.json({
                message: "Reviews not found"
            })
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        })
    }
}

// this method will fetch the top three most rated reviews
module.exports.top3reviews = async function top3reviews(req, res) {
    try {
        // we will find the reviews and sort according to rating and limit the results to 3 only
        const reviews = await reviewModel.find().sort({
            rating: -1
        }).limit(3);
        if (reviews) {
            return res.json({
                message: "Reviews retrieved successfully",
                data: reviews
            })
        } else {
            return res.json({
                message: "Reviews not found"
            })
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        })
    }
}

// fethcing reviews of a particular plan
module.exports.getPlanReviews = async function getPlanReviews(req, res) {
    try {
        // plan clicked : reviews corresponding to plans
        // acquiring particular plan id
        let planId = req.params.id;
        // finding the reviews of all the plans
        let reviews = await reviewModel.find();
        // filtering the review of particular plan
        reviews = reviews.filter(review => review.plan._id == planId); 
        if (reviews) {
            return res.json({
                message: "Reviews retrieved successfully",
                data: reviews
            })
        } else {
            return res.json({
                message: "Review not found"
            })
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        })
    }
}

// this method is for creating the review
module.exports.createReview = async function createReview(req, res) {
    try {
        // acquiring the id of the paln
        const id = req.params.plan;
        // finding plan with the particular id
        let plan = await planModel.findById(id);
        // extracting the review for the plan
        let review = await reviewModel.create(req.body);
        console.log(plan.total);
        console.log(plan.ratingsAverage);
        plan.ratingsAverage = (plan.ratingsAverage + req.body.rating) / plan.total;
        console.log(plan.ratingsAverage);
        plan.total = plan.total + 1;
        await plan.save()
        // saving the review for the plan 
        res.json({
            message: "Review Created",
            data: review
        })
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
}

// this method is for updating the review
module.exports.updateReview = async function updateReview(req, res) {
    try {
        // acquiring the id of the plan
        const planId = req.params.id;
        // review id arriving from frontend
        let id = req.body.id;
        // finding review with the help of particular review id
        const review = await reviewModel.findById(id);
        let dataToBeUpdated = req.body;
        // finding all keys to update except id
        const keys = [];
        for (let key in dataToBeUpdated) {
            if(key=='id') continue;
            keys.push(key);
        }

        // making our review object
        for (let i = 0; i < keys.length; i++) {
            review[keys[i]] = dataToBeUpdated[keys[i]];
        }

        // updating the review for the plan
        const updatedData = await reviewModel.findByIdAndUpdate(id, review);
        return res.json({
            message: "Review updated successfully",
            data: review
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// this method is for deleting the review
module.exports.deleteReview = async function deleteReview(req, res) {
    try {
        // requiring the plan id
        let planId = req.params.id;
        // requiring the review id 
        let id = req.body.id;
        // finding the review and deleting
        let deletedReview = await reviewModel.findByIdAndDelete(id)
        return res.json({
            message: "Review deleted successfully",
            data: deleteReview
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}