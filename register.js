const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v";

const pool = new Pool({ connectionString: connectionString });

async function register(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        var fname = req.body.first;
        var lname = req.body.lastname;
        var phone = req.body.phone;
        var valid_id = req.body.validId;
        var username = req.body.username;
        //var password = req.body.password;

        console.log("Inserting " + fname + " " + lname + " into the database");
        //console.log("HashedPassword = " + hashedPassword);

        var sql = "INSERT INTO login (username, password) VALUES ('"+ username + "', '" + hashedPassword  + "')";
        var sql2 = "INSERT INTO customer (first_name, last_name, phone, valid_id, username) VALUES ('"+ fname + "', '" + lname + "', '" + phone + "', '" + valid_id + "', '" + username + "')";
        pool.query(sql, function(err, res){
            if (err) {
                console.log("ERROR inserting new account into database!!!");
                console.log(err);
            }
            console.log("SUCCESS! A new account has been inserted");
        });
        pool.query(sql2, function(err, res){
            if (err) {
                console.log("ERROR inserting new customer into database!!!");
                console.log(err);
            }
            console.log("SUCCESS! A new customer has been inserted");
        });
        res.redirect('/login');
    }
    catch {
        res.redirect('/sign_up');
        console.log('Please Try Again!');
    }
}

module.exports = { register: register };