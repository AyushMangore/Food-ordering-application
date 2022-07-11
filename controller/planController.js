// requiring the plan model
const planModel = require('../models/planModel')

// fetching all the plans
module.exports.getAllPlans = async function getAllPlans(req, res) {
    try {
        // finding all the plans in our plan model
        let plans = await planModel.find();
        if (plans) {
            return res.json({
                message: "All plans retrieved",
                data: plans
            })
        } else {
            return res.json({
                message: "Plans not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// this method is for acquiring particular plan
module.exports.getPlan = async function getPlan(req, res) {
    try {
        // extracting the plan id
        let id = req.params.id;
        // finding the plan from the plan model
        let plan = await planModel.findById(id);
        if (plan) {
            return res.json({
                message: "plan retrieved",
                data: plan
            })
        } else {
            return res.json({
                message: "Plan not found"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// this method is for creating the plan
module.exports.createPlan = async function createPlan(req, res) {
    try {
        // extracting the data for the plan
        let planData = req.body;
        let createdPlan = await planModel.create(planData);
        return res.json({
            message: "Plan created successfully",
            data: createdPlan
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// this method is for deleting the particular plan
module.exports.deletePlan = async function deletePlan(req, res) {
    try {
        // acquiring plan id
        let id = req.params.id
        // deleting the plan from model
        let deletedPlan = await planModel.findByIdAndDelete(id)
        return res.json({
            message: "Plan deleted successfully",
            data: deletedPlan
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// this method is for updating the plan
module.exports.updatePlan = async function updatePlan(req, res) {
    try {
        // acquiring the particular plan
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        // finding the plan through id
        let plan = await planModel.findById(id);
        // console.log("id",id);
        // finding all keys to update
        const keys = [];
        for (let key in dataToBeUpdated) {
            keys.push(key);
        }
        
        // creating the plan object
        for (let i = 0; i < keys.length; i++) {
            plan[keys[i]] = dataToBeUpdated[keys[i]];
        }
        // console.log(plan);
        // updating the plan with new plan object
        const updatedData = await planModel.findByIdAndUpdate(id,plan);
        return res.json({
            message: "Plan updated successfully",
            data: plan
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}



// get top three plans
module.exports.top3plans = async function top3plans(req, res) {
    try {
        // finding and sorting plans according to ratings and limiting result for three
        let topthreePlans = await planModel.find().sort({
            ratingsAverage: -1
        }).limit(3)
        return res.json({
            message: "Top three plans",
            data: topthreePlans
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}