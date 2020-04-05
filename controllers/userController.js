const userModel = require("../models/dataModel.js");

function validateUser(req, res) {
    //validate a user and password
    var userName = req.body.userName; 
    var userPassword = req.body.userPassword; 

    userModel.searchForUser(userName, userPassword, function(error, result){//returns results to cc-clientside submitUser()
        if(error||result == null) {
            var message =  {success: false}; 
            res.json(message);
           
        }else {
            var message = ({success: true});
            res.json(message);   
        } 
    });
}

function createNewUser(req, res) {
    //Create a new user and password
    var userName = req.body.userName; 
    var password = req.body.userPassword;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phone = req.body.phone;
    var validId = req.body.validId;
     

    userModel.insertNewUser(userName, password, firstName, lastName, phone, validId, function(error, results) {
        res.json(results);
    }); 
};

module.exports = {
    validateUser: validateUser,
    createNewUser: createNewUser 

};