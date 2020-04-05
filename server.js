const express = require('express');
const app = express();


// Following the "Single query" approach from: https://node-postgres.com/features/pooling#single-query

const { Pool } = require("pg"); // This is the postgres database connection module.

// This says to use the connection string from the environment variable, if it is there,
// otherwise, it will use a connection string that refers to a local postgres DB
const connectionString = process.env.DATABASE_URL || "postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v";

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({connectionString: connectionString});

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.set('port', (process.env.PORT || 5000))
.use(express.static(__dirname + '/public'))

.get("/", (req, res) => {
    res.sendFile("login.html", { root: __dirname + "/public"});
 });

// This says that we want the functions below to handle
// any requests that come to the /getPerson endpoint
app.get('/getPerson', getPerson);

app.post("/createAccount", createAccount);

app.get('/form.html', checkAuth, function (req, res) {
	res.send('if you are viewing this page it means you are logged in');
  });

  app.post('/login', function (req, res) {
	var post = req.body;
	if (post.user === 'john' && post.password === 'johnspassword') {
	  req.session.user_id = johns_user_id_here;
	  res.redirect('/my_secret_page');
	} else {
	  res.send('Bad user/pass');
	}
  });

  app.get('/logout', function (req, res) {
	delete req.session.user_id;
	res.redirect('/login');
  });   

// Start the server running
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// This function handles requests to the /getPerson endpoint
// it expects to have an id on the query string, such as: http://localhost:5000/getPerson?id=1
function getPerson(request, response) {
	// First get the person's id
	const id = request.query.id;

	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getPersonFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
		if (error || result == null || result.length != 1) {
			response.status(500).json({success: false, data: error});
		} else {
			const person = result[0];
			response.status(200).json(person);
		}
	});
}

function checkAuth(req, res, next) {
	if (!req.session.user_id) {
	  res.send('You are not authorized to view this page');
	} else {
	  next();
	}
  }

// This function gets a person from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getPersonFromDb(id, callback) {
	console.log("Getting customer from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = "SELECT * FROM customer WHERE id = $1::int";

	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	const params = [id];

	// This runs the query, and then calls the provided anonymous callback function
	// with the results.
	pool.query(sql, params, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

} // end of getPersonFromDb

function createAccount(req, res) {
    try {
       let email = req.query.email;
       let password = req.query.password;
 
       let SQL = `INSERT INTO ACCOUNT (email, password) VALUES ('${email}', '${password}');`;
 
       pool.query(SQL, (err, result) => {
          if (err) {
             throw(`Card: ${err.message}`);
          }
 
          login(req, res);
          res.write("Done");
          res.end();
       });
    }
    catch(error) {
       res.write(error);
       res.end();
    }
 }
 
/****************************************************************
 * These methods should likely be moved into a different module
 * But they are here for ease in looking at the code
 ****************************************************************/

// Checks if the username and password match a hardcoded set
// If they do, put the username on the session
function handleLogin(request, response) {
	var result = {success: false};

	// We should do better error checking here to make sure the parameters are present
	if (request.body.username == "admin" && request.body.password == "password") {
		request.session.user = request.body.username;
		result = {success: true};
	}

	response.json(result);
}

// If a user is currently stored on the session, removes it
function handleLogout(request, response) {
	var result = {success: false};

	// We should do better error checking here to make sure the parameters are present
	if (request.session.user) {
		request.session.destroy();
		result = {success: true};
	}

	response.json(result);
}

// This function returns the current server time
function getServerTime(request, response) {
	var time = new Date();
	
	var result = {success: true, time: time};
	response.json(result); 
}

// This is a middleware function that we can use with any request
// to make sure the user is logged in.
function verifyLogin(request, response, next) {
	if (request.session.user) {
		// They are logged in!

		// pass things along to the next function
		next();
	} else {
		// They are not logged in
		// Send back an unauthorized status
		var result = {success:false, message: "Access Denied"};
		response.status(401).json(result);
	}
}

// This middleware function simply logs the current request to the server
function logRequest(request, response, next) {
	console.log("Received a request for: " + request.url);

	// don't forget to call next() to allow the next parts of the pipeline to function
	next();
}