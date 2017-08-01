var express = require('express');
var app = express();
var mongojs  = require('mongojs');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');

var db = mongojs('mongodb://skinar:MongoPass3191@ds111103.mlab.com:11103/productsandorders',['productsDetail','orderDetails', 'usersLogin']);
// var db = mongojs('local',['productsDetail','orderDetails','usersLogin']);

app.use(cookieParser());


var findById = function(id, cb) {
  db.usersLogin.find(function (err, docs) {
    process.nextTick(function() {
      var idx = id - 1;
      if (docs[idx]) {
        cb(null, docs[idx]);
      } else {
        cb(new Error('User ' + id + ' does not exist'));
      }
    });
  });
}

var findByUsername = function(username, cb) {
  db.usersLogin.find(function (err, docs) {
    process.nextTick(function() {
      for (var i = 0, len = docs.length; i < len; i++) {
        var record = docs[i];
        if (record.username === username) {
          return cb(null, record);
        }
      }
      return cb(null, null);
    });
  })
}


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
// Configure view engine to render EJS templates.
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy(
  function(username, password, cb) {
    findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  //Define routes.
  app.get('/',
    function(req, res) {
      res.render('home', { user: req.user });
    });


    app.get('/index',
  function(req, res){
    res.render('../index', { user: req.user });
  });


  app.get('/login',
    function(req, res){
      res.render('login');
    });

  app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('../index');
    });

    app.get('/*',
      function(req, res) {
        res.render('home', { user: req.user });
      });


  app.get('/logout',
    function(req, res){
      req.logout();
      res.redirect('/');
    });


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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
