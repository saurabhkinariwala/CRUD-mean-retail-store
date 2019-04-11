/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
var database = require('../config/database.js');
var EmailClass = require('./mailing.js');

router.get('/getProductsCategory', function (req, res){
  database.db.prdcategories.find(function (err, docs) {
    res.json(docs);
  });
});

router.get('/getProductsData', function(req, res){
  database.db.productsDetail.find({'cat_id': database.ObjectId((req.query.routeparam))}, function (err, docs) {
    res.json(docs);
  });
});

router.get('/getProductsById', function (req, res) {
  database.db.productsDetail.findOne({'_id': database.ObjectId(req.query.id)}, function (err, docs) {
    res.json(docs);
  });
});

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

router.post('/addProduct', function (req, res) {
  req.body.cat_id = database.ObjectId(req.body.cat_id);
database.db.productsDetail.insert(req.body, function (err, doc){
  res.json(doc);
});
});

router.post('/updatePdt', function(req, res){
  database.db.productsDetail.findAndModify({
      query: {'_id': database.ObjectId(req.body.pdtId)},
      update: {
          $set: {"pName" : req.body.pdtName, "price" : req.body.price}
      },
      new: true
  }, function (err, docs){
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

router.post('/deleteProduct', function (req, res) {
  database.db.productsDetail.update({"_id": database.ObjectId(req.body.id)}, 
    {
      $set: {isDelete: true}
    }, function (err, doc){
    res.send(doc);
  });
});

// ----------------------------------------Products API ends here--------------------------------------

// ----------------------------------------Order API starts here----------------------------------------


router.post('/saveOrder', function (req, res){
  database.db.orderDetails.insert(req.body, function (err, doc){
    res.json(doc);
    console.log(doc);
    doc.prodDetails.forEach(function (doc1) {
      database.db.productsDetail.update({_id:database.ObjectId(doc1.id)},
      {
        $inc:{"qty": parseInt("-"+doc1.dmndQty)},
        $push:{"addedItem":{"orderNo":doc.billNo, "orderId":doc._id, "name":doc.name, "qtySold":doc1.dmndQty, "manfDate":doc.billDate, "fromPlace":doc.address}}
      }, function (err, docs) {
      })
    });
  });
});

router.get('/getCustData', function (req, res) {
  database.db.orderDetails.find(function (err, totalDocs){
    let nonDeletedDocs = totalDocs.filter(function (obj) {
      return obj.isDelete === false;
    });
    const orderLists = {
      totalDocs : totalDocs,
      nonDeletedDocs : nonDeletedDocs
    }
    res.json(orderLists);
  })
});

router.get('/getCustData/:id', function (req, res) {
  database.db.orderDetails.findOne({_id:database.ObjectId(req.params.id)}, function (err, docs){
    res.json(docs);
  })
})

router.get('/filterOrder', function(req, res){
  var orderTextQuery = req.query.orderText,
    dateQuery = req.query.fromDate || req.query.toDate,
    query = {};
    query['$and']=[];

  if (orderTextQuery) {
    query['$and'].push({'$or': [{delvStatus: {$regex: req.query.orderText, $options: "$i"}},
    {name: {$regex: req.query.orderText, $options: "$i"}}, 
    {billNo: parseInt(req.query.orderText)}]})
  }
  
  if (dateQuery) {
    query['$and'].push({billDate: {$gte: new Date(req.query.fromDate).toISOString(), $lt: new Date(req.query.toDate).toISOString()}});
  }

  if(!orderTextQuery && !dateQuery) {
    query['$and'].push({isDelete: false});
  }

  query['$and'].push({isDelete: false});
  
    database.db.orderDetails.find(query, function(err, docs){
      console.log(query);
        res.json(docs);
    });

});


router.put('/updateOrderStatus', function (req, res) {
  database.db.orderDetails.update({'_id': database.ObjectId(req.body.id)},
    {
      $set:{"delvStatus" :req.body.status, "prodDetails":req.body.prodArray},
    }, function (err, docs){
      res.json(docs);
  });
});

router.post('/addPayment', function (req, res) {

  database.db.orderDetails.findAndModify({
    query:{'_id': database.ObjectId(req.body.id)},
    update: {
      $inc:{"balance": parseInt("-"+req.body.paymentObj.amount)},
      $push:{"payments":req.body.paymentObj}
    },
    new: true
  }, function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

router.post('/deleteItem', function (req, res) {
  database.db.orderDetails.findAndModify({
    query:{"_id":database.ObjectId(req.body.id)},
    update: {
              $set : {isDelete: true}
  }}, 
  function (err, doc){
    res.json(doc);
    doc.prodDetails.forEach(function (doc1) {
      database.db.productsDetail.update({_id:database.ObjectId(doc1.id)},
      {
        $inc:{"qty": parseInt(doc1.dmndQty)},
        $pull:{"addedItem":{"orderId":doc._id, "name":doc.name, "qtySold":doc1.dmndQty, "manfDate":doc.billDate, "fromPlace":doc.address}}
      }, function (err, docs) {
      })
    });

  });
});

// -------------------------------------Order API ends here--------------------------------

// --------------------------------Delivery memo API starts here--------------------------------

router.post('/createDeliveryMemo', function (req, res){
  database.db.deliveryMemo.insert(req.body, function (err, doc){
    
    database.db.orderDetails.findOne({_id: database.ObjectId(doc.orderId)}, function (err, orderDoc) {
      const prodDetails = orderDoc.prodDetails.map(function(orderPdt){
        doc.deliveryDetails.forEach(function (pdtObj){
          var count = 0;
          if(pdtObj.pdtName.id === orderPdt.id){
            orderPdt.balQty -= pdtObj.sentQty;
            if(orderPdt.balQty === 0){
              count++;
            }
          }
          if(count === doc.deliveryDetails.length){
            delvStatus = "Completed";
          } else {
            delvStatus = "Pending";
          }
        }) 
        return orderPdt;       
      });
      database.db.orderDetails.findAndModify({
        query: {_id:database.ObjectId(doc.orderId)},
        update: {
                  $set:{"prodDetails": prodDetails, "delvStatus": delvStatus},             
                }, 
        new: true}, function (err, docs) {
                  res.json(docs);
          });
      });
    });
});

router.get('/deliveryData', function (req,res){
  database.db.deliveryMemo.find(function (err, docs){
    res.json(docs);
  })

})
router.get('/deliveryData/:id', function (req, res) {
  database.db.deliveryMemo.find({orderId: req.params.id}, function (err, docs) {
    res.json(docs);
  })
});


router.post('/sendMail', function(req, res) {
  var email = new EmailClass(req.body.receiverId);
  email.sendEmail();
})

// -------------------------------------Delivery memo API  ends here--------------------------------


module.exports = (function(db){    
    return router;
} )();
        












// router.get('/getProdCount', function (req,res) {
//   database.db.productsDetail.aggregate([{ $match: {cat: req.query.cat}}, { $group: {_id: null, count: { $sum: 1 } } } ],function (err, docs){
//     res.json(docs);
//   } );
// });

// router.get('/filterOrder', function(req, res){
//   var orderTextQuery = req.query.orderText,
//     dateQuery = req.query.fromDate || req.query.toDate,
//     query = {};
//     query['$or']=[];

//   if (orderTextQuery) {
//     query["$or"].push({status: {$regex: req.query.orderText, $options: "$i"}},
//                    {name: {$regex: req.query.orderText, $options: "$i"}}, 
//                    {billNo: parseInt(req.query.orderText)})
//   }
  
//   if (dateQuery) {
//     query.billDate = {$gte: new Date(req.query.fromDate).toISOString(), $lt: new Date(req.query.toDate).toISOString()}
//   }

//   if(!orderTextQuery && !dateQuery) {
//     query = {};
//   }

//   query.isDelete = false;
  
//     database.db.orderDetails.find(query, function(err, docs){
//       console.log(query);
//         res.json(docs);
//     });

// });

// function getQuery(orFields, fromDate, toDate){
//   var query = {};
  
//   if(typeof orFields !== 'undefined' ) {
    

//   }
//   return query = {
//     $and : [
//             {
//               $or : [
//                       {status: {$regex: req.query.orderText, $options: "$i"}},
//                       {name: {$regex: req.query.orderText, $options: "$i"}}, 
//                       {billNo: parseInt(req.query.orderText)}
//                     ]
//             },
//             {isDelete: false},
//             {billDate: {$gte: new Date(req.query.fromDate).toISOString(), $lt: new Date(req.query.toDate).toISOString()}}
//           ]
//         };

// }




// router.post('/deleteProduct', function (req, res) {
//   database.db.productsDetail.remove({"_id": database.ObjectId(req.body.id)}, function (err, doc){
//     res.send(doc);
//   });
// });





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



// router.get('/filterOrder', function(req, res){
//   database.db.orderDetails.createIndex({status: "text", name:"text", billNo:"number"}, function(){
//     database.db.orderDetails.find({$text: {$search:req.query.orderText }}, function (err, docs) {
//       res.json(docs);
//     });
//   })

// });