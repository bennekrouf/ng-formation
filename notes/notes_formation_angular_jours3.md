
# Jours 3 : Fonctionnement interne 
=============================================================


## Rafraichissement des vues

- dirty checking:
	- parcours une s�rie de watch : si nouvelle valeur diff�rente de l'ancienne alors ex�cute le code associ�

- la plupart des watch sont cr�es par des directives

	ng-model="user.name"  

- ou dans les controleurs

	$scope.$watch('user.name', function(newValue, oldValue))

## Liste des watchs

- plusieurs parcours complets jusqu'� stabilisation du mod�le

- plusieurs car d�clenchement de code qui impacte d'autres watch

- l'�valuation de l'expression doit �tre rapide (ind�pendament du code qui lui n'est pas ex�cut� syst�matiquement)

## ex�cution d'un traitement suite � un event

- appel de $scope.$apply(fn)

- angular ex�cute fn

- la boucle $digest c'est 
	- $evalAsync queue : task asynchrone en attente
	- liste des watches
	- la boucle $digest se finit lorsque plus aucun watch n'est modifi�

- il y a un blocage � 10 it�rations max dans la boucle digest

## Watch manuel

var removeWatch = $scope.$watch(watchExpression, listener, objectEquality)

	-watchExpression
		string ou function

	- listener
		function(new, old, scope)
		ou expression (string)

	- objectEquality
		par d�faut � false = ne surveille que la r�f�rence des objets
		true : compare en profondeur des objets et tableaux

- Cette fonction renvoie un watch que l'on peut enlever en faisant : removeWatch();
 
**Important**: on va faire un watch pour ex�cuter une op�ration couteuse, car en le mettant dans une expression pars� sur le markup on risque d'avoir un parsing trop fr�quent

## Dirty checking vs change listeners

- avantage dirty checking
	- fonctionne avec n'importe quels objet , pas besoin de setters pour d�tecter les modifs
	- un seul refresh pour tout un ensemble de modifs
	- pas d'interruption de traitement, les d�tections sont faites apr�s

- perf
	- pb si des watches sur des calculs couteux
	- 2000 watches simples supportables

## Le DOM comme template

- les templates (HTML) sont charg�s par le navigateur (et pas angular)
- quand le DOM est charg�, angular va compiler le template (ng-app) :
	- d�tection des directives
	- traitements associ�s ; watch, manip du DOM

- compilation Angular n'est ex�cut�e qu'une seule fois

- => il faut que le HTML soit valide car c'est le navigateur qui charge
- => car angular va compiler le template du DOM et non le HTML fournis en source par le d�veloppeur

## $apply

	$scope.$apply(expression) // ex�cuter un traitement d�clench� par un event externe 

� ne pas utiliser avec les services ou directives d'angular comme ng-click ou $http car le $apply y est d�j�

� l'int�rieur de la boucle $digest de refresh on ne peut pas appeler $apply

au contraire on peut inject $timeout, et appeler $timeout de la fonction JS sans pr�ciser de d�lai



## les modules (hors du fin du chapitre fonctionnement interne)

- servent � regrouper les services, controlleurs, directives, filtres

- cr�ation d'un module

	angular.module('module', [])

- le mettre dans une variable cr��e une variable globale, pour �viter cela
	- enchainer sans l'affecter � une variable
	- le mettre dans un wrapper anonyme (fn())()

## les modules standards

- ng : toujours dispo, inutile de le mettre en d�pendance
- ngResource : fichier angular-resource � inclure
- ngSanitize avec son fichier � inclure : sert � �purer du html que l'on veut ins�rer dans le template (code dangereux)
- ngTouch : event touch
- animate, cookies, mock et mockE2E

## les modules utilisateurs

- recommandation : un fichier par module en dev
- 2 choses � faire
	- charger le fichier JS pour le d�finir en le mettant en d�pendance
	- l'indiquer en d�pendance pour qu'il soit actif

## le module principale

- ce qui fait qu'il est principale est le fait de le mettre dans ng-app

- on peut faire aussi:
	angular.bootstrap(document.body, ['app']) // permet d'ex�cuter du code avant le d�marrage de l'application AngularJS
	// exemple chargement d'une librairie n�cessaire avant le chargement de l'app qui s'appuierai sur cette lib

	au lieu de : 

	<body ng-app='app'> // ne faire que l'un ou l'autre mais pas les deux


## .run et .config

- .config : 
	- on lui passe un callback qui va servir � configurer les services
	- les services ne sont pas encore cr��, on ne peut donc pas lui injecter les services mais le provider des services

	$httpProvider.defaults.headers.get['My-Header'] = 'value';

	on configure les services avant leur cr�ation

	exemple d'utilisation : config du routage

- .run
	- faire de la config applicative, apr�s la cr�ation de l'injecteur de d�pendance
	- on peut injecter des services, faire des requ�tes http ...


# Routage


## 

utile pour les SPA

routeur de base dans ng-resource

routeur plus �volu� : uirouter

## $route et ngview

	ngView // affiche le template associ� � la route

	module.config(function($routeProvider){
		$routeProvider.when('/Book/:id', {
			templateUrl: 'book.html' 
				// ce template est ins�r� dans la directive <ng-view>, charge le template correspondant � la route courante
			,controller: 'bookctrl'   
			});
		$routeProvider.otherwise({
			redirectTo: '/Catalog'     //on peut faire des redirectTo dans les when pour des views templates par exemple
			});
		});

- **!! ne pas mettre dans book.html le controller bookctrl sinon il est ex�cut� 2 fois ! **

- pour r�cup�rer les param :id, on inject $routeParams dans le controlleur

	$routeParams.id

## $location

- utilis� par $route ($route est bas� dessus)
- acc�s � 4 data en lecture (route externe):

	$location.absUrl() // renvoit l'url compl�te
	protocol() : 'http'
	host()
	port()

- 4 donn�es en ecriture (route interne)
	
	.url() : toute la route interne (apr�s le #)
	.path() : path sans param
	.search() : {"s": "aaa"} // toute les param en JSON
	.hash()

## liens et redirection

- si dans le template on veut faire une redirection :
	
	href="#/Book/{{book.id}}" // g�r� par le navigateur , d'ou la n�cessit� de pr�ciser le #

- dans un controller / avec du JS

	$location.url() // ecrase search et hash

	$location.path() // n'�crase pas search et hash (pour conserver des params par exemple)

## modes de gestion des URL

3 modes possibles :

- hashbang : la route est indiqu� apr�s le # (d�faut d'angular) , seul moyen de rester dans la m�me page sur les navigateurs non HTML5

- mode HTML5 : param?search#hash
	utilise le m�canisme d'historique de HTML5
	permet d'indexer facilement / pour les applis public sans authent
	la route interne va �craser le chemin de l'appli

	pour que �a marche : (on perd la partie path / acc�s depuis un bookmark avec une route interne et non celui du fichier html)
		le serveur ne connait
		=> r��criture d'URL : compliqu� si plusieurs appli sur un m�me serveur/host
		de m�me pb si on a des chemins relatifs pour des images, css dans l'url...

	fallback : utilise le hashbang si ne browser ne supporte pas le m�canisme d'historique de HTML5


- configuration via $locationProvider


## initialiation avant routage

	resolve: {key1: fjdkjf, key2: function} // passer une fonction sans ()

- la fonction peut faire une op�ration asynchrone qui renvoit une promesse : angular va attendre que la promesse soit r�solu

- c'est seulement apr�s qu'il va initialiser le scope et charger le template


## reloadOnSearch

	reloadOnSearch	

- pas d�faut � true
- utile quand on change les params de search : exemple ajouter les param de recherche dans l'URL de fa�on � pouvoir faire des backs avec le navigateur (fonctionnement de google sur une recherche)

- true : ne r�-�crit pas le controleur, ne recharge pas la route, le template...

	** $route.current permet de r�cup�rer tout l'objet d�finis dans le routeProvider courant et ajouter des propri�t�s 

# Filtres


## utilisation

	ng-bind="livre in livres | uppercase" // filtre sans param�tre

	ng-bind="livre in livres | orderBy:'lastname': false" // filtre avec param�tre

- globale, utilisable de partout dans les expressions des templates


##filtres standards

- filtres du module ng

	lowercase , uppercase

	date : creationDate | date:'dd/MM/yyyy - HH:mm:ss' // par d�faut : date am�ricaine

	currency :   // possible de charger un fichier de local : i18n/angular-locale_fr-fr.js

	number : price | number:2

	Pour les tableaux : (sur un ng-repeat)

		filter : recherche full-text dans un tableau // passer un {title: 'AngularJS', desc: 'fdds'} pour une recherche sp�cifique

		limitTo 10 ou -10 (pour les 10 derniers)

		orderBy : trie un tableau, prend une chaine de caract�re contenant l'expression Angular

		json : �crit un objet js en json (debug)

- filtres de ngSanitize

	**linky** : converti les URL et email texte en HTML (liens clickable) 

## Filtre : cr�ation

- c'est une fonction JS dont les param�tres sont positionnels : 
	
	1: entr�e du filtre
	2: les param suivants sont les param du filtre
	3: la valeur de retour est la sortie du filtre

- un filtre ne doit pas modifier ce qu'il a en entr�e

- on peut les cr�er dans un module :

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


## Diff�rence entre filtre et fonction du scope

### Filtre
- le filtre est global / disponible dans tous les templates de l'appli

- injectable dans un controleur


### Fonction du scope

- non isol�e, disponible dans le scope o� elle est publi�e


# Service

- tout peut etre publi� comme un service (primitif, tableau...)

- injectable

- singleton

## Injection de d�pendances

- angular g�re 2 listes:
	- liste des providers
	- liste des services d�j� instanci�

- si le service existe alors il le renvoit
- sinon il recherche me provider (nom + Provider), appel $get du provider et ajoute l'objet � la liste des services et le renvoie 

- chaque provider doit poss�der une fonction $get

##Publication d'un service

- toujours sur un module

- 5 m�thodes, toute renvoient le module :

	constant 	//
	value 		//
	factory 	//
	service 	// 
	provider 	// 

### Provider : le plus g�n�ral / permet de tout faire

	module.provider(nom_service, object | function) 
		
	// objet provider ou bien une function appel�e par angular, et son r�sultat est catalogu� comme provider, doit travailler sur this

	elle doit d�finir une m�thode $get

	function MyServiceProvide(){
		this.$get = function($http, $location...){
			// doit renvoyer le service 
		}

		//  si on a besoin que de la m�thode $get alors inutile de cr�er un provider
	}

	dans module.config on ne peut passer que des provider mais pas de services

### Factory

si le provider n'a qu'une m�thode $get alors la factory est suffisante

	module.factory(string, function) // function est une m�thode $get

### Service

	module.service('nom', fn) // fn est un constructeur , il va y a voir un (new fn) utilis� par la m�thode $get pour instancier le service 

il travail sur this, lui ajoute ce qu'il veut mais ne renvoit rien 


### value

- si le service est un objet pr��existant

	module.value('nom', service_existant)

	// plus de fn, plus de return, pas d'injection

### constant

- il est publi� dans la liste des service et dans la liste des providers

- il n'a pas de $get

- ** comme il est publi�, on peut y acc�der dans la m�thode config du module, l'injecter sans le suffixe provider ** (pas tr�s courant)


## service $provide

- tout ces services sont sur $provide

## Pb Minification

- les params sont renomm�s en minification

- les solutions :

### 1
	service.factory('toto', release);

	function release(a, b)

	release.$inject = ['a', 'b']; // on lui dit les param�tres � injecter

inconv�nient : pas d'inline

### 2
 
	factory('nom', ['$scope', function(scope){

		}])

### 3

- utilisation de ngmin

	- cr�� le tableau
	- en ligne de commande ou grunt
	- ne minifie pas

## Service $injector

### il a 2 m�thodes

	$injector.get('srv_name') // renvoit le service
	$injector.invoke(fn)

	$injector.invoke(['service', function(service){}]);

### Utilit�

- si on veut construire le nom du service dynamiquement
- si l'instanciation est couteuse, et que le service n'est pas utilis� syst�matiquement
- si d�pendances circulaires entre les services
	utilis� pour retirer des d�pendances afin que l'instanciation soit possible

## TU

on l'injecte 
it(... , inject(function(serviceBlabla){
	expect(serviceBlabla).equals...
}))

si le service utilise d'autres services alors lui cr�� des objets factices (spy de jasmine)

