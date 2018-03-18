var myModule = angular.module('retail',['ui.bootstrap','ngRoute','ngStorage','serviceModule','filterModule']);


myModule.controller('MainController',['$scope','$routeParams','retailService','$location',function($scope,$routeParams,retailService, $location){
(function (){

var routeTo = decodeURIComponent(location.href.split("route=")[1]);
console.log(routeTo)
$location.path(routeTo);


})();



	retailService.getProductsCategory().then(function(data) {
			$scope.productLists = data;
	});

       

}]);

$(document).on('focus','.datepicker', function(){
	$(this).datepicker({
			format: 'dd/mm/yyyy'
	});
});
