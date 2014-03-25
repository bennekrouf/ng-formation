
# Chapitre 2 : Angular, les bases
=============================================================

Ce chapitre traite les thèmes:

- Quelques directives fournis par Angular
- Language d'expression
- Debug d'une application Angular
- Fonctions utilitaires
- Tests Unitaire
- Tester un contrôleur
- TU : $httpBackend
- Tests Fonctionnels


## Quelques directives : 

- ng-repeat-start : depuis la 1.2 sert à itérer en affichant plusieurs éléménts dans des bloques différents

- ng-submit + form sert à avoir la touche "entrer" dans la validation à la différence d'un simple ng-click

- ng-model pour input ou textarea

- liste déroulante
	- <select ng-model="color" + ng-options="c.name for c in colors"
	- dans ng-model on met la valeur cible
	 
	- sans rien préciser il met tout l'objet c 
	 
	- si on veut prendre une partie de c :

	 select as label for value in array

	- minimum : 

	label **for value **in** array

	- liste déroulante:

	<select class="form-control" ng-model="selection" 
        ng-options="critere as critere.libelle for critere in criteres"></select>

    ng-model="selection" : la valeur qui est sélectionné que l'on veut sauvergarder
	critere.libelle : ce que l'on veut afficher dans la liste déroulante
	critere : objet complet        

	<option value="" > pour afficher un texte par défaut

	ou bien pour préselectionner une option

	on met dans selection une des valeurs du tableau criteres

 
	- regrouper des items :

	select as label **group by** group **for** value **in** array 

- ng-show ou ng-hide (caché dans le CSS mais présent dans le DOM)

- ng-if : contrairement à ngShow conditionne la présence dans le DOM et non la visibilité
si l'élément est absent son template n'est pas compilé


- ng-class="expression" : chaine de caractères avec les noms de classes séparés par des espaces
ou bien : tableau de noms de classes
ou bien (le must) : objet JS avec les noms de classes comme  propriétés et une valeur booléenne

- ngClassOdd à utiliser dans le ngrepeat (ajoute les classes odd uniquement sur les lignes impaires) / ngClassEven

## Language d'expression 

- les expressions ne sont pas parsés par le JS (pas d'éval), ressemble au JS mais est parsé par Angular
- non débugagle

- différences : 
	- pas de nullPointer sur user.firstName / ne signale pas d'erreur
	- on peut appeler des fonctions avec paramètres
	- opérateur ternaire : 

		... ? ... : ....

	- utiliser des filtres : expression | filtre1 | filtre2
	- avec arg : expression | filtre:arg1:arg2

## Debug

- Batarang

- dans la console : pour trouver un élément du scope

	angular.element(aDomElementOfAngularApp).scope()

	$0 dans la console donne l'élément que la sélectionné
	puis $1, $2...

	angular.element($0).scope().slide

	ou simplement $scope (avec batarang, après avoir sélectionné un élément)

	$scope.book.title

## Fonctions utilitaires

- elles sont publiés dans l'objet global Angular

angular.isDefined() : regarde si c'est égal à undefined

angular.iNumber, isString, isDate...

angular.lowerCase, toJson, fromJson

angular.copy(source[, destination]) : si pas destination, créé et renvoit une copie

angular.equals(o1, o2) : fait une comparaison de contenue

angular.extend(dst, src) : copie les propriétés d'un objet source à dest sans ecraser

angular.element : pour wrapper un élément DOM en élément jQuery ou jqlite
(créé un objet JQUERY qui contient cette élément DOM)

angular.bind(self, fn, args) : sert à créer une fonction  appelant self de fn avec args

angular.forEach(collection, iteratorFn[, context]) : context est la valeur de this dans cette fonction

angular.nopp : créé une fonction qui ne fait rien

angular.identity : fonction qui renvoit son premier argument


## Tests Unitaire

- karma port 9876 par défault : permet de vérifer sur tout les navigateurs que le JS fonctionne
- permet de tester tous les navigateurs (portables...) en appelant karma sur ce port sur l'intégration continue

- utilise un framework de test unitaire (BDD)
	exemple : Jasmine, moka


- Syntaxe jasmine

test suite :

	describe("label", function(){})

test : 
	
	it("label", function(){}); //it : en BDD correspond au début de la phrase en englais

doit renvoyer ou faire un 

	expect(true).toBe(true);

	expect(a).toBe(b); // ===

	 expect(a).toEqual(12); // compare valeurs et objets

	 expect(message).toMatch(/bar/); // regex

	 expect(a.foo).toBeDefined(); // != undefined

	 expect(a.bar).toBeUndefined(); // undefined

	 expect(a).toBeNull(); // null

	 expect(foo).toBeTruthy(); // true

	 expect(a).toBeFalsy(); // false, null, undefined, not a number, chaine vide

	 expect(a).toContain('bar'); // tableau contenant un élément

	 expect(e).toBeLessThan(pi); // <

	 expect(pi).toBeGreaterThan(e); // >

	 expect(fn).toThrow(); // déclenche une exception

	 // Négation avec .not

	 expect(fn).not.toThrow(); // ne déclenche aucune exception


beforeEach(function(){})

### Syntaxe

- possible d'imbriquer d'autres suites de test


### angular.mock.*

	angular.mock.dump(obj) // sérialise un objet et renvoie résultat

	module(function($provide){
		$provide.value('version', 'TEST_VER')
	})   // définie un module à la volée pour publier des services

	inject(function($rootScope, $controller){
		// injecte ces 2 services
	})

### Tester un contrôleur
	
	// Après avoir injecté ces dépendances
	scope = $rootScope.$new(); // créé un vrai objet scope angular, sinon {} marche aussi
	ctrl = $controller('nom_ctrl', {'$scope' : scope}); // exécute le controleur

### TU : $httpBackend

- le pb : dans les TU on ne fait pas de requêtes HTTP

- $httpBackend possède 2 API : 
	when() sert juste à renvoyer en dur
	et expect() :  vérifie les requêtes attendues, dans l'ordre attendu et renvoi les réponses en dur

- les requêtes http sont toujours asynchrone et le code peut s'exécuter sans avoir eu de données
	=> les requetes sont mises en attente jusqu'à l'appel de :

		$httpBackend.flush() // qui renvoit tous les résultats, permet d'exécuter les callbacks des requetes

### $httpBackend : API when()

	$httpBackend.when('GET', '/api/user').respond({user...}, {'A-Token': 'xxx'})
	// $httpBackend.when('GET').respond() suffit

idem pour expect

### expect sans respond() est possible

...expectGET('/api/user') // vérifie que la requête est bien faite


-A mettre dans un afterEach() pour faire systématiquement

 afterEach(function() {

 $httpBackend.verifyNoOutstandingExpectation();

 $httpBackend.verifyNoOutstandingRequest();

 });

- vérifie qu'il ne reste pas d'expect non validé (requête manquante)

- vérifie qu'il ne reste pas de requête en attente (oubli du flush)


###

	inject(_$httpBackend,...) // les underscores seront enlevés

	ou bien

	inject(function($injector))
		$injector.get($httpBackend)





## Tests Fonctionnels

- en cours de changement de E2E scenario runner => Protractor

### Protractor

- s'appuie sur Selenium WebdriverJS
-  jasmine ou Mocha
- se lance sans karma

### Conf

- démarrage avec webdriver-manager start
- protractor conf.js

- conf.js

	exports.config = {
		seleniumAddress : 'http://localhost:4444/wd/hub'
		, specs: ['chemins... fichiers'] // relatif au rep contenant le fichier de config
	}
### Pilotage

- Connexion à l'app :

	browser.get('http://localhost:...');

- expect va prendre des promise

	expect(element(by.css('h1')).getText()).toEqual('My great app'); // cherche l'élément h1 par un CSS, récupère le texte

### Selection d'un élément

-"element" pour un seul élément, si plusieurs il prend le premier, si rien exception
- apporté par webdriver
	element(by.css('.myClass')) // sélecteur css de html5 et non jquery
	... by.className, tagName, id, xpath('//div'), linkText

- apporté par protractor
	element(by.model('user.name')) //ng-model="user.name"
	by.binding, repeater('todo in todos').row(0).column('user.name'), selectedOption, buttonText...

- element ne fait pas la sélection tout de suite, mais uniquement lorsqu'on appel une méthode dessus

- chaine d'élément

	element(by.id('container')).element(by.model('name'));
	browser.get('myurl');
	name.sendKeys('John');
 
### sur l'élément on peut:

	.click()
	.clear
	sendKeys // écrit dans input 
	getText // texte visible
	getAttribute // input
	getCssValue
	getTagName
	getSize
	getLocation // position dans la page
	isPresent // present dans le DOM
	isDisplayed // affiché
	isSelected
	isEnabled


### Selection d'une liste

	element.all(by.css('.myClass')).each(fn)

	element.all(by.css('.myClass')).map(function(elem, index){
		return {
			index: index,
			text: elm.getText(),
			class: elm.getAttribute

		}
	}

### Exemple pour une liste d'éléments

	it('should return a group of elements for a column'

	 var nameColumn = element.all(by.repeater('bloop in days').column('name'));

	 nameColumn.then(function(arr) {

	 expect(arr.length).toEqual(5);

	 expect(arr[0].getText()).toEqual('Monday');

	 expect(arr[1].getText()).toEqual('Tuesday');

	 });

	});

###

passthrough :

	$httpBackend.whenGET(/^\/templates\//).passThrough();




