/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongojs  = require('mongojs');
var ObjectId = mongojs.ObjectId;

// var db = mongojs('mongodb://skinar:MongoPass3191@ds111103.mlab.com:11103/productsandorders',['productsDetail','orderDetails','deliveryMemo', 'usersLogin']);
var db = mongojs('local',['productsDetail','orderDetails','usersLogin','deliveryMemo']);


module.exports = {db, ObjectId};
                
