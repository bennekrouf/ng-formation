
# Jours 1 : Javascript 
=============================================================
## 1 / Types primitifs : 

- Undefined : aucune valeur
- Null : explicitement null
- Il n’y a qu’un seul type  numérique : number
- Pas de type caractère

0.1 + 0.2 == 0.3 => false

ajout de nombre à 2 décimales ne fait pas forcément un nombre à 2 décimales

ils sont immuables : 

	var a = 123; var b=a; //  affecte la valeur directement et non l'adresse

ils sont convertis en objet lorsque c'est nécessaire (uniquement le temps de l'utilisation, l'objet est perdu / non stocké / auto boxing ):

	var n=5; n.toString();

		
== : comparaison avec conversion automatique de types / fonctionne bien sur les types primitifs et non sur les objets
donc éviter de faire des var f = new String("fdsfs");	

1 == true; // true car il converti le true en nombre donc 1
"true" == true ; // false
new Number(1) == new number(1) // false

si un des deux opérandes est une chaine alors il essaie de convertir tout en chaine
sinon compare les références des objets

=== : comparaison strict : sans conversion automatique
true : types primitifs égaux en valeur, ou bien 2 opérandes égales en adresse
sinon false


## 2 / Les objets

- sont des tableaux de clefs/valeurs
clef : chaine de caractères

on peut faire : obj.clef (notation simplifié autorisé s'il n'y pas de carac non autorisés) ou object['clef']

obj['a.b'] mieux que obj.a.b

supprimer une propriété :
var a = {p1 : 1, p2: 2};
a.p2 = undefined;
a // Object {p1: 1; p2: undefined}

faire plutot :
delete params[keys]; => Object {p1: 1;}

## 3/ Les tableaux

a['01'] = 8 
Object.keys(a) // on va avoir la clé
mais si on fait : a // alors on n'aura pas la valeur
car 01 n'est pas considéré comme un entier 

a.length = 0 pour vider un tableau // vide tout le tableau sauf les index non numériques

length : propriété toujours supérieur au plus grand des index

array.push ajoute à la fin d'un tableau / pop enlève et renvoie le dernier éléments du tab / shift : enlève le premier élément et décrémente

pour insérer au début du tableau : unshift
splice : ajout ou supprimer à un certain index
reverse, sort

	$scope.articles.splice(index, 1); // supprime 1 seul élément à l'index 

concat et slice créé des nouveaux tableaux

a.concat (b) : ne modifie pas a mais créé un nouveau tableau

slice renvoit une copie


fonctions ECMAScript5 : indexOf, lastIndexOf, forEach 
-every et some : on passe un callback qui renvoit un boolean
-every : vrai si le callback dit vrai pour tous les éléments
-some pour some éléments
-filter renvoit un nouveau tableau avec les éléments qui passe true dans le callback
- map : sert un calculer un tableau de valeurs
- reduce : un seul élément : exemple : somme des éléments d'un tableau


## les fonctions - Définition

2 façons de définir :
	
	function fn1(toto){} // ne renvoit pas de valeurs + nom obligatoire

	return function fn(toto) // nom non obligatoire sauf si récursif +  créé un objet function et le renvoit

différence entre
function f1()

et var f2 = function()

f1 est exécuté au premier passage de JS, f2 uniquement lorsqu'elle est appelé


## les fonctions - les appels

###1
	data = transform(a,b,c);

"arguments" pseudo tableau, pas de type array, mais possède un index numérique et une longeur
arguments[0]
arguments.length

this = undefined en mode strict
sinon objet global en mode normal

### 2
ou bien

	a.push(value) //ou a['push'](value)


### 3 fonction appelé comme constructeur

	var obj = new Fn(arg);

JS créé un nouvel objet dont le prototype est Fn.prototype (prototype est une propriété créé automatiquement
sur toutes les fonctions)

Fn.prototype est le prototype des instances et non de la fonction (dont le prototype est function.prototype)


	obj.constructor === Fn

	obj instanceof Fn

Ajout de fonctions au prototype : 

	Fn.prototype.functionName = function(arg){}

Permet d'affecter cette fonctions à toutes les instances

### 4

toutes les fonctions héritent de 2 méthodes : call et apply

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


## Chaine des prototypes

get : recherche dans le courant puis le prototype père...etc d'une propriété
set : ne modifie que l'objet courant


accéder au prototype d'un objet:
	
	Object.getPrototypeOf(obj)

ou  obj.__proto__


## Héritage par prototype

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


Rarement utile



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


Ne jamais utiliser for...in pour itérer sur les éléments d'un tableau

- aucune garantie sur l'ordre

- la propriétés non définies sont sautés

- ça itère aussi sur les autres propriétés (non numériques) éventuellement ajoutées au tableau

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




# Jours 2 : Angular Introduction
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


## Quelques directives












