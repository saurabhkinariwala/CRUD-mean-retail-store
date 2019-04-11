myModule.controller('billingCtrl',['$scope', '$routeParams', 'retailService','fetchData',function($scope,$routeParams,retailService,fetchData){

	var orderNo;
	$scope.newProduct={};
	$scope.hideLoader = false;
	retailService.getProductsCategory().then(function(data) {
		$scope.options = data;
		$scope.options.unshift({_id: 0, catname: "Select Category"});			
		$scope.newProduct.cat = $scope.options[0];
	});		
	$scope.custObj={};
	$scope.custObj.prodDetails = [];
	$scope.custObj.payments = [];
	$scope.editBtn = false;
	$scope.custObj.total = 0;
	$scope.custObj.balance = 0;
	$scope.prodName = [];

	if($routeParams.id){
		$scope.hideLoader = true;
		$scope.custObj = retailService.getOrder();

	} else {
		fetchData.getCustData().then(function(data){
			$scope.customerData = data.totalDocs;
			$scope.hideLoader = true;
			if(orderNo === undefined){
				orderNo = data.totalDocs.length + 1;
				$scope.custObj.billNo = orderNo;
			}
		});
	}

	$scope.categoryBlur = function() {
		$scope.hideLoader = false;
		retailService.getProdNames($scope.newProduct.cat._id).then(function(data) {	
			$scope.hideLoader = true;			
			$('#search-product').autocomplete({
				source: data,
				select: function (event, ui){
					$scope.hideLoader = false;
					retailService.getProductsById(ui.item.key).then(function (itemObj){
						$scope.newProduct.price = itemObj.price;
						$scope.newProduct.qty = itemObj.qty;
						$scope.newProduct.id = ui.item.key;
						$scope.hideLoader = true;
					});
				}
			});
		});
	}

    $scope.addRow = function(isValid){
        // if(isValid && $scope.newProduct.qty >= $scope.newProduct.dmndQty){
		if(isValid){
            $scope.itemDetail.$setPristine();
			$scope.newProduct.balQty = $scope.newProduct.dmndQty;
			$scope.newProduct.delvStatus = false;
            $scope.custObj.prodDetails.push($scope.newProduct);
            $scope.newProduct={};
			$scope.newProduct.cat = $scope.options[0];;
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
		$scope.newProduct.cat = pdt.cat;
        $scope.editBtn = true;
        $scope.editIndex = idx;
    }

    $scope.updateRow = function(){
		$scope.itemDetail.$setPristine();
		$scope.custObj.prodDetails[$scope.editIndex] = $scope.newProduct;
		$scope.newProduct={};
		$scope.newProduct.cat = $scope.options[0];
		$scope.custObj.total=retailService.getTotalAmount($scope.custObj.prodDetails);
		$scope.editBtn = false;
    }

    $scope.submitBill = function(){
		$scope.custObj.delvStatus = "Pending";
		$scope.custObj.balanceStatus = "Pending";
		$scope.custObj.isDelete = false;
		$scope.custObj.advance = $scope.custObj.advance || 0;
		$scope.custObj.balance = $scope.custObj.total - $scope.custObj.advance;
		$scope.custObj.billDate = new Date($scope.custObj.billDate);
		retailService.findAndPushOrder($scope.custObj);
		retailService.sendEmail({receiverId: $scope.custObj.email});
		$scope.custObj ={};
		$scope.custObj.prodDetails = [];
		$scope.userDetails.$setPristine();
		$scope.custObj.billNo = ++orderNo;
    }
}]);
