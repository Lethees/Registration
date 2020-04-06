const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v";


const pool = new Pool({ connectionString: connectionString });


function login(req, res) {

    console.log("Loading")

    var username = req.session.username;
    var password = req.session.password;

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

            var params = { id: id};

            res.render('index.ejs', params);

        }
    });
}

function getUserFromDB(username, callback) {

    console.log("Getting person from DataBase with username: " + username);
    const sql = "SELECT id FROM login WHERE username = $1::VARCHAR";

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

module.exports = { login: login };