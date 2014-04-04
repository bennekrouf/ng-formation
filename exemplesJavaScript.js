"use strict";
// > 'use strict'

var a = {
	firstName : "mohamed"
    , lastName: "toto"
    , fullName: function(){
        return this.firstName+this.lastName
    }
};
// > undefined

// Tableau
// > undefined
var a = [0,1,2,3,4,5]
// > undefined
a.map(function(item){return item*item;}) 
// > [ 0, 1, 4, 9, 16, 25 ]

a.reduce(function(result, item){
	return result + item;
}, 0); // 0 : previous value // si on met rien
// > 15


// exo 2
// > undefined
var tab = [45,78,32,14,7,56];
// > undefined

tab.maxFor = function(){

	var max = 0;
	for(var i = 0; i < this.length; i++){
		if(tab[i] > max){
			max = tab[i];
		}
	}
	return max;
}
// > [Function]

tab.maxReduce = function(){
	return this.reduce(function(previous, current, index){
			if(current > previous){
				return current;
			};
			return previous;
		});
};
// > [Function]


// exo 3 : factoriel + cache
// > undefined
function fact(n){
	if(!fact.cache[n]){
		fact.cache[n] = n > 0 ? n * fact(n-1) : 1;
	}
		console.log("cache "+fact.cache)
		return fact.cache[n];
}
// > undefined

fact.cache = [];
// > []

// exo4 : fonction qui fait la somme d'un nombre infini d'argument
// > undefined
var calc = function(){
	var somme = 0;
	for(var i=0; i < arguments.length; i++){somme = somme + arguments[i];}
	return somme;
}
// > undefined

var calc2 = function(){
	arguments.reduce = Array.prototype.reduce;
	return arguments.reduce(function(previous, current){
		return previous + current;
	})
}
// > undefined


calc2(2,3);
// > 5


// Exo 5
var obj = {
	log1: function(){
		console.log("LOG1");
	},
	log2: function(){
		console.log("LOG2", this.message);
	},
	message: 'Yeahhh'
}
// > undefined

setTimeout(obj.log1, 3000);
setTimeout(function(){
	obj.log2();
}, 3000);



// exo6
var Person = function(nom, prenom){
	this.nom = nom;
	this.prenom = prenom;
}

var p0 = new Person("prems", "deuz");

Person.prototype.fullName = function(){
	return this.nom + ' ' + this.prenom;
}

var p1 = new Person("toto", "tutu");



//

// Example d'utilisation de call avec reduce qui n'existe pas directement sur "arguments"
function sum(){ 
	return Array.prototype.reduce.call(arguments, function(tmp, result){
		return tmp + result;
	})
};

// Compteur avec pb des closures
var compte = function(){
	for(var i = 0; i < 1000; i++){
		(function a(j){
			setTimeout(function(){
				console.log(j);
			}, j*1000);
		})(i);
	}
}


// Exo 8
var compteur = (function(){
	var cpt = 0;
	return {
		get : function(){
			return cpt;
		}
		,incr : function(val){
			cpt = val + cpt;
		}
	}
})();


var factory = function(i){
	var cpt = i;
	return {
		get : function(){
			return cpt;
		}
		,incr : function(val){
			cpt = val + cpt;
		}
	}
}; 
// var toto = factory(13)
// toto.get()

// Prototype
var Compteur = function(val){
	this.init = val;
}

Compteur.prototype.get = function(){
	return this.init;
}

Compteur.prototype.incr = function(val){
	return this.init += val;
}

var compteur1 = new Compteur(10);
var compteur2 = new Compteur(20);

compteur1.get();
compteur2.get();


