var app = angular.module('formationApp', ['formationApp.controller', 'ngRoute', 'ngSanitize', 'services'])

.controller('main', function($scope, panier){
	$scope.panier = panier;
})

.filter('interval', function(){
	return function(input, min, max){
		return input.filter(function(item){
			return item.price ? ((!min || item.price >= min) && (!max || item.price <= max)) : true;
		});
	}
})

.config(function($routeProvider){

	$routeProvider
					.when('/', {
						templateUrl: 'partials/list.html'
						,controller: 'list'
					})
					.when('/detail/:id', {
						templateUrl: 'partials/detail.html'
						,controller: 'detail'
					})
					.otherwise({ redirectTo: '/' });
})

.constant('URL'	, "https://api.mongolab.com/api/1/databases/books/collections/books/")
.constant('KEY', '?apiKey=d3qvB8ldYFW2KSynHRediqLuBLP8JA8i');

angular.module('formationApp.controller', [])
.controller('list', function($rootScope, $scope, $http, URL, KEY, $location, criteres, catalog){

	$scope.criteres = criteres;
	$rootScope.title = "Catalogue";
	$scope.livres = [];

	catalog.getList().then(function(result){

		var livre = {};
		angular.forEach(result, function(item){
			livre= item;
			$scope.livres.push(livre);
			livre = {};	
		});
		
	});

})

.controller('detail', function($rootScope, $scope, $http, URL, KEY, $routeParams, $location, panier, catalog){

	$scope.livre = {};

	catalog.getBook($routeParams.id).then(function(item){
				$rootScope.title = item.title;
				$scope.livre.ISBN10 = item['ISBN-10'];
				$scope.livre.ISBN13 = item['ISBN-13'];
				$scope.livre.title = item.title;
				$scope.livre.publisher = item.publisher;		
				$scope.livre.author = item.author;		
				$scope.livre.rating = item.rating;		
				$scope.livre.price = item.price;		
				$scope.livre.desc = item.desc;		
				$scope.livre.pages = item.pages;		
				$scope.livre.image = item.img;	
	});
});


