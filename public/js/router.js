var app = angular.module('retail');

app.config(function($locationProvider, $routeProvider){
	$routeProvider.
    when('/home',{
        templateUrl:"views/home.html"
    })
    .when('/AddPdt',{
        templateUrl:"views/addProduct.html",
        controller:"addPdtCtrl"
    })
    .when('/Billing',{
        templateUrl:"views/billing.html",
        controller:"billingCtrl"
    })
    .when('/Pdt/:_id',{
        templateUrl:"views/products.html",
        controller:'pdtCtrl'
    })
    .when('/Pdthstry/:id',{
        templateUrl:"views/productHistory.html",
        controller:'dtlCtrl'
    })
    .when('/Orders',{
        templateUrl:"views/orderHistory.html",
        controller:"orderHistoryCtrl"
    })


    .otherwise({redirectTo:'/home'});
       $locationProvider.html5Mode(true);

	
});
