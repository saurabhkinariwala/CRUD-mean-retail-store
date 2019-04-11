var serMod = angular.module('serviceModule',['factModule']);
var dataObj;
serMod.service('fetchData',function($http,$q){

  var self = this;
  self.customerObject={};

    this.getCatData = function(routeparam){
      var q = $q.defer();
      $http({
      method: 'GET',
      url: '/api/getCatData',
      params: {routeparam: routeparam}
      }).then(function successCallback(response) {
        q.resolve(response.data)
      }, function errorCallback(response) {
      });
      return q.promise;
    }

    this.getProductsData = function(routeparam){
      var q = $q.defer();
      $http({
      method: 'GET',
      url: '/api/getProductsData',
      params: {routeparam: routeparam}
      }).then(function successCallback(response) {
        q.resolve(response.data)
      }, function errorCallback(err) {
      });
      return q.promise;
    }

    this.getCustData = function(){
      var q = $q.defer();
      $http.get('/api/getCustData').then(function (response) {
        console.log(response);
        q.resolve(response.data);
      },function(error){
        q.reject(error);
      })
        return q.promise;
    }

    this.filterItem = function (item, cat) {
      var q = $q.defer();
      $http({
        url: '/api/filterItemNames',
        method: "GET",
        params: {item: item, cat: cat}
     }).then(function (response) {
        q.resolve(response.data);
      },function(error){
        q.reject(error);
      })
        return q.promise;
    }

    this.filterQty = function (qty, cat) {
      var q = $q.defer();
      $http({
        url: '/api/filterItemQty',
        method: "GET",
        params: {qty: qty, cat: cat}
     }).then(function (response) {
        q.resolve(response.data);
      },function(error){
        q.reject(error);
      })
        return q.promise;
    }

    this.loadMoreData = function (limit, skipCount, cat) {
      var q = $q.defer();
      $http({
        url: '/api/fetchLoadMoreData',
        method: "GET",
        params: {limit: limit, skipCount: skipCount, cat: cat}
     }).then(function (response) {
        q.resolve(response.data);
      },function(error){
        q.reject(error);
      })
        return q.promise;
    }

    this.filterOrder = function (orderText, fromDate, toDate) {
      var q = $q.defer();
      $http({
        url: '/api/filterOrder',
        method: "GET",
        params: {
                  orderText: orderText,
                  fromDate: fromDate, 
                  toDate: toDate
                }
     }).then(function (response) {
        q.resolve(response.data);
      },function(error){
        q.reject(error);
      })
        return q.promise;
    }

});

serMod.service('retailService', function($http,$localStorage, $q){
  var _self = this;
  var billDetails;


  this.getProductsCategory = function() {
    var q = $q.defer();
    $http({
    method: 'GET',
    url: '/api/getProductsCategory'
    }).then(function successCallback(response) {
      q.resolve(response.data)
    }, function errorCallback(error) {
      q.reject(error);
    });
    return q.promise;
  }

  this.getProductsById = function (id) {
    var q = $q.defer();
    $http({
    method: 'GET',
    url: '/api/getProductsById',
    params: { id: id }
    }).then(function successCallback(response) {
      q.resolve(response.data)
    }, function errorCallback(error) {
      q.reject(error);
    });
    return q.promise;
  };

  this.findOrderById = function (id) {
    var q = $q.defer();
    $http({
    method: 'GET',
    url: '/api/getCustData/'+id
    }).then(function successCallback(response) {
      q.resolve(response.data)
    }, function errorCallback(error) {
      q.reject(error);
    });
    return q.promise;
  };

	this.addProduct = function(obj){
    $http.post('/api/addProduct',obj);
  }
  
  this.setOrder = function(order){
    billDetails = order;
  }

  this.getOrder = function(){
    return billDetails;
  }

  this.getProdNames = function(selectedCat){
    var q = $q.defer();
    $http({
    method: 'GET',
    url: '/api/getProductsData',
    params: {routeparam: selectedCat}
    }).then(function successCallback(response) {
      var catProducts = response.data, prodNames=[];
          angular.forEach(catProducts, function(value, key) {
            prodNames.push({"key":catProducts[key]['_id'],"value":catProducts[key]['pName']});
          });

      q.resolve(prodNames);

    }, function errorCallback(error) {
        q.reject(error);
    });
    return q.promise;

  }

  this.updateQty = function(pdtId, updJson, callback){
    var ajaxObj={};
    ajaxObj.id = pdtId;
    ajaxObj.updJson = updJson;
    $http.post('/api/updateQty', ajaxObj).then(function successCallback(response){
        callback(response.data);
    });
  };

  this.updatePdt = function (object, callback) {
      
      $http.post('/api/updatePdt', object).then(function successCallback(response){
        callback(response.data);
    });
  }

  this.getTotalAmount= function(itemsArr){
      var total=0,j=0;
          for(j=0;j<itemsArr.length;j++){
              total=total+itemsArr[j].amount;
          }
      return total;
  }

  this.findAndPushOrder = function(orderObj){
    $http.post('/api/saveOrder', orderObj);
  }

  this.sendEmail = function(recvId){
    $http.post('/api/sendMail', recvId);
  }

  this.deleteItem = function (orderId) {
    $http.post('/api/deleteItem',{id: orderId}).then(function(data) {
      console.log(data);
    });
  }
    this.deleteProduct = function (pdtId) {
    $http.post('/api/deleteProduct',{id: pdtId}).then(function(data) {
      console.log(data);
    });
  }
  

  this.createDeliveryMemo = function (deliveryObj) {
    var q = $q.defer(); 
    $http.post('/api/createDeliveryMemo', deliveryObj).then(function successCallback(response){
      q.resolve(response);
    }, function errorCallback(err){
      q.reject(err);
    })

    return q.promise;
  }

  this.addPayment = function(id, paymentObj){
    var q = $q.defer();
    $http.post('/api/addPayment', {id: id, paymentObj: paymentObj}).then(function successCallback(response){
      q.resolve(response);
    }, function errorCallback(err){
      q.reject(err);
    })

    return q.promise;
  }

  this.getDeliveryData = function (){
    var q= $q.defer();
    $http({
      method: 'GET',
      url: '/api/deliveryData/'
      }).then(function successCallback(response) {
        q.resolve(response);
  
      }, function errorCallback(err) {
        q.reject(err)
      });
      return q.promise;

  }

  this.getDeliveryDataByOrder =function (selectedOrder){
    var q = $q.defer();
    $http({
    method: 'GET',
    url: '/api/deliveryData/'+ selectedOrder
    }).then(function successCallback(response) {
      q.resolve(response);

    }, function errorCallback(err) {
      q.reject(err)
    });
    return q.promise;
  }

  this.logout = function () {
    $http.get('/logout');
  }

  this.onLoad = function(reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.resolve(reader.result);
          });
      };
  };

  this.onError = function (reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.reject(reader.result);
          });
      };
  };

  this.onProgress = function(reader, scope) {
      return function (event) {
          scope.$broadcast("fileProgress",
              {
                  total: event.total,
                  loaded: event.loaded
              });
      };
  };

  this.readAsDataURL = function (file, scope) {
      var deferred = $q.defer();

      var reader = _self.getReader(deferred, scope);
      console.log(file);
      reader.readAsDataURL(file);

      return deferred.promise;
  };

  this.getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = _self.onLoad(reader, deferred, scope);
      console.log(reader.onload);
      reader.onerror = _self.onError(reader, deferred, scope);
      reader.onprogress = _self.onProgress(reader, scope);
      return reader;
  };
  
});



 // this.updateOrderStatus = function (selectedOrderObj, callback) {
  //   $http.put('/api/updateOrderStatus', selectedOrderObj).then(function successCallback(response) {
  //     callback(response.config.data.status);
  //   }, function errorCallback(error) {
  //     console.log('update status error occured');
  //   });
  // }
