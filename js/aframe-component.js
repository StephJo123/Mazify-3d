var bombactive = false;
/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        document.body.addEventListener('mousedown', () => {
            this.el.emit('shoot');
        });
    }
});

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

    tick: function() {
      function abs(val) {
        return (val < 0) ? -val : val;
      }
      let pos = this.el.getAttribute("position");
      
      let posSphere = document.getElementById("boxTp").getAttribute("position");

      if (abs(pos.x-posSphere.x) < 0.7 ) {
        if(abs(pos.z-posSphere.z) < 0.7) {
          this.el.setAttribute('position', { x: -2.76, y: 1.6, z:-2.1 });
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

        let posSphere = document.querySelector("a-sphere").getAttribute("position");
        if (abs(pos.x - posSphere.x) < 4) {
            if (abs(pos.z - posSphere.z) < 4) {
                bombactive = true;
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
            document.getElementById("finishDialog").style.display = "block";
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

AFRAME.registerComponent('emit-when-colliding', {
    schema: {
        target: { type: 'selector', default: '#player' },
        distance: { type: 'number', default: 1 },
        event: { type: 'string', default: 'collided' }
    },
    init: function () {
        this.tick = AFRAME.utils.throttleTick(this.checkDist, 200, this);
        this.emiting = false;
    },
    checkDist: function () {
        let myPos = new THREE.Vector3(0, 0, 0);
        let targetPos = new THREE.Vector3(0, 0, 0);
        this.el.object3D.getWorldPosition(myPos);
        this.data.target.object3D.getWorldPosition(targetPos);
        let distanceTo = myPos.distanceTo(targetPos);
        if (distanceTo < this.data.distance && !this.emiting) {
            this.emiting = true;
            this.el.emit(this.data.event, { collidingEntity: this.data.target }, false);
            this.data.target.emit(this.data.event, { collidingEntity: this.el }, false);
        } else {
            this.emiting = false;
        }
    }
});
