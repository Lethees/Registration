// Following the "Single query" approach from: https://node-postgres.com/features/pooling#single-query

const { Pool } = require("pg"); // This is the postgres database connection module.

// This says to use the connection string from the environment variable, if it is there,
// otherwise, it will use a connection string that refers to a local postgres DB
const connectionString = process.env.DATABASE_URL || "postgres://mhbcyrmdbvoijw:0480dbecdc962bd96d8d2b8095bf40d06c69952effb1579597d5bffe6da2be45@ec2-34-193-42-173.compute-1.amazonaws.com:5432/d6babf4h0j1n8v";

// Establish a new connection to the data source specified the connection string.
const pool = new Pool({connectionString: connectionString});

function getCollectionByName(collection, callback) {
     var sql = "SELECT item_name, item_description FROM collections WHERE collection_name = $1::text";
     var params = [collection];

     pool.query(sql, params, function(err, db_results) {
        if (err) {
            console.log("An error occurred with the DB");
            console.log(err);
            callback(err, null);
        } else { 
           var results = {
               collection:db_results.rows
           };
          callback(results);//returns results to collectionController.seeCollection();
       }
    });  
};

function getCollectionByOwner(owner, callback) {
    var sql = "SELECT DISTINCT collection_name FROM collections WHERE collection_owner = $1::text";
    var params = [owner];
    
    pool.query(sql, params, function(err, db_results) {
        if (err) {
            console.log("An error occurred with the DB");
            console.log(err); 
            callback(err, null);
        } else {
           var results = {
               collection:db_results.rows
           };
           callback(results);// returns results to collectionController.seeCollections()
       }
    });
};

function createNewCollection(name, owner, itemName, itemDesc, callback) {
    var sql = "INSERT INTO collections(collection_name, collection_owner, item_name, item_description) VALUES ($1::text, $2::text, $3::text, $4::text)";
    var params = [name, owner, itemName, itemDesc];

    pool.query(sql, params, function(err, db_results) {
        if (err) {
            console.log("An error occurred with the DB");
            console.log(err);
            callback(err, null);
        } else {
           callback(db_results);// returns results to collectionController.createCollection()
       }      
    });
};

function createNewItem(name, owner, itemName, itemDesc, callback) {
    var sql = "INSERT INTO collections(collection_name, collection_owner, item_name, item_description) VALUES ($1::text, $2::text, $3::text, $4::text)";
    var params = [name, owner, itemName, itemDesc];

    pool.query(sql, params, function(err, db_results) {
        if (err) {
            console.log("An error occurred with the DB");
            console.log(err);
            callback(err, null);
        } else {
           callback(db_results);// returns results to collectionController.createItem()   
        }
    });
}


module.exports = {
    getCollectionByName: getCollectionByName,
    getCollectionByOwner: getCollectionByOwner,
    createNewCollection: createNewCollection,
    createNewItem: createNewItem
};