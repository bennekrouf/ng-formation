
# Chapitre 2 : Angular, les bases
=============================================================

Ce chapitre traite les th�mes:

- Quelques directives fournis par Angular
- Language d'expression
- Debug d'une application Angular
- Fonctions utilitaires
- Tests Unitaire
- Tester un contr�leur
- TU : $httpBackend
- Tests Fonctionnels


## Quelques directives : 

- ng-repeat-start : depuis la 1.2 sert � it�rer en affichant plusieurs �l�m�nts dans des bloques diff�rents

- ng-submit + form sert � avoir la touche "entrer" dans la validation � la diff�rence d'un simple ng-click

- ng-model pour input ou textarea

- liste d�roulante
	- <select ng-model="color" + ng-options="c.name for c in colors"
	- dans ng-model on met la valeur cible
	 
	- sans rien pr�ciser il met tout l'objet c 
	 
	- si on veut prendre une partie de c :

	 select as label for value in array

	- minimum : 

	label **for value **in** array

	- liste d�roulante:

	<select class="form-control" ng-model="selection" 
        ng-options="critere as critere.libelle for critere in criteres"></select>

    ng-model="selection" : la valeur qui est s�lectionn� que l'on veut sauvergarder
	critere.libelle : ce que l'on veut afficher dans la liste d�roulante
	critere : objet complet        

	<option value="" > pour afficher un texte par d�faut

	ou bien pour pr�selectionner une option

	on met dans selection une des valeurs du tableau criteres

 
	- regrouper des items :

	select as label **group by** group **for** value **in** array 

- ng-show ou ng-hide (cach� dans le CSS mais pr�sent dans le DOM)

- ng-if : contrairement � ngShow conditionne la pr�sence dans le DOM et non la visibilit�
si l'�l�ment est absent son template n'est pas compil�


- ng-class="expression" : chaine de caract�res avec les noms de classes s�par�s par des espaces
ou bien : tableau de noms de classes
ou bien (le must) : objet JS avec les noms de classes comme  propri�t�s et une valeur bool�enne

- ngClassOdd � utiliser dans le ngrepeat (ajoute les classes odd uniquement sur les lignes impaires) / ngClassEven

## Language d'expression 

- les expressions ne sont pas pars�s par le JS (pas d'�val), ressemble au JS mais est pars� par Angular
- non d�bugagle

- diff�rences : 
	- pas de nullPointer sur user.firstName / ne signale pas d'erreur
	- on peut appeler des fonctions avec param�tres
	- op�rateur ternaire : 

		... ? ... : ....

	- utiliser des filtres : expression | filtre1 | filtre2
	- avec arg : expression | filtre:arg1:arg2

## Debug

- Batarang

- dans la console : pour trouver un �l�ment du scope

	angular.element(aDomElementOfAngularApp).scope()

	$0 dans la console donne l'�l�ment que la s�lectionn�
	puis $1, $2...

	angular.element($0).scope().slide

	ou simplement $scope (avec batarang, apr�s avoir s�lectionn� un �l�ment)

	$scope.book.title

## Fonctions utilitaires

- elles sont publi�s dans l'objet global Angular

angular.isDefined() : regarde si c'est �gal � undefined

angular.iNumber, isString, isDate...

angular.lowerCase, toJson, fromJson

angular.copy(source[, destination]) : si pas destination, cr�� et renvoit une copie

angular.equals(o1, o2) : fait une comparaison de contenue

angular.extend(dst, src) : copie les propri�t�s d'un objet source � dest sans ecraser

angular.element : pour wrapper un �l�ment DOM en �l�ment jQuery ou jqlite
(cr�� un objet JQUERY qui contient cette �l�ment DOM)

angular.bind(self, fn, args) : sert � cr�er une fonction  appelant self de fn avec args

angular.forEach(collection, iteratorFn[, context]) : context est la valeur de this dans cette fonction

angular.nopp : cr�� une fonction qui ne fait rien

angular.identity : fonction qui renvoit son premier argument


## Tests Unitaire

- karma port 9876 par d�fault : permet de v�rifer sur tout les navigateurs que le JS fonctionne
- permet de tester tous les navigateurs (portables...) en appelant karma sur ce port sur l'int�gration continue

- utilise un framework de test unitaire (BDD)
	exemple : Jasmine, moka


- Syntaxe jasmine

test suite :

	describe("label", function(){})

test : 
	
	it("label", function(){}); //it : en BDD correspond au d�but de la phrase en englais

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

	 expect(a).toContain('bar'); // tableau contenant un �l�ment

	 expect(e).toBeLessThan(pi); // <

	 expect(pi).toBeGreaterThan(e); // >

	 expect(fn).toThrow(); // d�clenche une exception

	 // N�gation avec .not

	 expect(fn).not.toThrow(); // ne d�clenche aucune exception


beforeEach(function(){})

### Syntaxe

- possible d'imbriquer d'autres suites de test


### angular.mock.*

	angular.mock.dump(obj) // s�rialise un objet et renvoie r�sultat

	module(function($provide){
		$provide.value('version', 'TEST_VER')
	})   // d�finie un module � la vol�e pour publier des services

	inject(function($rootScope, $controller){
		// injecte ces 2 services
	})

### Tester un contr�leur
	
	// Apr�s avoir inject� ces d�pendances
	scope = $rootScope.$new(); // cr�� un vrai objet scope angular, sinon {} marche aussi
	ctrl = $controller('nom_ctrl', {'$scope' : scope}); // ex�cute le controleur

### TU : $httpBackend

- le pb : dans les TU on ne fait pas de requ�tes HTTP

- $httpBackend poss�de 2 API : 
	when() sert juste � renvoyer en dur
	et expect() :  v�rifie les requ�tes attendues, dans l'ordre attendu et renvoi les r�ponses en dur

- les requ�tes http sont toujours asynchrone et le code peut s'ex�cuter sans avoir eu de donn�es
	=> les requetes sont mises en attente jusqu'� l'appel de :

		$httpBackend.flush() // qui renvoit tous les r�sultats, permet d'ex�cuter les callbacks des requetes

### $httpBackend : API when()

	$httpBackend.when('GET', '/api/user').respond({user...}, {'A-Token': 'xxx'})
	// $httpBackend.when('GET').respond() suffit

idem pour expect

### expect sans respond() est possible

...expectGET('/api/user') // v�rifie que la requ�te est bien faite


-A mettre dans un afterEach() pour faire syst�matiquement

 afterEach(function() {

 $httpBackend.verifyNoOutstandingExpectation();

 $httpBackend.verifyNoOutstandingRequest();

 });

- v�rifie qu'il ne reste pas d'expect non valid� (requ�te manquante)

- v�rifie qu'il ne reste pas de requ�te en attente (oubli du flush)


###

	inject(_$httpBackend,...) // les underscores seront enlev�s

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

- d�marrage avec webdriver-manager start
- protractor conf.js

- conf.js

	exports.config = {
		seleniumAddress : 'http://localhost:4444/wd/hub'
		, specs: ['chemins... fichiers'] // relatif au rep contenant le fichier de config
	}
### Pilotage

- Connexion � l'app :

	browser.get('http://localhost:...');

- expect va prendre des promise

	expect(element(by.css('h1')).getText()).toEqual('My great app'); // cherche l'�l�ment h1 par un CSS, r�cup�re le texte

### Selection d'un �l�ment

-"element" pour un seul �l�ment, si plusieurs il prend le premier, si rien exception
- apport� par webdriver
	element(by.css('.myClass')) // s�lecteur css de html5 et non jquery
	... by.className, tagName, id, xpath('//div'), linkText

- apport� par protractor
	element(by.model('user.name')) //ng-model="user.name"
	by.binding, repeater('todo in todos').row(0).column('user.name'), selectedOption, buttonText...

- element ne fait pas la s�lection tout de suite, mais uniquement lorsqu'on appel une m�thode dessus

- chaine d'�l�ment

	element(by.id('container')).element(by.model('name'));
	browser.get('myurl');
	name.sendKeys('John');
 
### sur l'�l�ment on peut:

	.click()
	.clear
	sendKeys // �crit dans input 
	getText // texte visible
	getAttribute // input
	getCssValue
	getTagName
	getSize
	getLocation // position dans la page
	isPresent // present dans le DOM
	isDisplayed // affich�
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

### Exemple pour une liste d'�l�ments

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




