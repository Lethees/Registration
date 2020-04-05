//handles requests from client, sends requests to the model, sends back to client
const dataModels = require("../models/collectionModels.js");

function seeCollections(req, res){

    var owner = req.query.owner;

    dataModels.getCollectionByOwner(owner, function(results) {
        res.json(results);
    });
   
};

function seeCollection(req, res) {

    var collection = req.query.collection; 

    dataModels.getCollectionByName(collection, function(results) {
        res.json(results);
    });
 
}

function createCollection(req, res) {
   
    var name = req.body.name;
    var owner = req.body.owner;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;

    dataModels.createNewCollection(name, owner, itemName, itemDesc, function(results) {
        var results = ({collection: name, owner: owner, item: itemName, description: itemDesc});
        res.json(results);
    });
    
}

function createItem(req, res) {
   
    var name = req.body.collectionName;
    var owner = req.body.collectionOwner;
    var itemName = req.body.itemName;
    var itemDesc = req.body.itemDesc;
                   
    dataModels.createNewItem(name, owner, itemName, itemDesc, function(results) {
        results = ({name:name, owner:owner, item:itemName, description:itemDesc});   
        res.json(results);
    });
    
}

module.exports = {
    seeCollections: seeCollections,
    seeCollection: seeCollection,
    createCollection: createCollection,
    createItem: createItem

};