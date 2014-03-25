# Jours 5 : event, directives, best practices, animations
=============================================================

## ecouter un event


	$scope.$on(name, listener)

	name : string

	listener : fn(event, args) 

	renvoie une fonction qui permet d'arreter de surveiller cette event 


L'objet event contient les properties :


	name : nom de l'event

	targetScope : scope sur lequel a été déclenché l'event
	currentScope : le scope sur lequel est intercepté l'event

## event Angular en std

###Scopes

	$destroy : utile pour faire du nettoyage // emis juste avant la suppression d'un scope

### ngInclude

	$includeContentLoaded // émis après le chargement d'un include

### $location

	$locationChangeStart
	$locationChangeSuccess

### $route

	$routeChangeStart
	$routeChangeSuccess
	$routeChangeError
	$routeUpdate : 
		// si reloadOnSearch de la route est à false, alors il ne fait pas de changement de route mais déclenche un $routeUpdate

## Déclencher un event

	$scope.$emit(name, args) 

- emet un event sur le scope, puis le propage aux scope parents

	$scope.$broadcast(name, args)

- pour propager vers les scope enfants

# Exceptions

- les exceptions non  interceptées sont passés au service 

	$exceptionHandler(exception[, cause]) 

- par défaut : délègue à $log.error pour afficher l'erreur de la console


- on peut surcharger $exceptionHandler
	
	- créer un service avec le même nom pour effectuer un traitement différent






# Directives
=============================================================

- nom camel case
	ngModel 

- dans le HTML, on peut faire

	`ng-model`
	ng:model
	ng_model
	x-ng-model
	data-ng-model // compatible HTML5

- Directives détectées dans 
	
	[E] : <my-dir></my-dir>
	[A]	: <span my-dir
	[C] : <span class="my-dir: exp;"
	[M] : <!-- directive: my-dir exp -->

## Compilation

- le navigateur charge le DOM, il lit le source HTML du template, l'interprète

- Ensuite Angular va compile en 2 phases
	
	### compile : exécute un service $compile (qui est une fonction que l'on peut exécuter)
		- il va détecter les directives : il va convertir les noms des elements et artttibuts sans camel case puis regarder s'il y a une directive, 
		- puis va traiter par priorité les directives d'un même élément
		- puis exécute les fonctions compile des directives 
		- La fonction compile peut modifier le DOM mais n'a pas accès au scope
		- elle peut renvoyer 2 fonctions : prelink ou postlink
		- les fonctions link servent à faire le lien entre le DOM et le scope

		- compile n'est fait qu'une seule fois sur le template avant répétition
		, à la différence de link qui va étre fait sur chaque élément 

	### link : watches sur le scope + ... (voir slides)

		- paramètres positionnels

		<span my-bind="user.name" // my-bind joue 2 rôles : déclenche la directive et permet de stocker l'élément

		// on pourrait séparer les deux :

			<span my-bind my-bind-expr ="user.name" 
  

		module.directive('myBind', function(){ 

		// ** directive exécuté qu'une seule fois qui créé un watch et c'est tout ! **

			return function(scope, element, attr){

				element.addClass('ng-binding').data('$binding', attr.myBind) // attr.myBindExpr 

				scope.$watch(attr.myBind, function(value){

					// ou bien scope.$watch(attr.myBindExpr, function(value){

					element.text(value == undefined ? '' : value);
				})

			}
		})

		- crée une directive de priorité 0

## Objet de définition d'une directive

- la factory renvoie un objet dont les propriétés définissent la directive

	return {
		priority: 0 // default : le plus prioritaire est ng-repeat (1000)
		, restrict: 'A' // default, EACM, EA
		, scope: false
		, link: function(...) // même fonction que précédement
		, terminal : false // si true, ignore toutes les directives de priorités inférieures
	}

## Link et compile

- si on met quelque chose dans une fonction compile alors la fonction link est ignoré
=> donc ne pas mettre les fonctions link et compile en même temps


### compile(element, attrs)

- elle peut renvoyer une fonction link
- elle peut return 2 objets

	return {
		pre: function preLink(scope, element, attrs)
		post: function postLink(scope...)
	}

### link(scope, element, attrs)


### paramètre element:

	element[0] : permet de récupérer le vrai élément HTML

- utilise jqlite si jquery n'est pas chargé
- jqlite est plus restreint (pas de sélecteurs CSS)
- contient des méthodes aditionnelles
	
	controller(name)
	injector()
	scope()

### attrs

- nom des attributs normalisés en camel case 

	data-ng-bind // => attrs.ngBind

- modif :

	attrs.$set('ngModel', 'newValue')

- particularités des expressions contenant {{}}

	- ils sont à undefined lors de l'exécution de la fonction link()

	- utilise la méthode $observe de l'objet attribut pour suivre leur valeur (avec un callback)

- les attributs sont partagés par tous les éléments d'une même directive



### Propriété scope d'une directive

3 valeurs

#### false

- la directive travaille sur le scope courant

#### true
- la directive demande la création d'un nouveau scope pour cet élément HTML
- exemple : ng-controller

- si plusieurs directives sur l'élément : si une directive demande un scope alors toute les autres en ont un même s'ils en n'ont pas démandé

#### scope : {objetsJS}

- scope isolé
- il n'hérite de rien

	{ prop1 : '@attr'} // attribut texte (le plus rare) 

	//  on peut le remplacer par attr.xxx (si l'attr ne peut pas contenir d'expression)
	// ou attrs.$observe('xxx', function(value)...)

	{ prop2 : '=attr'} // contient une expression angular qui sert de binding (le plus courant)

	// on peut le remplacer par scope.$watch(attrs.xxxx, fucntion(new, old))
	// ou bien $parse(attrs.xxx).assign(scope, value)

	{ prop3 : '&attr'} // expression qui sert d'action. exemple : ng-click

	// on peut le remplacer par $parse(attrs.xxxx)(scope, locals)  locals est l'objet que l'on a passé en param de la directive


** dans les 3 cas, si on ne met rien après le caractère, il prend le nom de l'attribut **

##### @

- binding mono-directionnel de la propriété sur la valeur d'un attribut texte

	<person name='{{user.firstname}}'

	scope: {
		name: '@' // name va prendre user.firstname
	}

- les expressions sont évalués sur le scope parent du scope isolé

##### Scope isolé 

- l'attribut contient une expression sans {{}}
- l'expression désigne une propriété du scope parent

	<person name='user.firstname'

	scope: {
		name: '=' // chaque fois que user.firstname sera modifié, il impact name et inversement 
	}

- résultat d'une fonction : ça ne marche pas. Il faut une expression assignable.

##### Scope isolé

	<delete-button action='remove(user)'
	scope: {
		
		action: '&' // pour lui dire que c'est une action

		// Angular va créer une fonction : en faisant scope.action() on aura un remove(user)
	}

- pour lui passer des valeurs

	scope.action({user: previousUser})

### Propriété template

- template (html) : c'est un template HTML Angular, créé par la directive, à l'intérieur ou à la place de l'élément courant suivant la valeur de replace

- ou  bien templateUrl 

- replace = true : le contenu remplace l'élément courant / il remplace un élément par un élément  
	-- false pour qu'il soit généré à l'intérieur.

- transclude : 
		false
		true : compile le contenu de l'élément et le met à disposition de la directive
		'element' // extrait l'élement lui même et son contenu : on peut insérer l'ancien élément à l'endroit indiqué par transclude

- on peut récupérer le transclude en le passant en param de la fonction link


### Controller

use case : partage de controleur entres directives

- Une directive peut créer un controleur.

- le controleur sera instancié avant la phase pre-link
- ce même objet peut être partagé avec d'autres directives
	- placées sur le même élément ou des éléments enfants
	- si elles y accèdent avec la propriété require

- on peut lui injecter des services (non positionnelles)
	$scope // scope local de l'élément
	$element // 

- prop :  name
	- nom sous lequel est publié le controleur crée par la directive


### require (string|array[string]) **A reprendre des slides **
- controleur requis par la directive

require: ['ngBind', '?ngClass', '^ngView']


### Scope isolé en version 1.2.0

- le scope ne s'applique plus à tout l'élément
- la directive qui créé le scope isolée est la seule à le voir, les autres directives du même élément reçoivent le scope parent

- si elle n'a pas de template : le contenu de l'élément est sur le scope parent (en 1.1 sur le scope parent)

### TU de directives

	inject(function($compile, $rootScope){
		var element = $compile('<span directivemachin></span>')($rootScope) 

		// service qui sert à publier un morceau de template, il renvoit une fonction link, que l'on appel en passant le scope

		// element: objet jquery avec le span
		})



# Bonnes pratiques

- "use strict" sur le JS

- ne pas polluer le contenu global en utilisant des wrapper anonymes
 -- mettre tout le contenu de chaque fichier dans un wrapper anonyme
 -- mettre les controleurs dans des modules et non en fonction globales


##Pattern MVVM : model - view - ViewModel

- ViewModel : ce n'est pas le scope
il est géré dans les services
publier dans le scope seulement les parties du modèle nécessaires à une vue

model : serveur
view et viewModel : angular

## Dirty Checking

- travailler sur des états du scope, c'est rare que ça soit pertinent de manipuler des event

- utiliser scope.$watch
	- pour associer un traitement à un changement d'état
	- utile losrqu'on a un calcul et qu'on ne veut pas le refaire systématiquement
	- non sur chaque digest
	- ne jamais mettre un watch sur un calcul lourd : le faire dans un watch puis le stocker

## Controleur léger

- garder les controleurs simple

- parser les saisies: on crée un parser pour NgModelController ($parsers)

- formattage des données d'un champ de saisie : $formatters

- partager du code entre controleurs : utiliser plutot des services

- pas de manip de DOM dans un controleurs (pas de element hors d'une directive)

## Services simples

- mettre la logique métier dans les services

- séparer les problématiques

## $rootScope VS controleur global VS service

- rootScope : avantage : injectable dans les services, disponible partout dans la vue, 
attention à ne pas le changer car des watches dans le rootScope seront vérifié sur tous les event de l'app

- controleur global
inutilisable dans les services

- service
bon endroit pour la logique et les manipulations de données
accessible depuis la vue tant qu'il n'est pas publié dans le scope

compromis :
- faire un service avec toute la logique
- publié dans le $rootScope s'il est utilisé à de nombreux endroits
- préférer un controleur local
	- les controleurs doivent pouvoir s'exécuter sans view


## Gestion des erreurs

- le mettre tot dans le projet
- sources d'erreur:
	- interceptor : pour les erreurs http
	- $exceptionHandler : à surcharger car il a les exceptions interceptées par Angular

- utiliser les promises
	- simplifie l'asynchrone
	- et la centralisation des erreurs

## ngInclude

- prend une expression dans l'attribut src : mettre une valeur en dure entre apostrophes à l'intérieur des guillements

ou bien avec une expression le template est rechargé si la valeur de l'expression change

- cela permet de calculer cette valeur

- on utilise ngView pour naviguer entre nouvelle page et mettre ngInclude à l'intérieur d'une vue (sans ajouter d'entrée dans l'historique du navigateur)


## Template inline

	<script type="text/ng-template" id="/tpl.html">
		content
	</script>

** voir slides **

## templates récursifs

** voir slides **


le include récursif est une solution lourde

voir la directive de Chatel : angular-treeRepeat qui est un ng-repeat récursif


## Astuces diverses

- $cacheFactory. use case : service global pour conserver l'état d'une page

- on peut faire des directives correspondant aux éléments std du HTML

## Danger dans des types primitifs dans le scope

- l'utilisation de types primitifs dans le scope est source d'erreurs

- pb si on fait un ng-repeat sur un tableau de types primitifs et qu'on veut les modifer par i, ngModel
	car en JS les types primitifs sont passés par copie

- de même si scope parent et enfant

- en 1.1.5

	ng-controller="ctrl as ctrl" // publie le controleur dans le scope sous le nom ctrl

	// ainsi on peut se passer de $scope et tout mettre dans this


## Animations

- module optionnel ngAnimate / ng-animate.js

- 3 groupes animations

-- transitions CSS (>=10) : event : leave ou mode : début sur .ng-leave, fin sur lg-leave-active ...

-- animations CSS (>=10)

-- Sans CSS (jquery) : ajout d'une 







