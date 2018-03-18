myModule.controller('addPdtCtrl',['$scope','retailService', 'fetchData',function($scope,retailService, fetchData){
		$scope.details = {};
		$scope.imageSrc = '';
		
		retailService.getProductsCategory().then(function(data){
                    $scope.options = data;
                    $scope.options.unshift({'_id': 0, 'catname':"Select Category"});
                    $scope.details.cat = $scope.options[0];
                });


		$scope.getFile = function () {
			$scope.progress = 0;
			retailService.readAsDataURL($scope.file, $scope)
				.then(function(result) {
						$scope.imageSrc = result;
				});
		};

		$scope.$on("fileProgress", function(e, progress) {
				$scope.progress = progress.loaded / progress.total;
		});

		$scope.save = function(obj){
			if(obj.cat.catname === "Select Category"){
				alert("Select a category");
				return false;
			}else{
			
                            obj.cat_id  = obj.cat._id;
                            obj.cat = obj.cat.catname;
                            obj.image = $scope.imageSrc;
                            obj.addedItem = [];
                            retailService.addProduct(obj);
                            $scope.details = {};
//                            $scope.imageSrc = '';
                            $scope.addProduct.$setPristine();
                            $scope.details.cat = $scope.options[0];
                            alert('Product added');
				
			}
		}

		$scope.cancelAddProduct= function () {
			$scope.addProduct.$setPristine();
			$scope.details = {};
			$scope.details.cat = "Select Category";
		}

}]);
