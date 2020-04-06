async function getReservation(req, res) {
    try {
        var fname = req.body.FirstName;
        var lname = req.body.LastName;
        var phone = req.body.Phone;
        var valid_id = req.body.validID;
		var room_number = req.body.RoomNumber;
		var checkInDate = req.body.checkInDate;
		var checkOutDate = req.body.checkOutDate;
		var customerID = req.body.customerID;

        console.log("Inserting " + fname + " " + lname + " into the database");
        //console.log("HashedPassword = " + hashedPassword);

        var sql = "INSERT INTO customer (first_name, last_name, phone, valid_id) VALUES ('"+ fname + "', '" + lname + "', '" + phone + "', '" + valid_id + "')";
		var sql2 = "INSERT INTO reservation (check_in_date, check_out_date, customer_id, room_number) VALUES ('"+ checkInDate + "', '" + checkOutDate + "', '" + customerID + "', '" + room_number + "')";
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
        res.redirect('/');
    }
    catch {
        res.redirect('/reservation');
        console.log('Please Try Again!');
    }
}