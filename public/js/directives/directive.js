myModule.directive('pdtModal',['retailService',function(retailService){
  return{
    restrict: 'E',
    scope:{
      data: '=data',
      prodcat: '=prodcat'
    },
    templateUrl:'../views/prodModal.html',
    link: function(scope,element,attrs) {
      scope.$watch('data', function(data) {
     });
     scope.upd=function(pdtId, obj){
       retailService.updateQty(pdtId, obj, function (response){
           angular.forEach(scope.prodcat, function(value, key){
              if(value['_id'] === pdtId){
                  scope.prodcat[key] = response;
              }
           });
       });
       scope.myData = {};
       scope.prodDetails.$setPristine();
       $('#myModal').modal('hide');
    }

    },
    controller: function($scope, $element, $attrs, $location) {


      }
  }
}]);


myModule.directive('orderDetails',['retailService',function(retailService){
  return{
    restrict:'E',
    scope:{
      data: '='
    },
    templateUrl:'../views/orderDetails.html',
    link:function(scope,element,attrs){
      scope.updStatus = function(){
    
      }
    }
  }
}]);

myModule.directive('deliveryMemo',['retailService',function(retailService) {
  return{
    restrict:'E',
    scope:{
      deliverydata: '=data',
      orderdetail:'=orderdetails'
    },
    templateUrl:'../views/deliveryMemo.html',
    link:function(scope,element,attrs){
  
    }
  }
}]);

myModule.directive('downloadOrder', ['retailService', function(retailService) {
  return{
    restrict: 'E',
    scope:{
      data: '='
    },
    templateUrl: '../views/downloadOrder.html',
    link: function(scope, element, attrs){
      console.log("Inside directive: " + scope.data);
    }
  }
}])

myModule.directive('makePayment', ['retailService', function(retailService) {
  return{
    restrict: 'E',
    scope:{
      data: '=',
      orderList: '=',
      index: '='
    },
    templateUrl: '../views/makePayment.html',
    link: function(scope, element, attrs){
      scope.submitPayment = function(id, paymentObj){
        retailService.addPayment(id, paymentObj).then(function(res){
          scope.orderList[scope.index] = res.data;
        }, function(){});
      }
    }
  }
}])

myModule.directive('createDeliveryMemo',['retailService',function(retailService) {
  return{
    restrict:'E',
    scope:{
      data: '=data',
      orderList: '=orderList',
      index: '=index'
    },
    templateUrl:'../views/createDeliveryMemo.html',
    link:function(scope,element,attrs){
        var deliveryNumber;
        scope.deliveryObj = {};
        // scope.deliveryObj.deliveryDetails = [];
        scope.editDeliveryBtn = false;
   
        scope.$watch('data', function(data) {
          if(scope.data){
            retailService.getDeliveryData().then(function(res) {
                deliveryNumber = deliveryNumber || 0;
                deliveryNumber = res.data.length + 1;
                scope.deliveryObj.deliveryNumber = deliveryNumber;
              
            })
            // scope.deliveryObj.orderId = scope.data._id;
            scope.prodOptions=[];
            scope.sentProduct={};
            scope.sentProduct.pdtName={};
            scope.prodOptions.push({"id":0,"prodName": 'Select Product'});
            scope.sentProduct.pdtName = scope.prodOptions[0];
            angular.forEach(scope.data.prodDetails, function (value, key) {
              scope.prodOptions.push({"id":value.id, "prodName": value.pName});
            });
          }


        scope.deliverProdBlur = function(selectedVal){
          angular.forEach(scope.data.prodDetails, function (value, key){
            if(scope.sentProduct.pdtName.id === value.id){
                  scope.sentProduct.orderQty = value.dmndQty;
                  scope.sentProduct.balQty = value.balQty;
            }
          });
        }

        scope.addDeliveryItem = function(isValid){
          if(scope.sentProduct.balQty >= scope.sentProduct.sentQty && isValid){
            if(typeof scope.deliveryObj.deliveryDetails === 'undefined'){
              scope.deliveryObj.orderId = scope.data._id;
              scope.deliveryObj.deliveryDetails = [];
            }
            scope.deliveryObj.deliveryDetails.push(scope.sentProduct);
            scope.deliveryForm.$setPristine();
            scope.sentProduct={};
            scope.sentProduct.pdtName = scope.prodOptions[0];
            
          } else {
            alert('Sent qty should be less than bal qty');
          }
        }

        scope.editDeliveryItem =function(prodObj, indx){
          scope.sentProduct = angular.copy(prodObj);
          scope.sentProduct.pdtName = prodObj.pdtName;
          scope.editDeliveryBtn = true;
          scope.editIndex = indx;
        }

        scope.updateDeliveryItem =function (){
          scope.deliveryObj.deliveryDetails[scope.editIndex] = scope.sentProduct;
          scope.deliveryForm.$setPristine();
          scope.sentProduct={};
          scope.sentProduct.pdtName = scope.prodOptions[0];
          scope.editDeliveryBtn = false;
        }

        scope.deleteDeliveryItem = function(index){
          scope.deliveryObj.deliveryDetails.splice(index,1);
        }

        scope.createDeliveryMemo = function(){
          retailService.createDeliveryMemo(scope.deliveryObj).then(function(res){
            scope.data = res.data;
            scope.orderList[scope.index] = res.data;
            ++deliveryNumber;
            scope.deliveryObj={};
          });
        }
      });
    }
  }
}]);

myModule.directive('editProduct',function (retailService) {
  return{
    restrict:'E',
    scope:{
      data:'=',
      prodcat:'='
    },
    templateUrl:'../views/editProduct.html',
    link:function (scope,element,attrs) {
      scope.upd = function (obj) {
        retailService.updatePdt(obj, function(response){
            angular.forEach(scope.prodcat, function(value, key){
              if(value['_id'] === obj.pdtId){
                  scope.prodcat[key] = response;
              }
           });
        });
      }
    }
  }
})

myModule.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){

      el.bind("change", function(e){

        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      });
    }
  }
});
