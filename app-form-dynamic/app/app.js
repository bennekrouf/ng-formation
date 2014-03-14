angular.module('formationApp', [])


.controller('main', function($scope, $http){

	var urlGet="https://api.mongolab.com/api/1/databases/forms/collections/forms/51669d15e4b04a20de65fc58?apiKey=d3qvB8ldYFW2KSynHRediqLuBLP8JA8i";

	$scope.tab = {};
	$http.get(urlGet).then(function(result){
		$scope.tab =result.data.fields;
	});

	$scope.newItem = {};

	var urlPost = "https://api.mongolab.com/api/1/databases/forms/collections/data?apiKey=d3qvB8ldYFW2KSynHRediqLuBLP8JA8i";

	$scope.save = function(){

		$http.post(urlPost, {obj: $scope.newItem});

	}

});