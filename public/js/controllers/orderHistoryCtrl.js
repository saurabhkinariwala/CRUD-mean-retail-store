myModule.controller('orderHistoryCtrl',['$scope', '$routeParams', 'retailService','$rootScope','fetchData',function($scope, $routeParams, retailService,$rootScope,fetchData){
	$scope.hideLoader = false;
	fetchData.getCustData().then(function(data) {
		$scope.orderList = data.nonDeletedDocs;
		$scope.hideLoader = true;
		$scope.orderData = {};
	});



	$scope.showOrder = function(order){
		fetchOrderById(order);
	}

	$scope.openDeliveryMemoOrPayment = function (orderDetails, index){
		$scope.index = $scope.orderList.length - index - 1;
		fetchOrderById(orderDetails);
	}

	function fetchOrderById(order){
		retailService.findOrderById(order._id).then(function(data){
			$scope.orderData = data;
			// order = data;
		})
	}

	$scope.exportAsPdf = function(order){
		$scope.orderData = order;
		document.getElementById('downloadOrder').style.display = 'block';
		setTimeout(function(){
			var pdf = new jsPDF('p', 'pt', 'letter');
			source = document.getElementById('downloadOrder');
			
			margins = {
			top: 80,
			bottom: 60,
			left: 40,
			width: 522
			};
			//pdf.rect(150,100,10,10);
			pdf.fromHTML(
			source, 
			margins.left, 
			margins.top, { 
			'width': margins.width
			
			},
	
			function (dispose) {
			pdf.save( order.name + '.pdf');
			document.getElementById('downloadOrder').style.display = 'none';
			}, margins);
		}, 0)
			
	}

	$scope.searchOrder =function (item, fromDate, toDate) {
		if(fromDate || toDate){
			fromDate = new Date(fromDate);
			toDate = new Date(toDate);
		} else {
			fromDate = undefined;
			toDate = undefined; 
		}
			fetchData.filterOrder(item, fromDate, toDate).then(function (data) {
				
				$scope.orderList = data;
				// if(!item){
				// 	fetchData.getOnLoadData(skipPdts, $routeParams.cat).then(function(data) {
				// 			$scope.orderList = data;
				// 			$scope.isShow = false;
				// 	});
				// } else {
				// 	if(data.length){
				// 		$scope.orderList = data;
				// 		$scope.isShow = false;
				// 	} else {
				// 		$scope.isShow = true;
				// 	}
				// }

			});
	}


	
	$scope.showDeliveryMemo = function (orderDetails) {
		console.log(orderDetails);
		$scope.orderDetail = angular.copy(orderDetails);
		$scope.deliveryData = {};
		retailService.getDeliveryDataByOrder(orderDetails._id).then(function (res) {
			$scope.deliveryData = res.data;
			console.log($scope.deliveryData);
			
		});
		$scope.deliveryDetail = orderDetails;

	}

	$scope.editOrder = function(order){
		retailService.setOrder(order);
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
