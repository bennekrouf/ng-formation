
# Javascript : 
=============================================================

Dans ce chapitre sont trait�s :
- Types primitifs
- Objets
- Tableaux
- Fonctions
- Closures
- Operandes && et ||
- Exceptions

et enfin :

- Introduction � Angular



## Les types primitifs 

- Undefined : aucune valeur
- Null : explicitement null
- Il n�y a qu�un seul type  num�rique : number
- Pas de type caract�re

	0.1 + 0.2 == 0.3 // false

ajout de nombre � 2 d�cimales ne fait pas forc�ment un nombre � 2 d�cimales

### Ils sont immuables : 

	var a = 123; var b=a; //  affecte la valeur directement et non l'adresse

### Auto boxing

Ils sont convertis en objet lorsque c'est n�cessaire 
- uniquement le temps de l'utilisation, l'objet est perdu / non stock�:

	var n=5; n.toString();

### =, ==, ===

#### == 

- Comparaison avec conversion automatique de types
- Fonctionne bien sur les types primitifs
- Ne fonctionne pas sur les objets

donc �viter de faire des 

	var f = new String("fdsfs");	

Exemples :

	1 == true; 						// true car il converti le true en nombre donc 1
	"true" == true ; 				// false
	new Number(1) == new Number(1) 	// false

- Si un des deux op�randes est une chaine alors il essaie de convertir tout en chaine
- Sinon compare les r�f�rences des objets

#### ===

Comparaison strict : sans conversion automatique

Renvoie true si 
- ce sont des types primitifs �gaux en valeur,
- ou bien 2 op�randes �gales en adresse

Sinon false


## Les objets

- Ce sont des tableaux de clefs/valeurs avec :

	clef // chaine de caract�res

- On peut faire

	obj.clef // notation simplifi� autoris� s'il n'y pas de carac non autoris�s ou bien :
	object['clef']  

	obj['a.b'] // mieux que obj.a.b

- Supprimer une propri�t� :

	var a = {p1 : 1, p2: 2};
	a.p2 = undefined;
	a 							// Object {p1: 1; p2: undefined}

- Faire plutot :

	delete params[keys]; => Object {p1: 1;}

## Les tableaux

	a['01'] = 8 
	Object.keys(a) 	// on va avoir la cl�

- Mais si on fait
	
	a['01']			// alors on n'aura pas la valeur

car 01 n'est pas consid�r� comme un entier 

	a.length = 0  // pour vider un tableau : vide tout le tableau sauf les index non num�riques

- length : propri�t� toujours sup�rieur au plus grand des index

	array.push  // ajoute � la fin d'un tableau
	unshift		// pour ins�rer au d�but du tableau

	shift		// enl�ve le premier �l�ment et d�cr�mente
	pop         // enl�ve et renvoie le dernier �l�ments du tableau

	splice 		// ajoute ou supprime � un certain index
	
	reverse
	sort

Exemple :

	$scope.articles.splice(index, 1); // supprime 1 seul �l�ment � l'index 

- concat et slice cr�� des nouveaux tableaux

	a.concat(b) // ne modifie pas a mais cr�� un nouveau tableau

- slice renvoit une copie


### Fonctions ECMAScript5 : indexOf, lastIndexOf, forEach

- every et some : on passe un callback qui renvoit un boolean
- every : vrai si le callback dit vrai pour tous les �l�ments
- some : pour some �l�ments
- filter renvoit un nouveau tableau avec les �l�ments qui passe true dans le callback
- map : sert � calculer un tableau de valeurs
- reduce : un seul �l�ment (ex : somme des �l�ments d'un tableau)


## Les fonctions - D�finition

### 2 fa�ons de les d�finir :
	
	function fn1(toto){} 		// ne renvoit pas de valeurs et le nom obligatoire

	return function fn(toto) 	// le nom est facultatif sauf si r�cursif + cr�� un objet function et le renvoit

diff�rence entre
	
	function f1()

et 

	var f2 = function()

f1 est ex�cut� au premier passage de JS, f2 uniquement lorsqu'elle est appel�


## Les fonctions - appels de fonctions

### 1 - Appel direct

	data = transform(a,b,c);

- "arguments" pseudo tableau
- pas de type array, mais poss�de un index num�rique et une longeur
	
	arguments[0]
	arguments.length

### Tips sur this

	this // undefined en mode strict

sinon objet global en mode normal (window)

### 2 - Appel d'une fonction propri�t� d'un objet

	a.push(value) // ou a['push'](value)


### 3 - Fonctions appel�s comme constructeur

	var obj = new Fn(arg);

JS cr�� un nouvel objet dont le prototype est Fn.prototype 

### Tips sur les prototypes

** prototype est une propri�t� cr��e automatiquement sur toutes les fonctions ** 

- Fn.prototype est le prototype des instances et non de la fonction
- Le prototype des functions est function.prototype !

	obj.constructor === Fn

	obj instanceof Fn // true

- Ajout de fonctions au prototype : 

	Fn.prototype.functionName = function(arg){}

- Permet d'affecter cette fonctions � toutes les instances

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

- Toutes les fonctions h�ritent de 2 m�thodes : call et apply

	fn.call(thisArg, arg1)

ou 

	fn.apply(thisArg, [arg1, arg2])

### 5

fonctions anonymes ex�cut�es directement pour isoler un scope

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


	Objet.prototype // repr�sente l'objet prototype de Object (p�re de tous les objets js)


### New et this sont sur un bateau

- Toutes les fonctions JS sont des objets
- Toutes les fonctions JS peuvent �tre utilis�s pour cr�er des objets


	function createPerson(firstname, lastname, age) {
	    person = {};
	    person.firstname = firstname;
	    person.lastname = lastname;
	    person.age = age;
	    return person;
	}
	createPerson("Moe", "Ben", 36);
	// {firstname: "Moe", lastname: "Ben", age: 36}


- Remarque : "createPerson()" et "new createPerson" vont faire la m�me chose (renvoit de l'objet person)

- En revanche, pour cr�er des nouveaux objets d'un type particulier, on utilise new :


	function createPersonObject(firstname, lastname, age) {
	    this.firstname = firstname;
	    this.lastname = lastname;
	    this.age = age;
	    // pas de return
	}


- createPersonObject() : va d�finir les attributs de this sur l'objet courant de this (window sur un browser)

- new createPersonObject() : va instancier l'objet


	var Moe = createPersonObject("Moe", "Ben", 36);
	console.log(Moe); // undefined
	console.log(window.firstname) // "Moe" (oops)

	var Sam = new createPersonObject("Sam", "Dek", 45);
	console.log(Sam); // {firstname: "Sam", lastname: "Dek", age: 45}


### Int�r�t des prototypes

- En faisant new o_b_j_e_c_t avec la manipulation de this, on ajoute une r�f�rence � la propri�t� "prototype" � chaque instance

- Ainsi, cela permet de d�finir des m�thodes qui sont visibles sur chacune des instances :


	createPersonObject.prototype.fullName = "Nan";
	createPersonObject.prototype.greet = function(){ 
	    console.log("Salut! Je suis ", this.fullName, "Appelez moi ", this.firstname); 
	};
	Moe.fullName // "Nan"
	Moe.fullName = "Moe Ben"; 
	createPersonObject.fullName // Still "Nan"
	Moe.greet(); // "Salut! Je suis Moe Ben Appelez moi Moe"


- Convention : les fonctions du type createPersonObject sont "capitalized, singuli�res, nomm�es"



### Chaine des prototypes

get : recherche dans le courant puis le prototype p�re...etc d'une propri�t�
set : ne modifie que l'objet courant


acc�der au prototype d'un objet:

	
	Object.getPrototypeOf(obj)

ou  

	obj.__proto__ // syntaxe non recommand�


### H�ritage par prototype


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

- une closure est une inner fonction qui a acc�s aux variables de son outer function


	function showName (firstName, lastName) {
	var nameIntro = "Your name is ";
	    // this inner function has access to the outer function's variables, including the parameter
	function makeFullName () {      
	return nameIntro + firstName + " " + lastName;   
	}

	return makeFullName ();
	}

	showName ("Michael", "Jackson"); // Your name is Michael Jackson


- Pour cr�er une closure : on cr�er une fonction � l'int�rieur d'une autre fonction


### Impacts d'une closure


#### Acc�s � l'outer function m�me apr�s le return de l'outer function

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

#### Les closures stockent des r�f�rences des variables de l'outer function


#### Source de bug : modification des variables de l'outer function





## Operandes && et ||

&& et || ne renvoient pas un bool�en mais la valeur du dernier op�rande �valu�e

est consid�r� comme faux : chaine vide, nombre null, false, not a numeric, undefined

	obj && obj.fn() 

�quivalent (appelle une m�thode si l'objet n'est pas null)

	obj ? obj.fn() : obj


	value += i || 1 // incr�ment de i ou 1

## Boucle for in

Sert � it�rer sur les noms des propri�t�s d'un objet

	for (var propertyName in obj) {

	 var propertyValue = obj[propertyName];

	 // ...

	 }


Pour ignorer les propri�t�s h�rit�es du prototype :

	for (var propertyName in obj) {

		 if (obj.hasOwnProperty(propertyName)) {

		 	var propertyValue = obj[propertyName];

			 // ...

		 }

	 }



Lister les propri�t�s (non h�rit�es) d'un objet

- Object.keys(obj) (ES5) : tableau des noms des propri�t�s �num�rables de l'objet

- Object.getOwnPropertyNames(obj) (ES5) : tableau des noms des propri�t�s �num�rables ou non de l'objet


** Ne jamais utiliser for...in pour it�rer sur les �l�ments d'un tableau ** car :

- aucune garantie sur l'ordre

- les propri�t�s non d�finies sont saut�s

- Cela it�re aussi sur les autres propri�t�s (non num�riques) �ventuellement ajout�es au tableau



## Exceptions

D�clencher une exception : throw

l'exception est une donn�e quelconque : objet, cha�ne de caract�re, nombre

	throw "Error2"; // generates an exception with a string value

objet utilisateur avec une m�thode toString()

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


Constructeur pr�d�fini:

	new Error(message);




# Angular  - Introduction
=============================================================


## Les points forts:
- templates HTML / binding bi directionnel
- composants / directies 
- services / injection
- testable


## One Way data binding
- la vue n'est g�n�r�e qu'une seule fois
- c'est le cas des vues g�n�r�s par les serveurs
- Ajax pour g�n�rer de nouveaux une partie de la vue
- ou manipulations du DOM


## Two way data binding
- ne recoit que des fichiers statiques qui va etre compil� en vue dynamique qui se rafraichit automatiquement
- toutes les modifications se font sur le mod�le
- l'application ne manipule jamais la vue (on ne touche pas au DOM)


## Logique et Vues
- s�paration de la logique et des vues
- les vues ont acc�s aux donn�es et fonctions (scope)
- controleurs servent � initialiser et publier le scope
- le controleurs n'a aucune r�f�rence � la vue
- il peut �tre test� unitairement sans aucune vue


# Les bases

## Controleurs
- son r�le : publier dans le scope tout ce qui va etre utilis� dans le template
- fonction JS globale ou dans un module
- fonction utilis�e comme constructeur
	- alimenter this pour l'enrichir
	- permet de cr�er plusieurs controlleurs h�ritant du m�me prototype

- il est rattach� � une portion de la vue par la directive ng-controller


## Scope
- contexte d'ex�cution des expressions de la vue
- h�ritage par prototype entre le scope parent et enfant
- certaines directives cr�ent un nouveau scope