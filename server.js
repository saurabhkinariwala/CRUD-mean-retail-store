var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

var passport = require('passport');
var Strategy = require('passport-local').Strategy;


app.use(require('express-session')({ 
    secret: 'keyboard cat', 
    resave: false, 
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

//var authenticate = require('./routes/authenticate.js');
var index = require('./routes/index.js');
var tasks = require('./routes/tasks.js');


// Configure view engine to render EJS templates.
app.set('views', path.join(__dirname, 'views')); //defines templating and where view files will stay
app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json({limit:'50mb'})); //allows req.body to retrieve data from frontend
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //gives access to public folder


  //Define routes.
  
app.use('/', index);
app.use('/api', tasks)




app.get('*',
  function(req, res) {
      console.log(req.url)
   res.redirect('/index?route=' + req.url);
  });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




// var db = mongojs('mongodb://skinar:MongoPass3191@ds111103.mlab.com:11103/productsandorders',['productsDetail','orderDetails','deliveryMemo', 'usersLogin']);
//var db = mongojs('local',['productsDetail','orderDetails','usersLogin','deliveryMemo']);

// swig and handle bar requires to declare which templating engine we are going to use
// jade and ejs doesnt require this
// app.engine('html', swig.renderFile)

// app.engine('handlebars', handlebars.engine);
// app.set('view engine', 'handlebars');