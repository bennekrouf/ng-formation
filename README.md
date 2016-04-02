ng-formation
============

Ensemble d'application de démonstration d'Angular mettant en oeuvre les principales fonctions d'angular :
- services/factory
- directives
- filtres
- forms

Ainsi que des notes sur Angular dans le répertoire "lessons".



### Installation des applications

	clone https://github.com/bennekrouf/ng-formation.git
	npm install

Puis se placer dans les répertoires app-* (il n'y pas toujours tout, au minimum le serveur node)

#### Démarrer le serveur :

	node server.js

#### Démarrer Selenium

	webdriver-manager start

#### Démarrer le watcher de test :

	grunt test

#### Lancer les tests fonctionnels :
	
	grunt

===============================================================================================

## Rien à voir : Quelques réponses autour de Git (source : StackoverFlow)


#### Comment forcer un "git pull" pour qu'il écrase les changements locaux ?

	git fetch --all

	git reset --hard origin/master

explication :
- git fetch : download les derniers changements sans faire de merge ou rebase quelconque
- git reset : reset la branche master avec le résulat du fetch, ainsi tout changement non commité est supprimé
- --hard : écrase les commits locaux avec le contenu de origin/master




#### Comment faire pour qu'un "git pull" importe des changements d'un repo local (non github ou bitbucket ou assembla) ?

Plusieurs méthodes :

- par le système de fichier (Joakim Elofsson): 
	
	git clone /path/to/repo 

	ou bien  

	git clone file://path/to/repo

- par le protocole HTTP :

	git clone http://example.com/repo

Requiert un serveur HTTP. 

- par SSH :

	git clone ssh://example.com/srv/git/repo

Requiert un serveur SSH (ou un daemon SSH), et un client SSH (putty ou git bash ou commandes dos...)

- par le protocol git :

	git clone git://example.com/repo

Le serveur doit avoir un process : git-daemon




#### Quelle est la différence entre git pull et git fetch ?

Explication basique : git pull fait un git fetch suivi d'un git merge

- Le "git fetch" met à jours la ** copie locale ** d'une branche distante et ne modifie pas le travail en cours

- Le "git pull" met à jours la ** branche locale de travail ** d'une branche distante et écrase donc les changements en cours (ou les merge)

Autre explication :

- "git pull" récupère les commits distants et tente de les merger avec la copie locale de travail. Cela de manière automatique / sans poser de questions

- "git fetch" récupère les commits distants et les stocke dans un espace local, sans tenter de les merger




#### Quelle est la différence entre "git pull origin" et "git pull remote" ?

Dans "git pull origin", "origin" est le nom du remote spécifié dans le fichier ~/.git/config

	[remote "origin"]
	  fetch = ...
	  url = ...

Il peut être utile de spécifier plusieurs remote : un pour github et un pour un backup local par exemple.




#### Comment comparer une branche locale et une branche distante ?

	git diff <local branch> <remote-tracking branch>

Exemple :

	git diff master origin/master

ou bien

	git diff featureA origin/next 



## Encore rien à voir
Comment éviter d'avoir à faire sudo npm install sous MAC :

	sudo chown -R $USER /usr/local/bin
	sudo chown -R $USER /usr/local/lib/node_modules

