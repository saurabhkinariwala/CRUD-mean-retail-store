myModule.controller('orderHistoryCtrl',['$scope', '$routeParams', 'retailService','$rootScope','fetchData',function($scope, $routeParams, retailService,$rootScope,fetchData){
		$scope.hideLoader = false;
		fetchData.getCustData().then(function(data) {
			$scope.orderList = data.nonDeletedDocs;
			$scope.hideLoader = true;
		})
		$scope.showOrder = function(order){
			$scope.orderData = order;
		}
		$scope.searchOrder =function (item) {

				fetchData.filterOrder(item).then(function (data) {
					if(!item){
						fetchData.getOnLoadData(skipPdts, $routeParams.cat).then(function(data) {
								$scope.orderList = data;
								$scope.isShow = false;
						});
					} else {
						if(data.length){
							$scope.orderList = data;
							$scope.isShow = false;
						} else {
							$scope.isShow = true;
						}
					}

				});
		}

		$scope.openCreateDeliveryMemo = function (orderDetails){
			retailService.findOrderById(orderDetails._id).then(function(data){
				$scope.deliveryDetails = data;
			})
			

		}
		$scope.showDeliveryMemo = function (orderDetails) {
			console.log(orderDetails);
			$scope.orderDetail = angular.copy(orderDetails);
			$scope.deliveryData = {};
			retailService.getDeliveryData(orderDetails._id).then(function (res) {
				$scope.deliveryData = res.data;
				console.log($scope.deliveryData);
				
			});
			$scope.deliveryDetail = orderDetails;
			// $scope.deliveryData = [{"DeliveryNumber":2}];

		}
		$scope.deleteOrder = function (orderObj) {
			var result = confirm("Want to delete?");
			if (result) {
				$scope.hideLoader = false;
				retailService.deleteItem(orderObj._id);
				fetchData.getCustData().then(function(data) {
					$scope.orderList = data.nonDeletedDocs;
					$scope.hideLoader = true;
					$scope.orderList = $scope.orderList.filter( (value) => value.isDelete !== true);
				});
			}
		}

}]);
