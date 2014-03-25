ng-formation
============

Ensemble d'application de d�monstration d'Angular mettant en oeuvre les principales fonctions d'angular :
- services/factory
- directives
- filtres
- forms

Ainsi que des notes sur Angular dans le r�pertoire "lessons".



### Installation des applications

	clone https://github.com/bennekrouf/ng-formation.git
	npm install

Puis se placer dans les r�pertoires app-* (il n'y pas toujours tout, au minimum le serveur node)

#### D�marrer le serveur :

	node server.js

#### D�marrer Selenium

	webdriver-manager start

#### D�marrer le watcher de test :

	grunt test

#### Lancer les tests fonctionnels :
	
	grunt

===============================================================================================

## Rien � voir : Quelques r�ponses autour de Git (source : r�sum� de StackoverFlow)




#### Comment forcer un "git pull" pour qu'il �crase les changements locaux ?

	git fetch --all

	git reset --hard origin/master

explication :
- git fetch : download les derniers changements sans faire de merge ou rebase quelconque
- git reset : reset la branche master avec le r�sulat du fetch, ainsi tout changement non commit� est supprim�
- --hard : �crase les commits locaux avec le contenu de origin/master




#### Comment faire pour qu'un "git pull" importe des changements d'un repo local (non github ou bitbucket ou assembla) ?

Plusieurs m�thodes :

- par le syst�me de fichier (Joakim Elofsson): 
	
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




#### Quelle est la diff�rence entre git pull et git fetch ?

Explication basique : git pull fait un git fetch suivi d'un git merge

- Le "git fetch" met � jours la ** copie locale ** d'une branche distante et ne modifie pas le travail en cours

- Le "git pull" met � jours la ** branche locale de travail ** d'une branche distante et �crase donc les changements en cours (ou les merge)

Autre explication :

- "git pull" r�cup�re les commits distants et tente de les merger avec la copie locale de travail. Cela de mani�re automatique / sans poser de questions

- "git fetch" r�cup�re les commits distants et les stocke dans un espace local, sans tenter de les merger




#### Quelle est la diff�rence entre "git pull origin" et "git pull remote" ?

Dans "git pull origin", "origin" est le nom du remote sp�cifi� dans le fichier ~/.git/config

	[remote "origin"]
	  fetch = ...
	  url = ...

Il peut �tre utile de sp�cifier plusieurs remote : un pour github et un pour un backup local par exemple.




#### Comment comparer une branche locale et une branche distante ?

	git diff <local branch> <remote-tracking branch>

Exemple :

	git diff master origin/master

ou bien

	git diff featureA origin/next 





