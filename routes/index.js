/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var router = express.Router();
var authenticate = require('./authenticate.js');

var ensureAuthenticated = function (req, res, next){
    let isReq = req.isAuthenticated();
    
        console.log("req",isReq);
	if(isReq === true){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
};


router.get('/', ensureAuthenticated, function(req, res){
    res.redirect('index');
});

  router.get('/index',ensureAuthenticated,
  function(req, res){
  
    res.render('index', { user: req.user });
  });
  
    
router.get('/login',
  function(req, res){
    res.render('login');
  });

router.post('/login',
  authenticate.passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {     
    res.redirect('index')
  });


router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

module.exports = router; 