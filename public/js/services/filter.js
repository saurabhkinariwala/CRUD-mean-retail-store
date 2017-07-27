var filtr = angular.module('filterModule',['serviceModule']);

filtr.filter('rupeeFilter',function(){
	return function(obj){
		var r = 'Rs '+obj;
		return r;
	}
})

	filtr.filter('greaterThan',function () {
		return function(obj,item) {
			if(obj !== undefined){
				var i,filteredList = [];
				if(item==undefined || item==""){
						item=0;
				}
				for(i=0;i<obj.length;i++){
					if(obj[i].qty >= parseInt(item)){
						filteredList.push(obj[i]);
					}
				}
				return filteredList;
			}
		}
	});
