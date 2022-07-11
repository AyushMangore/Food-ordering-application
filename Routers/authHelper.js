
const jwt = require('jsonwebtoken')

const {JWT_KEY} = require('../../secrets')


function protectRoute(req,res,next){
    // console.log(JWT_KEY);
    if(req.cookies.login){
        let isVerified = jwt.verify(req.cookies.login,JWT_KEY)
        if(isVerified){
            next();
        }else{
            return res.json({
                message : "User not verified"
            })
        }
    }else{
        return res.json({
            message : "User not logged in"
        })
    }
}

module.exports = protectRoute