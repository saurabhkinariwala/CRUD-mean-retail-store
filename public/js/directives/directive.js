myModule.directive('pdtModal',['retailService',function(retailService){
  return{
    restrict: 'E',
    scope:{
      data: '=data',
      index: '='
    },
    templateUrl:'../views/prodModal.html',
    link: function(scope,element,attrs) {
      scope.$watch('data', function(data) {
     });
     scope.upd=function(data, obj, index){
       console.log(data);
       retailService.updateQty(data['id'], obj, index, data);
       scope.myData = {};
       scope.prodDetails.$setPristine();
       $('#myModal').modal('hide');
    }

    },
    controller: function($scope, $element, $attrs, $location) {


      }
  }
}]);

// myModule.directive('autoCompletes',function() {
//   return{
//     restrict:'A',
//     link: function(scope,element,attrs) {
//       console.log(scope[attrs.itemNames]);
//             element.autocomplete({
//               source: scope[attrs.itemNames],
//               select: function($timeout){
//                 $timeout(function () {
//                   element.trigger('input');
//                 },0);
//               }
//             });
//           }
//   }
// })

myModule.directive('orderDetails',function() {
  return{
    restrict:'E',
    scope:{
      data: '='
    },
    templateUrl:'../views/orderDetails.html',
    link:function(scope,element,attrs){
      scope.updStatus = function(){
        var prods = scope.data.prodDetails.length,
            flag = 0;
        angular.forEach(scope.data.prodDetails, function (value, key) {
          (value.delvStatus) ? flag++ : null;
        })
        if(prods === flag) {
          scope.data.status = 'Completed';
        } else {
          scope.data.status = 'Pending';
        }
      }
    }
  }
});

myModule.directive('editProduct',function (retailService) {
  return{
    restrict:'E',
    scope:{
      data:'=',
      index:'='
    },
    templateUrl:'../views/editProduct.html',
    link:function (scope,element,attrs) {
      scope.upd = function (id, obj, index) {
        retailService.updatePdt(Id, obj, index);
      }
    }
  }
})
