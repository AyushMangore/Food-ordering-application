// This is your test secret API key.

let SK = "sk_test_51KvdN0SEvUvbJwO6Fs1hF0OeIHQBH2wbzHiKFA4pcTcbH82R0mQ0waR0Q76vVGXH63ibxugl9SYMCJoRbUtDdkGw00SBNVnBjH";
const stripe = require('stripe')(SK);
const planModel = require('../models/planModel');
const userModel = require('../models/userModel');

module.exports.createSession = async function createSession(req,res){
    try{
        let userId = req.id;
        let planId = req.params.id;

        const user = await userModel.findById(userId);
        const plan = await planModel.findById(planId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            customer_email : user.email,
            client_reference_id : plan.id,
            line_items : [
                {
                    name : plan.name,
                    description : plan.description,
                    // deploy website
                    amount : plan.price,
                    currency : "inr",
                    quantity : 1
                }
            ],
            // dev => http
            // production -> https
            success_url : `${req.protocol}://${req.get("host")}/profile`,
            cancel_url : `${req.protocol}://${req.get("host")}/profile`
        })
        res.status(200).json({
            status : "Success",
            session
        })
    }catch(err){
        res.status(500).json({
            err : err.message
        })
    }
}