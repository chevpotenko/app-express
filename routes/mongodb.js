const express = require('express');
const Articles = require('../models/article');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'nodekb';
const collectionName = 'articles';

const findDocuments = function(db, callback) {
    const collection = db.collection(collectionName);
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

const insertDocument = function(db, item, callback) {
    const collection = db.collection(collectionName);
    collection.insertOne(item, function(err, result) {
        assert.equal(null, err);
         callback(result);
    });
}

const updateDocument = function(db, id, item, callback) {
    const collection = db.collection(collectionName);
    collection.updateOne({ _id : objectId(id)}, {$set: item}, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });  
}

const removeDocument = function(db, id, callback) {
    const collection = db.collection(collectionName);
    collection.deleteOne({ _id : objectId(id)}, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });    
}

router.get('/', (req, res) => {
    var data = [];    
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        findDocuments(db, function(docs) {
            res.render('mongo', {data: docs});
            client.close();
        });
    }); 
});

router.post('/', (req, res) => {
    var item = {
        title: req.body.title,        
        author: req.body.author,
        body: req.body.body
    };

    var id = req.body.id;

    mongo.connect(url, function(err, client) {        
        assert.equal(null, err);
        var db = client.db(dbName);

        if (req.body._method === 'UPDATE') {
            updateDocument(db, id, item, function() {
                client.close();
                res.redirect('/mongodb');
            });
        } else if (req.body._method === 'DELETE') {
            // removeDocument(db, id, function() {
            //     client.close();
            //     res.redirect('/mongodb');
            // });
        } else {
            insertDocument(db, item, function() {
                client.close();
                res.redirect('/mongodb');
            });
        }
    });
});

router.post('/delete', (req, res) => {
    var item = {
        title: req.body.title,        
        author: req.body.author,
        body: req.body.body
    };

    var id = req.body.id;

    mongo.connect(url, function(err, client) { 
        assert.equal(null, err);
        var db = client.db(dbName);
        removeDocument(db, id, function() {
            client.close();
            res.redirect('/mongodb');
        });           
    });
});

 module.exports = router;