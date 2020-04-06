const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v";

const pool = new Pool({ connectionString: connectionString });

function allow(req, res) {
    var username = req.session.username;

    updateNewUser(username, function (error, result) {
        if (error) {
            res.status(500).json({ success: false, data: error });
            return;
        }
        else {
            getUserFromDB(username, function (error, result) {
                if (error || result == null || result.length != 1) {
                    res.status(500).json({ success: false, data: error });
                    return;
                }
                else {

                    console.log("String from DB: ", result);
                    const person = result[0];
                    var objectValue = person;

                    var id = objectValue['id'];
                    var fname = objectValue['first_name'];
                    var lname = objectValue['last_name'];
                    var email = objectValue['person_email'];
                    var newUser = objectValue['new_person'];
                    var city = objectValue['city'];
                    var state = objectValue['state'];

                    var params = { id: id, fname: fname, lname: lname, email: email, newUser: newUser, city: city, state: state };

                    res.render('previous_trips', params);
                }
            });
        }
    });
}

function updateNewUser(username, callback) {
    console.log("Updating newUser from DataBase with username: " + username);
    const sql = "UPDATE person SET new_person='False' WHERE USER_NAME = $1::VARCHAR";

    const params = [username];

    pool.query(sql, params, function (error, res) {
        if (error) {
            console.log("ERROR on query: ");
            console.log(error);
            callback(error, null);
            return;
        }

        console.log("Updated result is true");
        callback(null, res.rows);
    });
}

function getUserFromDB(username, callback) {

    console.log("Getting person from DataBase with username: " + username);
    const sql = "SELECT id, first_name, last_name, person_email, new_person, city, state FROM person WHERE USER_NAME = $1::VARCHAR";

    const params = [username];

    pool.query(sql, params, function (error, res) {
        if (error) {
            console.log("ERROR on query: ");
            console.log(error);
            callback(error, null);
            return;
        }

        console.log("Found result: " + JSON.stringify(res.rows));
        callback(null, res.rows);
    });
}


module.exports = { allow: allow };