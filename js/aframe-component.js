var bombactive = false;
var vie = 20;
var nbTirs = 5;
var posBalleX = -0.25;
var test = 0;
var tirAutorise = true;
var tpAutorise = false;

/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        document.body.addEventListener('mousedown', () => {
            if (nbTirs != 0) {
                if (tirAutorise) {
                    this.el.emit('shoot');
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


AFRAME.registerComponent('collision_piege', {

    tick: function () {
        function abs(val) {
            return (val < 0) ? -val : val;
        }
        let pos = this.el.getAttribute("position");

        let posSphere = document.getElementById("piege_1").getAttribute("position");

        if (abs(pos.x - posSphere.x) < 0.7) {
            if (abs(pos.z - posSphere.z) < 0.7) {
                document.getElementById("trapDialog").style.display = "block";
                let audio = document.querySelector("#sonTeleportation").play();
                console.log("ok");
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

        let pos = this.el.getAttribute("position");

        let posSphere = document.querySelector("a-sphere").getAttribute("position");
        if (Math.abs(pos.x - posSphere.x) < 4) {
            if (Math.abs(pos.z - posSphere.z) < 4) {
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
                                document.getElementById('countdown').pause();
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
                    // stop le compteur pour éviter de continuer le calcul
                    clearInterval(monInter);
                    document.getElementById('countdown').pause();
                    document.getElementById('musique').play();
                    document.getElementById("compteur").setAttribute("visible", "false");
                    document.getElementById('tinterrupteur').setAttribute('visible', "true");
                    document.getElementById('tbombe').setAttribute('visible', "true");
                    tpAutorise = true;
                });
            }
        }
    }
});

AFRAME.registerComponent('trackballfinish', {
    tick: function () {
        let pos = this.el.getAttribute("position");
        let posSphere = document.getElementById("fini2").getAttribute("position");

        if (Math.abs(pos.x - posSphere.x) < 2) {
            if (Math.abs(pos.z - posSphere.z) < 2) {
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
            if (vie < 10) {
                document.getElementById('bosslife').setAttribute('material', 'color:orange')
                missile.setAttribute('visible', 'true')
                missile.setAttribute('animation', {
                    property: 'position',
                    to: '0 0 -1',
                    dur: 3000
                });


            }
            if (vie < 5) {
                document.getElementById('bosslife').setAttribute('material', 'color:red')
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

AFRAME.registerComponent('delais', {
    init: function () {
        setTimeout(() => {
            let blade1 = document.getElementById('blade1');
            blade1.setAttribute('animation-mixer', '');
            let blade3 = document.getElementById('blade3');
            blade3.setAttribute('animation-mixer', '');

        }, 15000);
        setTimeout(() => {
            let piege1 = document.getElementById('piege_1');
            piege.setAttribute('animation', {
                property: 'position',
                to: '-1.8 0.92838 -14.44684',
                loop: true,
                dur: '827,3',
                dir: 'alternate'
            });
            let piege3 = document.getElementById('piege_3');
            piege3.setAttribute('animation', {
                property: 'position',
                to: '-1.8 0.92838 -14.44684',
                loop: true,
                dur: '827,3',
                dir: 'alternate'
            });
        }, 14900);

        setTimeout(() => {
            let blade = document.getElementById('blade');
            blade.setAttribute('animation-mixer', '');
            let blade2 = document.getElementById('blade2');
            blade2.setAttribute('animation-mixer', '');
        }, 14500);

        setTimeout(() => {
            let piege = document.getElementById('piege_0');
            piege.setAttribute('animation', {
                property: 'position',
                to: '-1.8 0.92838 -14.44684',
                loop: true,
                dur: '827,3',
                dir: 'alternate'
            });
            let piege2 = document.getElementById('piege_2');
            piege2.setAttribute('animation', {
                property: 'position',
                to: '-1.8 0.92838 -14.44684',
                loop: true,
                dur: '827,3',
                dir: 'alternate'
            });
        }, 14400);
    }
});
