/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var database = require('../config/database.js');


var findById = function(id, cb) {
  database.db.usersLogin.find(function (err, docs) {
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
  database.db.usersLogin.find(function (err, docs) {
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
};

passport.use(new Strategy(
  function(username, password, cb) {
    findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password !== password) { return cb(null, false); }
      console.log("aut");
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
  
  module.exports = {
      
      passport
  };
  

