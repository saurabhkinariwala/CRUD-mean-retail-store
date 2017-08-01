var serMod = angular.module('serviceModule',['factModule']);
var dataObj;
serMod.service('fetchData',function($http,$q){

  var self = this;
  self.customerObject={};

    this.getCatData = function(routeparam){
      var q = $q.defer();
      $http({
      method: 'POST',
      url: '/getCatData',
      data: { data: routeparam }
      }).then(function successCallback(response) {
        q.resolve(response.data)
      }, function errorCallback(response) {
    });
      return q.promise;
    }


    this.getCustData = function(){
      var q = $q.defer();
      $http.get('/getCustData').then(function (response) {
        console.log(response);
        q.resolve(response.data);
      },function(error){
        q.reject(error);
      })
        return q.promise;
    }

});

serMod.service('retailService', function($http,$localStorage, $q){

	this.getOptions = function(){
		return ['Select Category','Mobiles','Sunglasses','Books','Laptops'];
	}

  this.getProductsById = function (id) {
    var q = $q.defer();
    $http({
    method: 'POST',
    url: '/getProductsById',
    data: { data: id }
    }).then(function successCallback(response) {
      q.resolve(response.data)
    }, function errorCallback(error) {
      q.reject(error);
  });
    return q.promise;
  };

	this.addProduct = function(obj){
    $http.post('/addProduct',obj);
	}


  this.getProdNames = function(selectedCat){
    var q = $q.defer();
    $http({
    method: 'POST',
    url: '/getCatData',
    data: { data: selectedCat }
    }).then(function successCallback(response) {
      var catProducts = response.data, prodNames=[];
          angular.forEach(catProducts, function(value, key) {
            prodNames.push({"key":catProducts[key]['id'],"value":catProducts[key]['pName']});
          });

      q.resolve(prodNames);

    }, function errorCallback(response) {
  });
  return q.promise;

  }

  this.updateQty = function(Id, updJson, index, origData){
    var ajaxObj={};
    origData['qty'] = origData['qty']+updJson.qtyAdded;
    ajaxObj.origData = origData;
    ajaxObj.updJson = updJson;
    $http.post('/updateQty', ajaxObj);
  }

  this.updatePdt = function (id, object, index) {
    var selectCat = Id.split("-")[0];
    $localStorage.products.categories[selectCat][index]['pName'] = object.pName;
    $localStorage.products.categories[selectCat][index]['price'] = object.price;
  }

  this.getTotalAmount= function(itemsArr){
      var total=0,j=0;
          for(j=0;j<itemsArr.length;j++){
              total=total+itemsArr[j].amount;
          }
      return total;
  }

  this.findAndPushOrder = function(orderObj){
    $http.post('/saveOrder', orderObj);
  }

  this.updateProductsQty = function(billObj){
    $http.post('/updateProductsQty', billObj);
  }


  this.deleteItem = function (orderObj) {
    $http.post('/deleteItem',orderObj).then(function(data) {
      console.log(data);
    });
  }
  this.logout = function () {
    $http.get('/logout');
  }
});
