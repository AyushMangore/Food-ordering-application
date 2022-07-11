// requiring the user model
const userModel = require('../models/userModel')


// this the get user method, which will retireve the information of a particular user on providing users id
module.exports.getUser = async function getUser(req, res) {
    // extracting id
    let id = req.id;
    // finding in our database
    let user = await userModel.findById(id);
    // let allUsers = await userModel.findOne({name:'Ayush'});
    // console.log("Req -> ",req);
    if (user) {
        return res.json(user)
    } else {
        return res.json({
            message: 'User not found',
        })
    }
}
// module.exports.postUser = function postUser(req,res){
//     console.log(req.body);
//     users = req.body;
//     // json or send are similiar
//     res.json({
//         messages : "data received successfully",
//         user : req.body
//     });
// }
// this method is basically for updating information of a particular user
module.exports.updateUser = async function updateUser(req, res) {
    // console.log('request body data',req.body);
    // update data in users object
    try {
        // extracting id
        let id = req.params.id;
        // console.log(id);
        // finding user in the database
        let user = await userModel.findById(id);
        // extracting the updated data
        let datatobeupdated = req.body;
        // console.log(datatobeupdated);
        // console.log("Before Saving : ",user);
        if (user) {
            // extracting all the keys which needs update
            const keys = [];
            for (let key in datatobeupdated) {
                keys.push(key);
            }

            // now modifying our user object
            for (let i = 0; i < keys.length; i++) {
                user[keys[i]] = datatobeupdated[keys[i]];
            }
            // console.log("After Saving : ",user);
            // now updating the information in the database
            const updatedData = await userModel.findByIdAndUpdate(id,user);
            // console.log(updatedData);
            res.json({
                messages: "data updated successfully",
                data: user
            });
        } else {
            res.json({
                messages: "user not found",
            });
        }
    }
    catch (err) {
        res.json({
            message: err.message
        })
    }
    // for(key in datatobeupdated){
    //     users[key] = datatobeupdated[key];
    // }
    // let user = await userModel.findOneAndUpdate({email:'abc@gmail.com'},datatobeupdated);
}
// this method is basically for deleting a particular user
module.exports.deleteUser = async function deleteUser(req, res) {
    // users={};
    try{
        // extracting tne user id
        let id = req.params.id;
        // finding and then deleting
        let user = await userModel.findByIdAndDelete(id);
        if(!user){
            res.json({
                message : 'user not found'
            })
        }
        res.json({
            messages: "Data has been deleted",
            data: user
        })
    }
    catch(err){
        res.json({
            message : err.message
        })
    }
}
// this method will retrieve information of all the users stored in the database
module.exports.getAllUser = async function getAllUser(req,res){
    // finding all the users
    let users = await userModel.find();
    if(users){
        res.json({
            // displaying users
            message : "Data retrieved",
            data : users
        })
    }
}

module.exports.updateProfileImage = function updateProfileImage(req, res){
    res.json({
        message : 'File Uploaded Successfully'
    })
}