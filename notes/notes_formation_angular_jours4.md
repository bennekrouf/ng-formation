
# Jours 4 : $http & $resource
=============================================================


## $http

- fonction : avec objet de config de la requete
	$http(config)

	config objet contenant :  method (GET, POST), 
								data, 
								url, 
								headers, 
								cache (à false par défaut, sinon garde en cache si la requête est complètement identique : data + headers..)
								timeout, 
								transformRequest, 
								withCredentials (boolean : met sur l'objet XHR, permet d'envoyer les cookies des cross domain (uniquement), sinon les cookies du domaine de l'appli sont bien  toujours envoyés   )  

- renvoie une promesse : avec une méthode success et une error

	success et error renvoit this, avec 4 param
		data, status, header, config

	error est exécuté si status d'erreur ou si le serveur ne répond pas

- possède des méthodes simplifiées

	$http.get(url)
	$http.post(url, data)
	$http.put(url, data)
	...

- json : il faut qu'il soit valide rigouresement (plus que JS)


## vulnérabilité 

fait dans Angular :

### JSON

- une requete get qui renvoit un tableau de JSON, avec authent par cookie
- si un pirate redirige un user vers une page de pishing avec une balise script avec l'url get qui renvoit le tableau json, le navigateur va envoyer la requete avec ses cookies, 
- le navigateur va afficher le tableau parsé en  script sans faire d'erreur
- => il suffit de surcharger la méthode Array.push et lui faire stocker ailleurs et exploiter les données 

Solution :
- ne pas être authentifié par cookie
- ou objet premier niveau
- solution Angular : préfixer toute les requetes envoyées au serveur par : ")]}" : si Angular voit se préfixe il l'ignore, et supprime cette vulnérabilité

- (si objet alors erreur de syntaxe) 

### CSRF/XSRF (Cross Site Request Forgery)

- dans le cas ou : requete GET qui déclenche une action (delete) // très mauvais idée
- facile à exploiter : dans une page de pishing, on met une image avec cette URL : sa déclenche l'action grâce aux param du user

Solution
- pas de requete GET sur une action
- Angular : le serveur doit envoyer un cookie : XSRF-TOKEN, et angular va ajouter aux requetes un header X-XSRF-TOKEN avec la valeur du cookie, et le serveur doit vérifier la présence de ce cookie et la valeur de ce header  

##Requetes Cross Domain

2 méthodes

- Le pb : les navigateurs interdisent des requetes vers un autre domaine que le serveur qui sert (same origin policy)

### 1 - JSONP : insérer une balise script en mettant l'url de l'API comme url du script, ce qui va etre envoyé par la serveur va etre chargé comme du JS. Le serveur doit envoyer du JS.
	
	le serveur doit etre prévue pour JSONP

	il envoie un script qui appelle un callback en lui passant les données JSON

### 2 - CORS : (cross origin resource sharing) ne fonctionne pas sur tout les navigateurs (>= IE10)

- Le serveur doit répondre avec un header : Access-Control-Allow-Origin

- Rien à faire côté JS 


## Conf $http

- grâce à $httpProvider

## Transformation des requêtes et réponses

- Par défault il y a 2 transformations :

### Requete : si données envoyées non textuelles, elle est sérialisée

### Response: 

#### Enlève le préfixe ")]}',\n"
#### si réponse au format JSON alors désérialisation

### Custom

	$httpProvider.defaults.transformResponse.push(fn) // ajout d'une transformation push ou unshift...

	fn :

	data = fn(data, headers) // doit renvoyer data transformé

ou bien

	transformRequest: [fn1, fn2] // ce tableau remplace le tableau de defaults, penser à le recopier
	transformResponse: [fn1, fn2] 


ou bien : les intercepteurs de request et response (V1.2.0rc1)

- l'intercepteur est un objet

	- publié comme un service
	- peut avoir comme propriétés 4 fonctions optionnelles

	$provide.factory('myInterceptor', function(dependencies...){
		return {
		'request' : fn(config)
		... 
		}		
	})

	// pour l'enregisrer
	$httpProvider.interceptors.push('myIncerpetor')


#### Propriété 'request'

recoit l'objet config de la requete
peut renvoyer:
- promesse d'objet de config
- le même objet modifié
- un autre objet config

usage :  ** le reprendre des slides **
- pour ajouter un header ou un paramètre

#### Propriété 'responseError'

	'response' : function(response){
		return response || $q.when(response)
	}

#### 'responseError'

### Usages des intercepteurs

#### gestion centralisée des messages d'erreurs
- détecter les erreurs


#### token d'authentification à posteriori
sur une requete le serveur répond que le token a expiré
l'intercepteur response le détecte, envoie une autre requete pour récupérer un nouveau token puis relance la requete initial
l'intercepteur renvoie une nouvelle promise s'il a fallu faire une requete pour renouveller le token


#### token d'authentification à priori
intercepteur de requetes
l'intercepteur request regarde si le token est encore valide
s'il est encore valide : il met ce token dans l'objet config de la requete et le renvoie

**voir slides**

### pendingRequests et defaults : propriété du service $http

- tableau des objets de configuration des requetes en cours
- usage : mettre un gif animé




## $resource

- s'appuie sur $http
- utilisable avec serveurs REST
- renvoie des objets ou tableaux (au début c'est vide), qui sont alimentés ultérieurement
- dans angular-resource / avec le module ngResource


### $resource

factory qui renvoit un constructeur

	var User = $resource('/user', {userId: '@id'}) // U majuscule car constructeur 
				// @id : le user doit avoir une propriété id 
	var user = User.get({user: 123}, function(){
		user.abc = true;
		user.$save; // sur les instances on a les même méthodes que les 5 ci-dessous mais avec $
	});

5 opérations supportés :

	get
	save
	query
	remove
	delete 

### 

on ajouter d'autres actions 

	var CreditCard = $resource('/user/:cardId', 
			{userId: 123, cardId: '@id'}, 
				{charge : {method: 'POST', }
			} //action custom, on aura sur l'instance une méthode $charge)

		var cards = CreditCard.query(function(){

			var card = cards[0];
			card.name = "TOTO";
			card.$save(); // va déclencher un POST
			card.$charge({amount:9.99});
			// POST : /user/card/456?amount=9.99&charge=true

voir comment créér une nouvelle instance

###

- on peut ajouter des choses au constructeur renvoyé par $resource

	module.factory('Project', function($resource){ 
		// bonne pratique : 'Project' et renvoyer le constructeur Project

		var Project = $resource() 

		Project.prototype.update = function(cb){
			return Project.update({id: this._id.$oid}
			, angular.extend({}, this, {_id: undefined}), cb)
		}
		return Project	

	})


# Les promesses

## API Promise

### but:
- simplifier la gestion de l'asynchrone
- basée sur la lib Q de Kris Kowal

####une promesse réprésente un résultat différé
- opération asynchrone
- promise renvoyée immédiatement (car JS est mono-thread et ne peut pas attendre un retour de fonction)
- résolue plus tard ou déjà résolue

#### permet de manipuler de façon indiférente :
- des résultats synchrone, asynchrone déjà arrivé our asynchrone toujours en attente

### c'est un :
- objet qui a une méthode then qui permet d'enregistrer 2 fonction callback : success et error

	promise.then(function(data){

	},
	function(){

	})

- erreur si return d'une promise en erreur ou  exception JS


### Les principes

- les 2 callback sont optionnels
- on peut appeler plusieurs fois then() pour enregistrer plusieurs callback de succes ou d'erreur
- dans l'ordre d'enregistrement

- on peut appeler then sur une promesse déjà résolue :

- une promesse n'est résolue qu'une seule fois

- ** then() renvoie une nouvelle promesse **

	- cette promesse représente le résultat différé du callback appelé

### Enchainement de promise

	var promise2 = promise1.then(function(){
		return callbackresult; // la promise2 représente ce retour
	})

	promise.then(step1)
			.then(step2)
			.then(step3)
			.then(null, function(error){
				// si une erreur sur le step2 , alors on arrive là directement
		})

- le callback d'erreur est similaire au catch d'une exception


### 

la callback passé à then doit obligatoirement renvoyer une promise


### Méthodes de l'API

#### service $q pour la création

	var deferred = $q.defer() // créé un objet differed qui contient une promise et 2 méthodes : resolve et reject

	deferred.promise
	deferred.resolve(value) // pour résoudre la promise associée avec une certaine erreur
	deferred.reject(reason) // pour résoudre la promise en erreur avec une cause d'erreur
		// raccourci de deferred.resolve($q.reject(reason))

	$q.reject(reason) // crée une promise résolue en erreur- équivalent à un throw en JS

#### autres méthode sur $ q

	.when(value) 

	var startPromise =  $q.when('begin') // renvoie une promise new ou existante

	.all([tableau de promise]).then(function(tableau_de_resultats_des_promise))
	// créée une nouvelle promise lorsque toute les promesses seront résolues avec comme résultat un tableau de tous les résultats



##Promises du service $http


toute les méthodes du $http.get ou $http() renvoient une promise

success et error renvoient this (l'ancienne promise) et non une nouvelle promise comme renvoit then
ça ne peut donc pas servir à faire des enchainements

on peut alors faire

	$http().then(function(response){
			// response contient les 4 propriétés data, result...
		}, function(response){

			}) 


## Exemple complet

	var promiseStart = $q.when('start');

	 var promise1 = promiseStart.then(function (value) {

	 	// la promesse renvoyée est la promesse renvoyée par http donc automatiquement
	 	// résolue par le callback success de http

		 var url = 'http://search.twitter.com/search.json'

		 + '?q=angularjs&rpp=100&include_entities=true&result_type=mixed'

		 + '&callback=JSON_CALLBACK';

		 return $http.jsonp(url).then(function(response) {

			 var lastTweet = response.data.results[0];

			 var user = { ... };

			 return user;

	 });

	 });

	 var promise2 = promise1.then(function (user) { 
	 	// le user passé en entrée cette fonction est le user qui vient du return précédent

		 var url = 'https://api.twitter.com/1/statuses/user_timeline.json'

		 + '?screen_name='

		 + encodeURIComponent(user.screenName)

		 + '&callback=JSON_CALLBACK';

		 return $http.jsonp(url).then(function(response) {

		 var lastTweets = response.data;

		 return {user: user, lastTweets: lastTweets}; //

	 });

	 });

	 var promiseEnd = promise2.then(function (result) {

		 // Unnecessary success callback

		 return result;

		 }, function (reason) { // Error in any request

		 return $q.reject(reason); // inutile, c'est comme si on laissait passer

	 });

	 return promiseEnd;

### Notifications (1.2.0rc1)

On peut être notifié de l'avancement :


	promise.then(successCallback, errorBack, notifyCallback)

	// exemple

	var deffered = $q.defer()
	deferred.notify('50% done')


# (Chapitre 12) Formulaires

###  Désactivation de la validation du navigateur

	<form novalidate> // à mettre pour éviter que le navigateur fasse la validation à la place d'Angular

### publier le formulaire (objet FormaController) dans le scope

il suffit de lui mettre un attribut "name"

	<form name="userForm" novalidate>

## Propriétés

### sur un formulaire

	$pristine : état non modifié, passe en $dirty à la moindre modif
	$valid/$invalid 
	$error : tableau des erreurs de validation par type de validateur 
		$error.required : renvoit tout les ngModelController des champs qui sont en erreur 

### sur un champ de saisie

	$pristine
	...
	$error : tableau associatif des erreurs de validation (clef d'erreur, true si en erreur)

	$viewValue : valeur visible
	$modelValue : valeur du modèle

	$parsers : function qui prend la $viewValue et la transforme en $modelValue
	$formatters : function qui fait l'inverse $modelValue en $viewValue

### Méthodes du form controller

	$setPristine : remet le formulaire dans un état $pristine, sans toucher aux données
		utile après une sauvegarde
		méthode ajoutée en 1.1.1


### exemple

	<form name="toto" novalidate
		<div ng-show='toto.mail.$dirty' && 'toto.mail.$invalid'> //
			invalid
				<span ng-show='toto.mail.$error.required'> tell us your mail

			<button ng-click...
				ng-disabled='form.$invalid' // button disable si formulaire invalide

## Sous formulaires

- HTML : interdire d'imbriquer des formulaires
- avec angular : ngForm

	<ng-form name='subformName'>...
	ou <div ng-form...

- le sous-formulaire est publié comme
	une propriété subFormName du scope
	une propriété subFormName du formulaire / sous-formulaire parent

- indispensable : si on veut accéder aux controleurs des champs de saisie, dans le cas ou on a un repeat dans un formulaire
	exemple : permettre de se référer à une portion de formulaire répétée:
	mettre un ngForm à l'intérieur du ngRepeat

** Attention : dans les 'name' et les types ne pas mettre d'expression angular

## Classes CSS

Angular positionne des classes sur le formulaire et sur les champs

- `ng-valid`
- `ng-invalid`
- `ng-pristine`
- `ng-dirty`

Afficher un message d'erreur sur un texte trop court :
	<form name="form"
		<input name="searchTitle"
			<span ng-show="form.searchTitle.$error.minlength" >trop court

## Champs input text & textarea

	<input type="text"

### Attributs principaux

-	ng-model
-	"name="string" : pour la ref au formulaire
-	ng-change : déconseillé car le watch fonctionne mieux

### Attributs pour la validation

[required]
[ng-required="exp"] // requis en fonction d'autres choses
ng-minlength="number" // nbr entier


	
