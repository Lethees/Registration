// Following the "Single query" approach from: https://node-postgres.com/features/pooling#single-query

const { Pool } = require("pg"); // This is the postgres database connection module.

// This says to use the connection string from the environment variable, if it is there,
// otherwise, it will use a connection string that refers to a local postgres DB
const connectionString = process.env.DATABASE_URL || "postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v";

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({connectionString: connectionString});

//const bcrypt = require('bcrypt');
const saltRounds = 10;


function searchForUser(userName, userPassword, callback) {
    //validate a user and password
    var sql = "SELECT username, password FROM login WHERE username = $1::text";
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
            
           // bcrypt.compare(enteredPassword, hash, function(error, result) {
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

function insertNewUser(userName, password, firstName, lastName, phone, validId, callback) {
    //Create a new user and password
    var enteredPassword = password;
    bcrypt.hash(enteredPassword, saltRounds, function(err, hash) {
        var sql1 = "INSERT INTO login (username, password) VALUES ($1::text,$2::text)";
        
        var params = [userName, hash];
        

        pool.query(sql1, params, function(err, db_results) {
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
   /* var sql2 = "INSERT INTO customer (firstName, lastName, phone, validId, username) VALUES ($3::text, $4::text, $5::text, $6::text $1::text)";
    var params2 = [firstName, lastName, phone, validId, userName];
    pool.query(sql2, params2, function(err, db_results) {
        if (err) {
            console.log("An error occurred with the DB");
            console.log(err);
            callback(err, null);
        }else {
            //var results = {user:userName};
            callback(null, db_results);
        };
    }); */
};

module.exports = {
    searchForUser: searchForUser,
    insertNewUser: insertNewUser
};