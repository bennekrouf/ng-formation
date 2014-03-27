
# Chapitre 3 : Fonctionnement interne, les modules, le Routage
=============================================================

Ce chapitre traite les thèmes:
- Rafraichissement des vues
- Cycles $digest
- Watch
- Dirty checking vs change listeners
- Le DOM comme template
- $apply

- Les modules
- module.run et module.config
- Routage
- $route et ngview
- $routeParams
- $location
- Liens et redirection

### Rafraichissement des vues

- dirty checking:
	- parcours une série de watch : si nouvelle valeur différente de l'ancienne alors exécute le code associé

- la plupart des watch sont crées par des directives

	ng-model="user.name"  

- ou dans les controleurs

	$scope.$watch('user.name', function(newValue, oldValue))

[Slides] ### Liste des watchs

- plusieurs parcours complets jusqu'à stabilisation du modèle

- plusieurs car déclenchement de code qui impacte d'autres watch

- l'évaluation de l'expression doit être rapide (indépendament du code qui lui n'est pas exécuté systématiquement)


### Exécution d'un traitement suite à un event

- appel de 

	
	$scope.$apply(fn)  // angular exécute fn


- la boucle $digest c'est 
	- $evalAsync queue : task asynchrone en attente
	- liste des watches
	- la boucle $digest se finit lorsque plus aucun watch n'est modifié

- il y a un blocage à 10 itérations max dans la boucle digest

### Watch manuel


	var removeWatch = $scope.$watch(watchExpression, listener, objectEquality)


`watchExpression` : string ou function

listener` function(new, old, scope) ou expression (string)

`objectEquality`

		par défaut à false = ne surveille que la référence des objets
		true : compare en profondeur des objets et tableaux


- Cette fonction renvoie un watch que l'on peut enlever en faisant : removeWatch();
 
**Important : Quand faire un watch ?**: on va faire un watch pour exécuter une opération couteuse, car en le mettant dans une expression parsé sur le markup on risque d'avoir un parsing trop fréquent

### Dirty checking vs change listeners

- avantage dirty checking
	- fonctionne avec n'importe quels objet , pas besoin de setters pour détecter les modifs
	- un seul refresh pour tout un ensemble de modifs
	- pas d'interruption de traitement, les détections sont faites après

- perf
	- pb si des watches sur des calculs couteux
	- 2000 watches simples supportables

### Le DOM comme template

- les templates (HTML) sont chargés par le navigateur (et pas angular)
- quand le DOM est chargé, angular va compiler le template (ng-app) :
	- détection des directives
	- traitements associés ; watch, manip du DOM

- compilation Angular n'est exécutée qu'une seule fois

- => il faut que le HTML soit valide car c'est le navigateur qui charge
- => car angular va compiler le template du DOM et non le HTML fournis en source par le développeur

### $apply


	$scope.$apply(expression) // Permet d'exécuter un traitement déclenché par un event externe 


- A ne pas utiliser avec les services ou directives d'angular comme ng-click ou $http car le $apply y est déjà

- A l'intérieur de la boucle $digest de refresh on ne peut pas appeler $apply

- Au contraire on peut inject $timeout, et appeler $timeout de la fonction JS sans préciser de délai



## Les modules

- servent à regrouper les services, controlleurs, directives, filtres

- création d'un module

	angular.module('module', [])

- le mettre dans une variable créée une variable globale

- pour éviter cela : 
	- enchainer sans l'affecter à une variable
	- le mettre dans un wrapper anonyme (fn())()

## les modules standards

- ng : toujours dispo, inutile de le mettre en dépendance
- ngResource : fichier angular-resource à inclure
- ngSanitize avec son fichier à inclure : sert à épurer du html que l'on veut insérer dans le template (code dangereux)
- ngTouch : event touch
- animate, cookies, mock et mockE2E

## les modules utilisateurs

- recommandation : un fichier par module en dev
- 2 choses à faire
	- charger le fichier JS pour le définir en le mettant en dépendance
	- l'indiquer en dépendance pour qu'il soit actif

## le module principale

- ce qui fait qu'il est principal est le fait de le mettre dans ng-app

- on peut faire aussi:

	angular.bootstrap(document.body, ['app']) 

	// permet d'exécuter du code avant le démarrage de l'application AngularJS
	// exemple chargement d'une librairie nécessaire avant le chargement de l'app qui s'appuierai sur cette lib

	au lieu de : 

	<body ng-app='app'> // ne faire que l'un ou l'autre mais pas les deux


## .run et .config

- .config : 
	- on lui passe un callback qui va servir à configurer les services
	- les services ne sont pas encore créé, on ne peut donc pas lui injecter les services mais le provider des services

	$httpProvider.defaults.headers.get['My-Header'] = 'value';

on configure les services avant leur création

	exemple d'utilisation : config du routage

- .run
	- faire de la config applicative, après la création de l'injecteur de dépendance
	- on peut injecter des services, faire des requêtes http ...


# Routage


## 

utile pour les SPA

routeur de base dans ng-resource

routeur plus évolué : uirouter

## $route et ngview

	ngView // affiche le template associé à la route

	module.config(function($routeProvider){
		$routeProvider.when('/Book/:id', {
			templateUrl: 'book.html' 
				// ce template est inséré dans la directive <ng-view>, charge le template correspondant à la route courante
			,controller: 'bookctrl'   
			});
		$routeProvider.otherwise({
			redirectTo: '/Catalog'     //on peut faire des redirectTo dans les when pour des views templates par exemple
			});
		});

**!! Ne pas mettre dans book.html le controller bookctrl sinon il est exécuté 2 fois !! **

- pour récupérer les param :id, on inject $routeParams dans le controlleur

	$routeParams.id

## $location

- utilisé par $route ($route est basé dessus)
- accès à 4 data en lecture (route externe):

	$location.absUrl() // renvoit l'url complète
	protocol() // 'http'
	host()
	port()

- 4 données en ecriture (route interne)
	
	.url() : toute la route interne (après le #)
	.path() : path sans param
	.search() : {"s": "aaa"} // toute les param en JSON
	.hash()

## Liens et redirection

- si dans le template on veut faire une redirection :
	

	href="#/Book/{{book.id}}" // géré par le navigateur , d'ou la nécessité de préciser le #


- dans un controller / avec du JS

	$location.url() // ecrase search et hash

	$location.path() // n'écrase pas search et hash (pour conserver des params par exemple)

## modes de gestion des URL

3 modes possibles :

- hashbang : la route est indiqué après le # (défaut d'angular) , seul moyen de rester dans la même page sur les navigateurs non HTML5

- mode HTML5 : param?search#hash
	utilise le mécanisme d'historique de HTML5
	permet d'indexer facilement / pour les applis public sans authent
	la route interne va écraser le chemin de l'appli

	pour que ça marche : (on perd la partie path / accès depuis un bookmark avec une route interne et non celui du fichier html)
		le serveur ne connait
		=> réécriture d'URL : compliqué si plusieurs appli sur un même serveur/host
		de même pb si on a des chemins relatifs pour des images, css dans l'url...

	fallback : utilise le hashbang si ne browser ne supporte pas le mécanisme d'historique de HTML5


- configuration via $locationProvider


## initialiation avant routage

	resolve: {key1: fjdkjf, key2: function} // passer une fonction sans ()

- la fonction peut faire une opération asynchrone qui renvoit une promesse : angular va attendre que la promesse soit résolu

- c'est seulement après qu'il va initialiser le scope et charger le template


## reloadOnSearch

	reloadOnSearch	

- pas défaut à true
- utile quand on change les params de search : exemple ajouter les param de recherche dans l'URL de façon à pouvoir faire des backs avec le navigateur (fonctionnement de google sur une recherche)

- true : ne ré-écrit pas le controleur, ne recharge pas la route, le template...

	** $route.current permet de récupérer tout l'objet définis dans le routeProvider courant et ajouter des propriétés 

# Filtres


## utilisation

	ng-bind="livre in livres | uppercase" // filtre sans paramètre

	ng-bind="livre in livres | orderBy:'lastname': false" // filtre avec paramètre

- globale, utilisable de partout dans les expressions des templates


##filtres standards

- filtres du module ng

	lowercase , uppercase

	date : creationDate | date:'dd/MM/yyyy - HH:mm:ss' // par défaut : date américaine

	currency :   // possible de charger un fichier de local : i18n/angular-locale_fr-fr.js

	number : price | number:2

	Pour les tableaux : (sur un ng-repeat)

		filter : recherche full-text dans un tableau // passer un {title: 'AngularJS', desc: 'fdds'} pour une recherche spécifique

		limitTo 10 ou -10 (pour les 10 derniers)

		orderBy : trie un tableau, prend une chaine de caractère contenant l'expression Angular

		json : écrit un objet js en json (debug)

- filtres de ngSanitize

	**linky** : converti les URL et email texte en HTML (liens clickable) 

## Filtre : création

- c'est une fonction JS dont les paramètres sont positionnels : 
	
	1: entrée du filtre
	2: les param suivants sont les param du filtre
	3: la valeur de retour est la sortie du filtre

- un filtre ne doit pas modifier ce qu'il a en entrée

- on peut les créer dans un module :

	angular.module('fsdf', [])
		.filter('filterName', function(){
			return function(input, param1, param2){

			}
		})

## Dans un controleur

	function Ctrl($scope, $filter){
		$scope.upper = $filter('uppercase')('azerty'); // ou bien uppercaseFilter('azerty')		
	}

## TU d'un filtre

- Injecter avec inject() 

	beforeEach(module(function($provide){
		$provide.value('version', 'TEST_VER'); // surcharge du service "version" uniquement pour le test
	}));

	it('jklj', inject(function(interpolateFilter){

		expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after')

	}))


## Différence entre filtre et fonction du scope

### Filtre
- le filtre est global / disponible dans tous les templates de l'appli

- injectable dans un controleur


### Fonction du scope

- non isolée, disponible dans le scope où elle est publiée


# Service

- tout peut etre publié comme un service (primitif, tableau...)

- injectable

- singleton

## Injection de dépendances

- angular gère 2 listes:
	- liste des providers
	- liste des services déjà instancié

- si le service existe alors il le renvoit
- sinon il recherche me provider (nom + Provider), appel $get du provider et ajoute l'objet à la liste des services et le renvoie 

- chaque provider doit posséder une fonction $get

##Publication d'un service

- toujours sur un module

- 5 méthodes, toute renvoient le module :

	constant 	//
	value 		//
	factory 	//
	service 	// 
	provider 	// 

### Provider : le plus général / permet de tout faire

	module.provider(nom_service, object | function) 
		
	// objet provider ou bien une function appelée par angular, et son résultat est catalogué comme provider, doit travailler sur this

	elle doit définir une méthode $get

	function MyServiceProvide(){
		this.$get = function($http, $location...){
			// doit renvoyer le service 
		}

		//  si on a besoin que de la méthode $get alors inutile de créer un provider
	}

	dans module.config on ne peut passer que des provider mais pas de services

### Factory

si le provider n'a qu'une méthode $get alors la factory est suffisante

	module.factory(string, function) // function est une méthode $get

### Service

	module.service('nom', fn) // fn est un constructeur , il va y a voir un (new fn) utilisé par la méthode $get pour instancier le service 

il travail sur this, lui ajoute ce qu'il veut mais ne renvoit rien 


### value

- si le service est un objet prééexistant

	module.value('nom', service_existant)

	// plus de fn, plus de return, pas d'injection

### constant

- il est publié dans la liste des service et dans la liste des providers

- il n'a pas de $get

- ** comme il est publié, on peut y accéder dans la méthode config du module, l'injecter sans le suffixe provider ** (pas très courant)


## service $provide

- tout ces services sont sur $provide

## Pb Minification

- les params sont renommés en minification

- les solutions :

### 1
	service.factory('toto', release);

	function release(a, b)

	release.$inject = ['a', 'b']; // on lui dit les paramètres à injecter

inconvénient : pas d'inline

### 2
 
	factory('nom', ['$scope', function(scope){

		}])

### 3

- utilisation de ngmin

	- créé le tableau
	- en ligne de commande ou grunt
	- ne minifie pas

## Service $injector

### il a 2 méthodes

	$injector.get('srv_name') // renvoit le service
	$injector.invoke(fn)

	$injector.invoke(['service', function(service){}]);

### Utilité

- si on veut construire le nom du service dynamiquement
- si l'instanciation est couteuse, et que le service n'est pas utilisé systématiquement
- si dépendances circulaires entre les services
	utilisé pour retirer des dépendances afin que l'instanciation soit possible

## TU

on l'injecte 
it(... , inject(function(serviceBlabla){
	expect(serviceBlabla).equals...
}))

si le service utilise d'autres services alors lui créé des objets factices (spy de jasmine)

