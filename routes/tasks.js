/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
var database = require('../config/database.js');

router.get('/getProductsData', function(req, res){
  database.db.productsDetail.find({'cat_id': database.ObjectId((req.query.routeparam))}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/getProductsCategory', function (req, res){
  database.db.prdcategories.find(function (err, docs) {
    res.json(docs);
  });
});



router.post('/updateQty', function(req, res){
  database.db.productsDetail.findAndModify({
      query: {'_id' : database.ObjectId(req.body.id)},
      update: {
                $inc:{"qty" :parseInt(req.body.updJson.qtyAdded)},
                $push:{"addedItem":req.body.updJson}
              }, 
      new:true
  },  function (err, docs){
        res.json(docs);
  });
});

router.get('/getProductsById', function (req, res) {
    console.log(req.query.id);
  database.db.productsDetail.findOne({'_id': database.ObjectId(req.query.id)}, function (err, docs) {
    res.json(docs);
  });
});


//router.get('/getProductsData', function(req, res){
//  database.db.productsDetail.find({'cat_id': database.ObjectId((req.query.routeparam))}).limit(parseInt(req.query.skipPdts), function (err, docs) {
//    res.json(docs);
//  });
//});

//router.get('/getCatData', function(req, res){
//  database.db.productsDetail.find({cat:req.query.routeparam}, function (err, docs) {
//    res.json(docs);
//  });
//});

router.get('/filterItemNames', function (req,res) {
  database.db.productsDetail.find({"pName": {$regex: req.query.item, '$options': 'i'}, cat:req.query.cat}, function(err,docs){
    res.json(docs);
  });
});

router.get('/filterItemQty', function (req,res) {
  database.db.productsDetail.find({qty: {$gte: parseInt(req.query.qty)}, cat: req.query.cat}, function(err,docs){
    res.json(docs);
  });
});

router.get('/fetchLoadMoreData', function (req,res) {
  database.db.productsDetail.find({cat:req.query.cat}).skip(parseInt(req.query.skipCount)).limit(parseInt(req.query.limit), function (err, docs) {
    res.json(docs);
  });
});

router.get('/getProdCount', function (req,res) {
  database.db.productsDetail.aggregate([{ $match: {cat: req.query.cat}}, { $group: {_id: null, count: { $sum: 1 } } } ],function (err, docs){
    res.json(docs);
  } );
});


router.get('/filterOrder', function(req, res){
  database.db.orderDetails.createIndex({status: "text", name:"text", billNo:"number"}, function(){
    console.log(Number(req.query.orderText));
    database.db.orderDetails.find({$text: {$search:req.query.orderText }}, function (err, docs) {
      res.json(docs);
    });
  })

});

router.post('/updateOrderStatus', function (req, res) {
  database.db.orderDetails.update({'_id': ObjectID(req.body.id)},
    {
      $set:{"status" :req.body.status, "prodDetails":req.body.prodArray},
    }, function (err, docs){
      res.json(docs);
      console.log(docs);
  });
});



router.get('/getDeliveryData', function (req, res) {
  console.log(req.query.orderNo);
  database.db.deliveryMemo.find({orderNo: parseInt(req.query.orderNo)}, function (err, docs) {
    console.log(docs);
    res.json(docs);
  })
});

router.post('/createDeliveryMemo', function (req, res){
  database.db.deliveryMemo.insert(req.body, function (err, doc){
    res.json(doc);
  });
});

router.get('/updateOrder', function (req, res){


  //req.body.prodDetails.forEach(function(docs){
database.db.deliveryMemo.find({orderNo: parseInt(req.query.orderNo)}, function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
    
 // })
});


router.get('/getCustData', function (req, res) {
  database.db.orderDetails.find(function (err, docs){
    res.json(docs);
  })
})

router.post('/saveOrder', function (req, res){
  database.db.orderDetails.insert(req.body, function (err, doc){
    res.json(doc);
  });
});

router.post('/updateProductsQty', function (req, res){
  req.body.prodDetails.forEach(function (doc1) {
    database.db.productsDetail.update({id:doc1.id},
    {
      $inc:{"qty": parseInt("-"+doc1.dmndQty)},
      $push:{"addedItem":{"name":req.body.name, "qtySold":doc1.dmndQty, "manfDate":req.body.billDate, "fromPlace":req.body.address}}
    }, function (err, docs) {
      console.log(docs);
    })
  })

});

router.post('/addProduct', function (req, res) {
    req.body.cat_id = new mongojs.database.ObjectId(req.body.cat_id);
  database.db.productsDetail.insert(req.body, function (err, doc){
      console.log(doc);
    res.json(doc);
  });
});


router.post('/deleteItem', function (req, res) {
  database.db.orderDetails.remove({"billNo":req.body.billNo}, function (err, doc){
    res.send(doc);
  });
});

router.post('/deleteProduct', function (req, res) {
  database.db.productsDetail.remove({"_id": database.ObjectId(req.body.id)}, function (err, doc){
    res.send(doc);
  });
});

module.exports = (function(db){
    
    
    
    return router;
} )();
        
