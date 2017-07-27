var express = require('express');
var app = express();
var mongojs  = require('mongojs');
var bodyParser = require('body-parser');

var db = mongojs('local',['productsDetail','orderDetails']);


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.post('/getCatData', function(req, res){
  db.productsDetail.find({cat:req.body.data}, function (err, docs) {
    res.json(docs);
  });
});

app.post('/getProductsById', function (req, res) {
  db.productsDetail.findOne({id:req.body.data}, function (err, docs) {
    res.json(docs);
  })
});

app.post('/updateQty', function(req, res){
  db.productsDetail.update({ id :req.body.origData.id},
    {
      $set:{"qty" :req.body.origData.qty},
      $push:{"addedItem":req.body.updJson}
    }, function (err, docs){
  });
});

app.get('/getCustData', function (req, res) {
  db.orderDetails.find(function (err, docs){
    res.json(docs);
  })
})

app.post('/saveOrder', function (req, res){
  db.orderDetails.insert(req.body, function (err, doc){
    res.json(doc);
  });
});

app.post('/updateProductsQty', function (req, res){
  req.body.prodDetails.forEach(function (doc1) {
    db.productsDetail.update({id:doc1.id},
    {
      $inc:{"qty": parseInt("-"+doc1.dmndQty)},
      $push:{"addedItem":{"name":req.body.name, "qtySold":doc1.dmndQty, "manfDate":req.body.billDate, "fromPlace":req.body.address}}
    }, function (err, docs) {
      console.log(docs);
    })
  })

});

app.post('/addProduct', function (req, res) {
  db.productsDetail.insert(req.body, function (err, doc){
    res.json(doc);
  });
});

app.post('/deleteItem', function (req, res) {
  db.orderDetails.remove({"billNo":req.body.billNo}, function (err, doc){
    res.send(doc);
  });
});

app.listen(5000);
console.log("Server running on port 5000");
