angular.module('services', [])

.value('criteres', [
	{libelle: 'Prix croissant', 	property: 'price', reverse : false}
		,{libelle: 'Prix decroissant', 	property: 'price', reverse : true}
		,{libelle: 'Titre', 			property: 'title', reverse : false}

	])

.value('currentSearchCriteria', {})

.factory('catalog', function($http, URL, KEY){

	// Pour n'exécuter les services qu'une seule fois
	var catalogPromise = $http.get(URL+KEY).then(function(response){
		return response.data;
	});

	return {

		getList: function(){
			return catalogPromise;
		}
		,getBook: function(id){
			return catalogPromise.then(function(books){
				for(var i = 0; i < books.length; i++){
					var book = books[i];
					if(book._id.$oid === id ){
						return book;
					}
				}
			});
		}
	}
})

.factory('panier', function(TVA){
	return {

		panier: {}

		,getPanier: function(){
			return this.panier;
		}

		,populePanier : function(article){
			var row = this.panier[article['ISBN-13']];
			if(row){
				row.qtt++;
				return;
			}
			else {
				var newItem = {
					id: article['ISBN-13']
					,qtt: 1
					,price: article.price
					,title: article.title
				};
				this.panier[article['ISBN-13']] = newItem;
			}
			return this.panier;
		}
		,remove: function(item){
			delete this.panier[item.id];
			return this.panier;
		}
		,prixArticleHT : function(article){
			return article.price * article.qtt; 
			}

		,prixArticleTTC : function(article){
				return article.price * article.qtt * TVA;
			}

		,prixTotalHT : function(){
			var total = 0;
			angular.forEach(this.panier, function(article){
				total += prixArticleHT(article)
			});
			return total;
			}

		,prixTotalTTC : function(){
			var total = 0;
			angular.forEach(this.panier, function(article){
				total += prixArticleTTC(article)
			});
			return total;
		}
		,qttTotal: function(){
			var sum = 0;
			for(var i=0; i<this.panier.length; i++){
				sum += this.panier[i].qtt;
			}
			return sum;
		}
	};
})

.constant('TVA', 20);