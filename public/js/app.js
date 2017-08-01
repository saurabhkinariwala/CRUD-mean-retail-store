var myModule = angular.module('retail',['ui.bootstrap','ngRoute','ngStorage','serviceModule','filterModule']);

$(document).on('focus','.datepicker', function(){
	$(this).datepicker({
			format: 'dd/mm/yyyy'
	});
})


myModule.controller('addPdtCtrl',['$scope','retailService', 'fetchData',function($scope,retailService, fetchData){
		$scope.details = {};
		$scope.details.cat = "Select Category";
		$scope.options=retailService.getOptions();


		$scope.save = function(obj){
			if(obj.cat == "Select Category"){
				alert("Select a category");
				return false;
			}else{
				fetchData.getCatData(obj.cat).then(function(data) {
						obj.id  = obj.cat+"-"+data.length;
						obj.image = "";
						obj.addedItem = [];
						retailService.addProduct(obj);
				});
			}
		}
}]);


myModule.controller('pdtCtrl',['$scope', '$routeParams', 'retailService','$rootScope','fetchData','$http',function($scope, $routeParams, retailService,$rootScope,fetchData,$http){
		$scope.category = $routeParams.cat;
		$scope.limitToModel = 4;
		fetchData.getCatData($routeParams.cat).then(function(data) {
				$scope.prodCat = data;
				console.log(JSON.stringify($scope.prodCat));
		});
		// $scope.prodCat = [{"bName":"Apple","date":"26/01/2016","desc":"Best Laptop","id":"Laptops-0","pName":"Mac Book Air 13 inches","price":70000,"qty":100,"image":"img/Macbook-AIR.jpg","addedItem":[]},{"bName":"Dell","date":"27/01/2016","desc":"Best Laptop 2","id":"Laptops-1","pName":"Dell Inspiron 15 R","price":45000,"qty":100,"image":"img/Dell-inspiron-15R.jpg","addedItem":[]}];
		$scope.addQtyOrEditPdt = function(pdtObj, index){
			$scope.pdtData = pdtObj;
			$scope.indexPdt = index;
		}
		$scope.deleteProduct = function (pdtObj) {

		}

}]);

myModule.controller('dtlCtrl',['$scope','$routeParams','retailService',function($scope,$routeParams,retailService){

	retailService.getProductsById($routeParams.id).then(function(data) {
			$scope.pro = data;
			$scope.addedItem = data.addedItem;
	});

}]);

myModule.controller('billingCtrl',['$scope','retailService','fetchData',function($scope,retailService,fetchData){

		var orderNo;
		$scope.options = retailService.getOptions();
		$scope.newProduct={};
		$scope.custObj={};
		$scope.custObj.prodDetails = [];
		$scope.newProduct.cat = "Select Category";
		$scope.editBtn = false;
		$scope.custObj.total = 0;
		$scope.prodName = [];


		fetchData.getCustData().then(function(data){
			$scope.customerData = data;
			if(orderNo === undefined){
			 orderNo = data.length + 1;
			 $scope.custObj.billNo = orderNo;
			}
		});

		$scope.categoryBlur = function() {
			retailService.getProdNames($scope.newProduct.cat).then(function(data){
				$('#search-product').autocomplete({
						source: data,
						select: function (event, ui){
							retailService.getProductsById(ui.item.key).then(function (itemObj){
								$scope.newProduct.price = itemObj.price;
								$scope.newProduct.qty = itemObj.qty;
								$scope.newProduct.id = ui.item.key;
							});
						}
				});
			});
		}

    $scope.addRow = function(isValid){
        if(isValid && $scope.newProduct.qty >= $scope.newProduct.dmndQty){
            $scope.itemDetail.$setPristine();
						$scope.newProduct.delvStatus = false;
            $scope.custObj.prodDetails.push($scope.newProduct);
            $scope.newProduct={};
						$scope.newProduct.cat = "Select Category";
            $scope.custObj.total=retailService.getTotalAmount($scope.custObj.prodDetails);
        }
        else{
            alert("Fill the proper details");
        }
    }



		$scope.changeQty = function(){
				$scope.newProduct.amount = ($scope.newProduct.dmndQty*$scope.newProduct.price);
		};


    $scope.deletePdt = function(idx){
        $scope.custObj.prodDetails.splice(idx,1);
        $scope.custObj.total=retailService.getTotalAmount($scope.custObj.prodDetails);
    };

    $scope.editPdt = function(pdt,idx){
        pdt.dmndQty = parseInt(pdt.dmndQty);
        $scope.newProduct = angular.copy(pdt);
        $scope.editBtn = true;
        $scope.editIndex = idx;
    }

    $scope.updateRow = function(){
            $scope.itemDetail.$setPristine();
            $scope.custObj.prodDetails[$scope.editIndex] = $scope.newProduct;
            $scope.newProduct={};
						$scope.newProduct.cat = "Select Category";
            $scope.custObj.total=retailService.getTotalAmount($scope.custObj.prodDetails);
            $scope.editBtn = false;
    }

    $scope.submitBill = function(){
					$scope.custObj.status = "Pending";
					retailService.findAndPushOrder($scope.custObj);
					console.log($scope.custObj);
					retailService.updateProductsQty($scope.custObj);
					$scope.custObj ={};
					$scope.userDetails = {};
					$scope.custObj.billNo = orderNo + 1;
    }
}]);

myModule.controller('orderHistoryCtrl',['$scope', '$routeParams', 'retailService','$rootScope','fetchData',function($scope, $routeParams, retailService,$rootScope,fetchData){
		fetchData.getCustData().then(function(data) {
			$scope.orderList = data;
		})
		$scope.showOrder = function(order){
			$scope.orderData = order;
		}
		$scope.deleteOrder = function (orderObj) {
			var result = confirm("Want to delete?");
			if (result) {
				retailService.deleteItem(orderObj);
				$scope.orderList = $scope.orderList.filter( (value) => value._id != orderObj._id);
			}
		}

}]);
