var app = angular.module('formationApp', ['formationApp.controller']);

app.constant('URL', "https://api.mongolab.com/api/1/databases/books/collections/books/?apiKey=d3qvB8ldYFW2KSynHRediqLuBLP8JA8i")

angular.module('formationApp.controller', [])

.controller('formation', function($scope, $http, URL){

	var url = URL;

	$scope.references = [];
	$http.get(url).
	    success(function(data, status) {
	        angular.forEach(data, function(item){

	        	var reference = {};

	        	reference = {};
			    reference.refArticle = item["ISBN-13"];
			    reference.libelle = item.title;
			    reference.prix = item.price;

   		      	$scope.references.push(reference);

	        	reference = {};
	      });
	    });

	$scope.articles = [
		{refArticle : "123456", libelle: "Chat botté", prix: 12, qtt: 45 }
		,{refArticle : "7897897", libelle: "Chat potté", prix: 30, qtt: 200 }
		,{refArticle : "fhsjk-fjsdkfh", libelle: "Chat monté", prix: 13, qtt: 12 }
		,{refArticle : "789897-fsdfs", libelle: "Chat hoté", prix: 18, qtt: 45 }
		,{refArticle : "fsdf789-fsdfs", libelle: "Chat tolé", prix: 42, qtt: 10 }

	];

	$scope.nArticle = {};

	$scope.tva = 1.04;

	$scope.prixArticleHT = function(article){
		return article.prix * article.qtt; 
	}

	$scope.prixArticleTTC = function(article){
		return article.prix * article.qtt * $scope.tva;
	}

	$scope.prixTotalHT = function(){
		var total = 0;
		angular.forEach($scope.articles, function(article){
			total += $scope.prixArticleHT(article)
		});
		return total;
	}

	$scope.prixTotalTTC = function(){
		var total = 0;
		angular.forEach($scope.articles, function(article){
			total += $scope.prixArticleTTC(article)
		});
		return total;
	}

	$scope.addArticle = function(){

		var articleToAdd = {};
		angular.forEach($scope.references, function(item){
			if(angular.equals($scope.nArticle.libelle, item.libelle)){
				articleToAdd.refArticle = item.refArticle;
				articleToAdd.prix = item.prix;

				articleToAdd.qtt = $scope.nArticle.qtt;
				articleToAdd.libelle = $scope.nArticle.libelle;

				$scope.articles.push(articleToAdd);
			};
		});

		$scope.nArticle = {};
	}

	$scope.delete = function(index){
		$scope.articles.splice(index, 1);
	}

});