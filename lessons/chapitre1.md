
# Javascript : 
=============================================================

Dans ce chapitre sont traités :
- Types primitifs
- Objets
- Tableaux
- Fonctions
- Closures
- Operandes && et ||
- Exceptions

et enfin :

- Introduction à Angular



## Les types primitifs 

- Undefined : aucune valeur
- Null : explicitement null
- Il n’y a qu’un seul type  numérique : number
- Pas de type caractère

	0.1 + 0.2 == 0.3 // false

ajout de nombre à 2 décimales ne fait pas forcément un nombre à 2 décimales

### Ils sont immuables : 

	var a = 123; var b=a; //  affecte la valeur directement et non l'adresse

### Auto boxing

Ils sont convertis en objet lorsque c'est nécessaire 
- uniquement le temps de l'utilisation, l'objet est perdu / non stocké:

	var n=5; n.toString();

### =, ==, ===

#### == 

- Comparaison avec conversion automatique de types
- Fonctionne bien sur les types primitifs
- Ne fonctionne pas sur les objets

donc éviter de faire des 

	var f = new String("fdsfs");	

Exemples :

	1 == true; 						// true car il converti le true en nombre donc 1
	"true" == true ; 				// false
	new Number(1) == new Number(1) 	// false

- Si un des deux opérandes est une chaine alors il essaie de convertir tout en chaine
- Sinon compare les références des objets

#### ===

Comparaison strict : sans conversion automatique

Renvoie true si 
- ce sont des types primitifs égaux en valeur,
- ou bien 2 opérandes égales en adresse

Sinon false


## Les objets

- Ce sont des tableaux de clefs/valeurs avec :

	clef // chaine de caractères

- On peut faire

	obj.clef // notation simplifié autorisé s'il n'y pas de carac non autorisés ou bien :
	object['clef']  

	obj['a.b'] // mieux que obj.a.b

- Supprimer une propriété :

	var a = {p1 : 1, p2: 2};
	a.p2 = undefined;
	a 							// Object {p1: 1; p2: undefined}

- Faire plutot :

	delete params[keys]; => Object {p1: 1;}

## Les tableaux

	a['01'] = 8 
	Object.keys(a) 	// on va avoir la clé

- Mais si on fait
	
	a['01']			// alors on n'aura pas la valeur

car 01 n'est pas considéré comme un entier 

	a.length = 0  // pour vider un tableau : vide tout le tableau sauf les index non numériques

- length : propriété toujours supérieur au plus grand des index

	array.push  // ajoute à la fin d'un tableau
	unshift		// pour insérer au début du tableau

	shift		// enlève le premier élément et décrémente
	pop         // enlève et renvoie le dernier éléments du tableau

	splice 		// ajoute ou supprime à un certain index
	
	reverse
	sort

Exemple :

	$scope.articles.splice(index, 1); // supprime 1 seul élément à l'index 

- concat et slice créé des nouveaux tableaux

	a.concat(b) // ne modifie pas a mais créé un nouveau tableau

- slice renvoit une copie


### Fonctions ECMAScript5 : indexOf, lastIndexOf, forEach

- every et some : on passe un callback qui renvoit un boolean
- every : vrai si le callback dit vrai pour tous les éléments
- some : pour some éléments
- filter renvoit un nouveau tableau avec les éléments qui passe true dans le callback
- map : sert à calculer un tableau de valeurs
- reduce : un seul élément (ex : somme des éléments d'un tableau)


## Les fonctions - Définition

### 2 façons de les définir :
	
	function fn1(toto){} 		// ne renvoit pas de valeurs et le nom obligatoire

	return function fn(toto) 	// le nom est facultatif sauf si récursif + créé un objet function et le renvoit

différence entre
	
	function f1()

et 

	var f2 = function()

f1 est exécuté au premier passage de JS, f2 uniquement lorsqu'elle est appelé


## Les fonctions - appels de fonctions

### 1 - Appel direct

	data = transform(a,b,c);

- "arguments" pseudo tableau
- pas de type array, mais possède un index numérique et une longeur
	
	arguments[0]
	arguments.length

### Tips sur this

	this // undefined en mode strict

sinon objet global en mode normal (window)

### 2 - Appel d'une fonction propriété d'un objet

	a.push(value) // ou a['push'](value)


### 3 - Fonctions appelés comme constructeur

	var obj = new Fn(arg);

JS créé un nouvel objet dont le prototype est Fn.prototype 

### Tips sur les prototypes

** prototype est une propriété créée automatiquement sur toutes les fonctions ** 

- Fn.prototype est le prototype des instances et non de la fonction
- Le prototype des functions est function.prototype !

	obj.constructor === Fn

	obj instanceof Fn // true

- Ajout de fonctions au prototype : 

	Fn.prototype.functionName = function(arg){}

- Permet d'affecter cette fonctions à toutes les instances

- Exemple :


	var Gateau = function(ingredients){
		this.ingredients = ingredients;
	}

	var madelaine = new Gateau("lait et oeufs");

	console.log(madelaine.ingredients);

	madelaine.constructor
	// function (ingredients){
	//		this.ingredients = ingredients;
	// }

	Gateau.constructor
	// function Function() { [native code] }


### 4

- Toutes les fonctions héritent de 2 méthodes : call et apply

	fn.call(thisArg, arg1)

ou 

	fn.apply(thisArg, [arg1, arg2])

### 5

fonctions anonymes exécutées directement pour isoler un scope

	(function(){})()

### 6 Pattern module


	var module = (function(){
		
		var priv;

		return {

			fn : function(){
				return priv;
			}
		}

	})();


## Prototypes

- Framework JS 


	Objet.prototype // représente l'objet prototype de Object (père de tous les objets js)


### New et this sont sur un bateau

- Toutes les fonctions JS sont des objets
- Toutes les fonctions JS peuvent être utilisés pour créer des objets


	function createPerson(firstname, lastname, age) {
	    person = {};
	    person.firstname = firstname;
	    person.lastname = lastname;
	    person.age = age;
	    return person;
	}
	createPerson("Moe", "Ben", 36);
	// {firstname: "Moe", lastname: "Ben", age: 36}


- Remarque : "createPerson()" et "new createPerson" vont faire la même chose (renvoit de l'objet person)

- En revanche, pour créer des nouveaux objets d'un type particulier, on utilise new :


	function createPersonObject(firstname, lastname, age) {
	    this.firstname = firstname;
	    this.lastname = lastname;
	    this.age = age;
	    // pas de return
	}


- createPersonObject() : va définir les attributs de this sur l'objet courant de this (window sur un browser)

- new createPersonObject() : va instancier l'objet


	var Moe = createPersonObject("Moe", "Ben", 36);
	console.log(Moe); // undefined
	console.log(window.firstname) // "Moe" (oops)

	var Sam = new createPersonObject("Sam", "Dek", 45);
	console.log(Sam); // {firstname: "Sam", lastname: "Dek", age: 45}


### Intérêt des prototypes

- En faisant new o_b_j_e_c_t avec la manipulation de this, on ajoute une référence à la propriété "prototype" à chaque instance

- Ainsi, cela permet de définir des méthodes qui sont visibles sur chacune des instances :


	createPersonObject.prototype.fullName = "Nan";
	createPersonObject.prototype.greet = function(){ 
	    console.log("Salut! Je suis ", this.fullName, "Appelez moi ", this.firstname); 
	};
	Moe.fullName // "Nan"
	Moe.fullName = "Moe Ben"; 
	createPersonObject.fullName // Still "Nan"
	Moe.greet(); // "Salut! Je suis Moe Ben Appelez moi Moe"


- Convention : les fonctions du type createPersonObject sont "capitalized, singulières, nommées"



### Chaine des prototypes

get : recherche dans le courant puis le prototype père...etc d'une propriété
set : ne modifie que l'objet courant


accéder au prototype d'un objet:

	
	Object.getPrototypeOf(obj)

ou  

	obj.__proto__ // syntaxe non recommandé


### Héritage par prototype


	function Parent() {

		this.level = 'parent';

	 }

	 function Child() {

		this.level = 'child';

	 }

	 Child.prototype = new Parent();

	 Child.prototype.constructor = Child;

	 var ch1 = new Child();

	 var ch2 = new Child();


** Rarement utile !! **


## Closures

- une closure est une inner fonction qui a accès aux variables de son outer function


	function showName (firstName, lastName) {
	var nameIntro = "Your name is ";
	    // this inner function has access to the outer function's variables, including the parameter
	function makeFullName () {      
	return nameIntro + firstName + " " + lastName;   
	}

	return makeFullName ();
	}

	showName ("Michael", "Jackson"); // Your name is Michael Jackson


- Pour créer une closure : on créer une fonction à l'intérieur d'une autre fonction


### Impacts d'une closure


#### Accès à l'outer function même après le return de l'outer function

	function celebrityName (firstName) {
	    var nameIntro = "This celebrity is ";
	    // this inner function has access to the outer function's variables, including the parameter

	   function lastName (theLastName) {
	        return nameIntro + firstName + " " + theLastName;
	    }

	    return lastName;
	}

	var mjName = celebrityName ("Michael"); 
	// At this juncture, the celebrityName outer function has returned.

	mjName ("Jackson"); // This celebrity is Michael Jackson

#### Les closures stockent des références des variables de l'outer function


#### Source de bug : modification des variables de l'outer function





## Operandes && et ||

&& et || ne renvoient pas un booléen mais la valeur du dernier opérande évaluée

est considéré comme faux : chaine vide, nombre null, false, not a numeric, undefined

	obj && obj.fn() 

équivalent (appelle une méthode si l'objet n'est pas null)

	obj ? obj.fn() : obj


	value += i || 1 // incrément de i ou 1

## Boucle for in

Sert à itérer sur les noms des propriétés d'un objet

	for (var propertyName in obj) {

	 var propertyValue = obj[propertyName];

	 // ...

	 }


Pour ignorer les propriétés héritées du prototype :

	for (var propertyName in obj) {

		 if (obj.hasOwnProperty(propertyName)) {

		 	var propertyValue = obj[propertyName];

			 // ...

		 }

	 }



Lister les propriétés (non héritées) d'un objet

- Object.keys(obj) (ES5) : tableau des noms des propriétés énumérables de l'objet

- Object.getOwnPropertyNames(obj) (ES5) : tableau des noms des propriétés énumérables ou non de l'objet


** Ne jamais utiliser for...in pour itérer sur les éléments d'un tableau ** car :

- aucune garantie sur l'ordre

- les propriétés non définies sont sautés

- Cela itère aussi sur les autres propriétés (non numériques) éventuellement ajoutées au tableau



## Exceptions

Déclencher une exception : throw

l'exception est une donnée quelconque : objet, chaîne de caractère, nombre

	throw "Error2"; // generates an exception with a string value

objet utilisateur avec une méthode toString()

	 function ZipCode(zip) {

		 if (/[0-9]{5}([- ]?[0-9]{4})?/.test(zip)) {

		 	// ...

		 } else {

		 	throw new ZipCodeFormatException(zip);

		 }

	 }

	 function ZipCodeFormatException(value) {

		 this.value = value;

		 this.message = "does not conform to the expected format for a zip code";

		 this.toString = function() {

		 	return this.value + this.message

		 };

	 }


Constructeur prédéfini:

	new Error(message);




# Angular  - Introduction
=============================================================


## Les points forts:
- templates HTML / binding bi directionnel
- composants / directies 
- services / injection
- testable


## One Way data binding
- la vue n'est générée qu'une seule fois
- c'est le cas des vues générés par les serveurs
- Ajax pour générer de nouveaux une partie de la vue
- ou manipulations du DOM


## Two way data binding
- ne recoit que des fichiers statiques qui va etre compilé en vue dynamique qui se rafraichit automatiquement
- toutes les modifications se font sur le modèle
- l'application ne manipule jamais la vue (on ne touche pas au DOM)


## Logique et Vues
- séparation de la logique et des vues
- les vues ont accès aux données et fonctions (scope)
- controleurs servent à initialiser et publier le scope
- le controleurs n'a aucune référence à la vue
- il peut être testé unitairement sans aucune vue


# Les bases

## Controleurs
- son rôle : publier dans le scope tout ce qui va etre utilisé dans le template
- fonction JS globale ou dans un module
- fonction utilisée comme constructeur
	- alimenter this pour l'enrichir
	- permet de créer plusieurs controlleurs héritant du même prototype

- il est rattaché à une portion de la vue par la directive ng-controller


## Scope
- contexte d'exécution des expressions de la vue
- héritage par prototype entre le scope parent et enfant
- certaines directives créent un nouveau scope