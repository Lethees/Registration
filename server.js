var express = require('express');
var session = require('express-session');

var app = express();


app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.set('port', (process.env.PORT || 5000))
.use(express.static(__dirname + '/public'))

.get("/", (req, res) => {
    res.sendFile("form.php", { root: __dirname + "/public"});
 });

 const userController = require("./controllers/userController.js");

 app.post("/login", userController.validateUser);
 app.post("/createAccount", userController.createNewUser);


app.get('/getPerson', getPerson);

app.get('/reservation', getReservation);

app.get('/dashboard', checkUserSession, function(req,res) {
	// Your code here
  });
  
  function checkUserSession( req, res, next )
  {
	  if( req.session.user_id )
	  {
		  next();
	  }
	  else
	  {
		res.send('You are not authorized to view this page');  
		res.redirect('/login');
	  }
  }  

// Start the server running
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


