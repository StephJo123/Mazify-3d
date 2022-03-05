# Mazify-3d

<img src="/assets/images/logo_UCA.jpg" alt="Réalisé par des étudiants de l'IUT d'aubière" align="right" width="150" height="150">

Games in 3D mazes, and one using a random maze using A-Frame and Vue.js

Games are in french

### Installation

Install [PHP binary](https://windows.php.net/downloads/releases/php-7.4.28-nts-Win32-vc15-x64.zip) to have the possibilities to create a server

Si les serveurs de PHP sont down, prenez [Symfony](https://github.com/symfony-cli/symfony-cli/releases/download/v5.4.1/symfony-cli_windows_amd64.zip).
Déplacez l'exécutable dans le dossier du projet, puis lancer dans un terminal windows les instructions suivantes (en étant dans le projet où il y a l'éxécutable):

    symfony server:start

### Local Development

Go in the good directory where the project are, and run php executable

    php -S localhost:8080

Then launch the site in the browser:

index (or level 0) : [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

level 1 (question level) : [http://127.0.0.1:8080/niveau1.html](http://127.0.0.1:8080/niveau1.html)

level 2 (bunny search in pre-make maze) : [http://127.0.0.1:8080/niveau2.html](http://127.0.0.1:8080/niveau2.html)

bunny search in random maze : [http://127.0.0.1:8000/rand.html](http://127.0.0.1:8000/rand.html)

### Maze Editor

To open map editor, follow the link

[http://127.0.0.1:8080/editor.html](http://127.0.0.1:8080/editor.html)

### Links
[A-Frame](https://aframe.io/)
[Vue.js](https://vuejs.org/)

### Authors
 * Stéphane Joseph
 * Gabriel Theuws
 * (pseudo) Pleexy
 * (pseudo) thomas-26

A huge thanks to the work of palashbhowmick for [Mazify](https://github.com/palashbhowmick/mazify-3d)
