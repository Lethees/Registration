const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const bcrypt = require('bcrypt');
const saltRounds = 10;


function searchForUser(userName, userPassword, callback) {
    //validate a user and password
    var sql = "SELECT username, password FROM collection_owners WHERE username = $1::text";
    var params = [userName];

    pool.query(sql, params, function(error, db_results) {
        if (error) {
            console.log("An error occurred with the DB" + error);
            callback(error, null);
        }else if (db_results.rows.length == 0) {
            console.log("No match was found." + db_results.rows);
            callback(error, null);
        }else {
            //check password in db with user password using bcrypt.compare()
            var enteredPassword = userPassword;
            var hash = db_results.rows[0].password;
            
            bcrypt.compare(enteredPassword, hash, function(error, result) {
                if (result == true) {
                    callback(null, result);// returns results to userController.validateUser()

                }else {
                    console.log("The password is not a match.");
                    callback(error, null);// returns error to userController.validateUser()    
                }
            })    
        };     
    });
};

function insertNewUser(userName, password, callback) {
    //Create a new user and password
    var enteredPassword = password;
    bcrypt.hash(enteredPassword, saltRounds, function(err, hash) {
        var sql = "INSERT INTO collection_owners(username, password) VALUES ($1::text,$2::text)";
        var params = [userName, hash]; 

        pool.query(sql, params, function(err, db_results) {
            if (err) {
                console.log("An error occurred with the DB");
                console.log(err);
                callback(err, null);
            }else {
                //var results = {user:userName};
                callback(null, db_results);
            };
        });
    });
};

module.exports = {
    searchForUser: searchForUser,
    insertNewUser: insertNewUser
};