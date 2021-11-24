var bombactive = false;
var nbTirs = 5;
var posBalleX = -0.25;
var test = 0;
var tirAutorise = true;

/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        document.body.addEventListener('mousedown', () => {
            if (nbTirs != 0) {
                if (tirAutorise == true) {
                    this.el.emit('shoot');
                    console.log(nbTirs - 1);
                    document.getElementById("balle" + (nbTirs - 1)).remove();
                    let audio = document.querySelector("#sonArme");
                    audio.play();
                    audio.currentTime = 0;
                    nbTirs -= 1;
                    tirAutorise = false;
                } else {
                    tirAutorise = true;
                }
            }
        });
    }
});

/* Joue la musique d'ambiance */
document.addEventListener('click', musicPlay);
function musicPlay() {
    document.getElementById('musique').play();
    document.removeEventListener('click', musicPlay);
}

AFRAME.registerComponent('collision', {

    tick: function () {
        function abs(val) {
            return (val < 0) ? -val : val;
        }
        let pos = this.el.getAttribute("position");

        let posSphere = document.getElementById("boxTp").getAttribute("position");

        if (abs(pos.x - posSphere.x) < 0.7) {
            if (abs(pos.z - posSphere.z) < 0.7) {
                this.el.setAttribute('position', { x: -2.76, y: 1.6, z: -2.1 });
                let audio = document.querySelector("#sonTeleportation").play();
            }
        }
    }
});

AFRAME.registerComponent('trackball', {
    tick: function () {

        if (bombactive)
            return;

        function abs(val) {
            return (val < 0) ? -val : val;
        }
        let pos = this.el.getAttribute("position");

        let posSphere = document.getElementById('bombe').getAttribute("position");
        if (abs(pos.x - posSphere.x) < 4) {
            if (abs(pos.z - posSphere.z) < 4) {
                bombactive = true;
                document.getElementById('musique').pause();
                document.getElementById('countdown').play();
                document.getElementById("tbombe").setAttribute("visible", "true");
                document.getElementById("compteur").setAttribute("visible", "true");

                var monInter;
                function startTimer(duration, display) {
                    var timer = duration,
                        minutes, seconds;
                    monInter = setInterval(function () {
                        document.getElementById("compteur").setAttribute("text", "value: " + timer + ";");
                        minutes = parseInt(timer / 60, 10)
                        seconds = parseInt(timer % 60, 10);

                        minutes = minutes < 10 ? "0" + minutes : minutes;
                        seconds = seconds < 10 ? "0" + seconds : seconds;

                        display.textContent = minutes + ":" + seconds;

                        if (!document.getElementById('tinterrupteur').getAttribute('visible')) {
                            if (--timer < 0) {
                                // stop le compteur pour éviter de continuer le calcul
                                clearInterval(monInter);

                                document.getElementById('countdown').pause();
                                document.getElementById("BombeDialogue").style.display = "block";
                                document.querySelector('a-scene').exitVR();
                            }
                        }
                    }, 1000);
                }


                var fiveMinutes = 30,
                    display = document.getElementById("time2");
                startTimer(fiveMinutes, display);

                document.getElementById('interrupteur2').addEventListener('click', function () {
                    clearInterval(monInter);
                    document.getElementById('countdown').pause();
                    document.getElementById('musique').play();
                    document.getElementById("compteur").setAttribute("visible", "false");
                    document.getElementById('tinterrupteur').setAttribute('visible', "true");
                });
            }
        }
    }
});

// fonction pour les lootboxes
AFRAME.registerComponent('openlootbox', {
    init: function () {
        const lootbox1 = document.getElementById('lootbox1');
        const lootbox2 = document.getElementById('lootbox2');

        // si une lootbox est touchée, on l'ouvre, puis la supprime...
        document.addEventListener('click', event => {
            if (event.target !== lootbox1 && event.target !== lootbox2) {
                return;
            }
            event.target.setAttribute('animation-mixer', 'timeScale: 1;');
            event.target.setAttribute('animation-mixer', { clip: "*", loop: "repeat", repetitions: 1 });
            delay(function () {
                event.target.remove();
            }, 800);
        });
    }
});
// fonction qui ajoute un délai avant la disparition de la lootbox
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

AFRAME.registerComponent('trackballfinish', {
    tick: function () {
        function abs(val) {
            return (val < 0) ? -val : val;
        }
        let pos = this.el.getAttribute("position");
        let posSphere = document.getElementById("fini2").getAttribute("position");

        if (abs(pos.x - posSphere.x) < 2) {
            if (abs(pos.z - posSphere.z) < 2) {
                clearInterval(mainCounter);
                document.getElementById('finishDialog').childNodes[3].childNodes[3].childNodes[1].innerHTML = "Félicitation, vous avez terminé le labyrinthe en " + Math.round(temps) + "s";
                document.getElementById("finishDialog").style.display = "block";
                document.querySelector('a-scene').exitVR();
            }
        }
    }
});

AFRAME.registerComponent('hit-handler', {
    dependencies: ['material'],

    init: function () {
        var positionTmp = this.positionTmp = this.positionTmp || {
            x: 0,
            y: 0,
            z: 0
        };
        var el = this.el;

        el.addEventListener('hit', () => {

        });

        el.addEventListener('die', () => {

            var position = el.getAttribute('position');
            positionTmp.x = position.x + 0.1;
            positionTmp.y = position.y - 100000;
            positionTmp.z = position.z + 0.1;
            el.setAttribute('position', positionTmp);
        });
    }
});
AFRAME.registerComponent('shoot-ennemy', {
    init: function () {
        let enemy = this.el;
        setInterval(function () {
            enemy.emit('shoot');
        }, 1000);
    }
});

AFRAME.registerComponent('munitions', {
    init: function () {
        let camera = document.getElementById('camera');
        for (var i = 0; i < nbTirs; i++) {
            let balle = document.createElement('a-image');
            camera.appendChild(balle);
            balle.setAttribute('src', '#bullet');
            balle.setAttribute('id', 'balle' + i);
            balle.setAttribute('position', { x: posBalleX, y: 1, z: -2 });
            balle.setAttribute('scale', { x: 10, y: 10, z: 10 });
            balle.setAttribute('scale', { x: 0.01, y: 0.01, z: 0.01 });
            balle.setAttribute('height', '14');
            balle.setAttribute('width', '3');
            posBalleX = posBalleX + 0.1;
        }
    }
});