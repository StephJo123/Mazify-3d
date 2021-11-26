var bombactive = false;
var vie = 20;
/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        document.body.addEventListener('mousedown', () => {
            this.el.emit('shoot');
        });
    }
});

/* Joue la musique d'ambiance */
document.addEventListener('click', musicPlay);
function musicPlay() {
    document.getElementById('musique').play();
    document.removeEventListener('click', musicPlay);
}

/* Son de l'arme quand elle tire */
AFRAME.registerComponent('audiohandler', {
    init: function () {
        let audio = document.querySelector("#sonArme");
        this.el.addEventListener('click', () => {
            audio.play();
            audio.currentTime = 0;
        });
    }
});

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

AFRAME.registerComponent('tpsalleboss', {

    tick: function () {
        document.getElementById('skull2').addEventListener('click', function (evt) {
            document.getElementById('skull2').setAttribute('animation', {
                property: 'position',
                to: '25.4 1.8 -13.417'
            });
            document.getElementById('skull2').setAttribute('link', 'href:boss.html')


        });
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

        let posSphere = document.querySelector("a-sphere").getAttribute("position");
        if (abs(pos.x - posSphere.x) < 4) {
            if (abs(pos.z - posSphere.z) < 4) {
                bombactive = true;
                document.getElementById('musique').pause();
                document.getElementById('countdown').play();
                document.getElementById("tbombe").setAttribute("visible", "true");
                document.getElementById("compteur").setAttribute("visible", "true");


                function startTimer(duration, display) {
                    var timer = duration,
                        minutes, seconds;
                    var monInter = setInterval(function () {
                        document.getElementById("compteur").setAttribute("text", "value: " + timer + ";");
                        minutes = parseInt(timer / 60, 10)
                        seconds = parseInt(timer % 60, 10);

                        minutes = minutes < 10 ? "0" + minutes : minutes;
                        seconds = seconds < 10 ? "0" + seconds : seconds;

                        display.textContent = minutes + ":" + seconds;

                        if (!document.getElementById('tinterrupteur').getAttribute('visible')) {
                            if (--timer < 0) {
                                document.getElementById("BombeDialogue").style.display = "block";
                                document.querySelector('a-scene').exitVR();
                                clearInterval(monInter);
                            }
                        }
                    }, 1000);
                }


                var fiveMinutes = 30,
                    display = document.getElementById("time2");
                startTimer(fiveMinutes, display);

                document.getElementById('interrupteur2').addEventListener('click', function () {
                    document.getElementById('countdown').pause();
                    document.getElementById('musique').play();
                    document.getElementById("compteur").setAttribute("visible", "false");
                    document.getElementById('tinterrupteur').setAttribute('visible', "true");
                });
            }
        }
    }
});

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
AFRAME.registerComponent('shoot-ennemy-boss', {
    init: function () {
        let enemy = this.el;
        setInterval(function () {
            enemy.emit('shoot');
        }, 1800);
    }
});
AFRAME.registerComponent('shoot-ennemy-rafale', {
    init: function () {
        let enemy = this.el;
        setInterval(function () {
            enemy.emit('shoot');
        }, 2500);
    }
});
AFRAME.registerComponent('hit-handler-boss', {
    dependencies: ['material'],

    init: function () {
        var rotationTmp = this.rotationTmp = this.rotationTmp || { x: 0, y: 0, z: 0 };
        var el = this.el;
        var missile = document.getElementById('missile2')
        var sphere1 = document.getElementById('sphere1');
        var sphere2 = document.getElementById('sphere2');
        var sphere3 = document.getElementById('sphere3');
        var sphere4 = document.getElementById('sphere4');
        var sphere5 = document.getElementById('sphere5');
        var sphere6 = document.getElementById('sphere6');
        var sphere7 = document.getElementById('sphere7');
        var sphere8 = document.getElementById('sphere8');
        var sphere9 = document.getElementById('sphere9');
        var sphere10 = document.getElementById('sphere10');
        var sphere11 = document.getElementById('sphere11');
        var sphere12 = document.getElementById('sphere12');

        el.addEventListener('hit', () => {
            document.getElementById('bosslife').setAttribute('geometry', {
                width: vie
            });
            if(vie<10){
                document.getElementById('bosslife').setAttribute('material','color:orange')
                missile.setAttribute('visible','true')
                missile.setAttribute('animation',{
                    property:'position',
                    to:'0 0 -1',
                    dur:3000
                });

                
            }
            if(vie<5){
                document.getElementById('bosslife').setAttribute('material','color:red')
                sphere5.setAttribute('shoot-ennemy-rafale', null)
                sphere6.setAttribute('shoot-ennemy-rafale', null)
                sphere7.setAttribute('shoot-ennemy-rafale', null)
                sphere8.setAttribute('shoot-ennemy-rafale', null)
                sphere9.setAttribute('shoot-ennemy-rafale', null)
                sphere10.setAttribute('shoot-ennemy-rafale', null)
                sphere11.setAttribute('shoot-ennemy-rafale', null)
                sphere12.setAttribute('shoot-ennemy-rafale', null)
            }
            if (vie < 0) {
                el.parentNode.remove(el);
                sphere1.parentNode.remove(sphere1);
                sphere2.parentNode.remove(sphere2);
                sphere3.parentNode.remove(sphere3);
                sphere4.parentNode.remove(sphere4);

            }
            vie = vie - 0.04
            
            
        });

        el.addEventListener('die', () => {

            var rotation = el.getAttribute('position');
            rotationTmp.x = rotation.x + 0.1;
            rotationTmp.y = rotation.y - 100000;
            rotationTmp.z = rotation.z + 0.1;
            el.setAttribute('position', rotationTmp);
        });
    }
});
AFRAME.registerComponent('monster-roar', {
    init: function () {
        setInterval(function () {
            document.getElementById('roar').play();
        }, 20000);
    }
});
