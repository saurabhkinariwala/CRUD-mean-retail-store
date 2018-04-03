myModule.controller('pdtCtrl',['$scope', '$routeParams', 'retailService','$rootScope','fetchData','$http',function($scope, $routeParams, retailService,$rootScope,fetchData,$http){
		
		var limitToModel = 2, skipPdts = 3, prodCount = 0;
		$scope.isShow = false;
		$scope.loadMoreBtn = false;
		fetchData.getProductsData(skipPdts, $routeParams._id).then(function(data) {
				$scope.prodCat = data;
                                $scope.category = data[0].cat;
		});

//		fetchData.prodCount($scope.category).then(function(data){
//			prodCount = data[0].count;
//			if(prodCount >= skipPdts){
//				$scope.loadMoreBtn = true;
//			}
//		});

		// $scope.prodCat = [{"bName":"Apple","date":"26/01/2016","desc":"Best Laptop","id":"Laptops-0","pName":"Mac Book Air 13 inches","price":70000,"qty":100,"image":"img/Macbook-AIR.jpg","addedItem":[]},{"bName":"Dell","date":"27/01/2016","desc":"Best Laptop 2","id":"Laptops-1","pName":"Dell Inspiron 15 R","price":45000,"qty":100,"image":"img/Dell-inspiron-15R.jpg","addedItem":[]}];
		$scope.addQtyOrEditPdt = function(pdtId, pdtName, price){
                        $scope.pdtObj={};
			$scope.pdtObj.pdtId = pdtId;
                        $scope.pdtObj.pdtName = pdtName;
                        $scope.pdtObj.price = price;
		};

		$scope.searchItem = function (item) {

			fetchData.filterItem(item, $scope.category).then(function (data) {
				if(!item){
					fetchData.getOnLoadData(skipPdts, $routeParams.cat).then(function(data) {
							$scope.prodCat = data;
							$scope.isShow = false;
					});
				} else {
					if(data.length){
						$scope.prodCat = data;
						$scope.isShow = false;
					} else {
						$scope.isShow = true;
					}
				}

			});
		}

		$scope.searchQuantity = function (qty) {

			fetchData.filterQty(qty, $scope.category).then(function (data) {
				if(!qty){
					fetchData.getOnLoadData(skipPdts, $routeParams.cat).then(function(data) {
							$scope.prodCat = data;
							$scope.isShow = false;
					});
				} else {
					if(data.length){
						$scope.prodCat = data;
						$scope.isShow = false;
					} else {
						$scope.isShow = true;
					}
				}

			});
		}

		$scope.loadMore = function () {
			fetchData.loadMoreData(limitToModel, skipPdts, $scope.category).then(function(data) {
					$scope.prodCat.push.apply($scope.prodCat, data);
					skipPdts = skipPdts + limitToModel;
					if(prodCount <= skipPdts){
						$scope.loadMoreBtn = false;
					}
			});

		};


		$scope.deleteProduct = function (pdtId) {
                    var result = confirm("Want to delete?");
			if (result) {
                            retailService.deleteProduct(pdtId);
			}                 
		}

}]);
