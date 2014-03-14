
# Jours 1 : Javascript 
=============================================================
## 1 / Types primitifs : 

- Undefined : aucune valeur
- Null : explicitement null
- Il n�y a qu�un seul type  num�rique : number
- Pas de type caract�re

0.1 + 0.2 == 0.3 => false

ajout de nombre � 2 d�cimales ne fait pas forc�ment un nombre � 2 d�cimales

ils sont immuables : 

	var a = 123; var b=a; //  affecte la valeur directement et non l'adresse

ils sont convertis en objet lorsque c'est n�cessaire (uniquement le temps de l'utilisation, l'objet est perdu / non stock� / auto boxing ):

	var n=5; n.toString();

		
== : comparaison avec conversion automatique de types / fonctionne bien sur les types primitifs et non sur les objets
donc �viter de faire des var f = new String("fdsfs");	

1 == true; // true car il converti le true en nombre donc 1
"true" == true ; // false
new Number(1) == new number(1) // false

si un des deux op�randes est une chaine alors il essaie de convertir tout en chaine
sinon compare les r�f�rences des objets

=== : comparaison strict : sans conversion automatique
true : types primitifs �gaux en valeur, ou bien 2 op�randes �gales en adresse
sinon false


## 2 / Les objets

- sont des tableaux de clefs/valeurs
clef : chaine de caract�res

on peut faire : obj.clef (notation simplifi� autoris� s'il n'y pas de carac non autoris�s) ou object['clef']

obj['a.b'] mieux que obj.a.b

supprimer une propri�t� :
var a = {p1 : 1, p2: 2};
a.p2 = undefined;
a // Object {p1: 1; p2: undefined}

faire plutot :
delete params[keys]; => Object {p1: 1;}

## 3/ Les tableaux

a['01'] = 8 
Object.keys(a) // on va avoir la cl�
mais si on fait : a // alors on n'aura pas la valeur
car 01 n'est pas consid�r� comme un entier 

a.length = 0 pour vider un tableau // vide tout le tableau sauf les index non num�riques

length : propri�t� toujours sup�rieur au plus grand des index

array.push ajoute � la fin d'un tableau / pop enl�ve et renvoie le dernier �l�ments du tab / shift : enl�ve le premier �l�ment et d�cr�mente

pour ins�rer au d�but du tableau : unshift
splice : ajout ou supprimer � un certain index
reverse, sort

	$scope.articles.splice(index, 1); // supprime 1 seul �l�ment � l'index 

concat et slice cr�� des nouveaux tableaux

a.concat (b) : ne modifie pas a mais cr�� un nouveau tableau

slice renvoit une copie


fonctions ECMAScript5 : indexOf, lastIndexOf, forEach 
-every et some : on passe un callback qui renvoit un boolean
-every : vrai si le callback dit vrai pour tous les �l�ments
-some pour some �l�ments
-filter renvoit un nouveau tableau avec les �l�ments qui passe true dans le callback
- map : sert un calculer un tableau de valeurs
- reduce : un seul �l�ment : exemple : somme des �l�ments d'un tableau


## les fonctions - D�finition

2 fa�ons de d�finir :
	
	function fn1(toto){} // ne renvoit pas de valeurs + nom obligatoire

	return function fn(toto) // nom non obligatoire sauf si r�cursif +  cr�� un objet function et le renvoit

diff�rence entre
function f1()

et var f2 = function()

f1 est ex�cut� au premier passage de JS, f2 uniquement lorsqu'elle est appel�


## les fonctions - les appels

###1
	data = transform(a,b,c);

"arguments" pseudo tableau, pas de type array, mais poss�de un index num�rique et une longeur
arguments[0]
arguments.length

this = undefined en mode strict
sinon objet global en mode normal

### 2
ou bien

	a.push(value) //ou a['push'](value)


### 3 fonction appel� comme constructeur

	var obj = new Fn(arg);

JS cr�� un nouvel objet dont le prototype est Fn.prototype (prototype est une propri�t� cr�� automatiquement
sur toutes les fonctions)

Fn.prototype est le prototype des instances et non de la fonction (dont le prototype est function.prototype)


	obj.constructor === Fn

	obj instanceof Fn

Ajout de fonctions au prototype : 

	Fn.prototype.functionName = function(arg){}

Permet d'affecter cette fonctions � toutes les instances

### 4

toutes les fonctions h�ritent de 2 m�thodes : call et apply

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


## Chaine des prototypes

get : recherche dans le courant puis le prototype p�re...etc d'une propri�t�
set : ne modifie que l'objet courant


acc�der au prototype d'un objet:
	
	Object.getPrototypeOf(obj)

ou  obj.__proto__


## H�ritage par prototype

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


Ne jamais utiliser for...in pour it�rer sur les �l�ments d'un tableau

- aucune garantie sur l'ordre

- la propri�t�s non d�finies sont saut�s

- �a it�re aussi sur les autres propri�t�s (non num�riques) �ventuellement ajout�es au tableau

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




# Jours 2 : Angular Introduction
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


## Quelques directives












