myModule.controller('dtlCtrl',['$scope','$routeParams','retailService',function($scope,$routeParams,retailService){

	retailService.getProductsById($routeParams.id).then(function(data) {
			$scope.pro = data;
			$scope.addedItem = data.addedItem;
	});

}]);
