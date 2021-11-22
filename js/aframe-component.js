var bombactive = false;
/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
    init: function() {
        document.body.addEventListener('mousedown', () => {
            this.el.emit('shoot');
        });
    }
});

/* Son de l'arme quand elle tire */
AFRAME.registerComponent('audiohandler', {
    init: function() {
        let audio = document.querySelector("#sonArme");
        this.el.addEventListener('click', () => {
            audio.play();
            audio.currentTime = 0;
        });
    }
});

AFRAME.registerComponent('fin', {
    init: function() {
        this.el.addEventListener('click', function(evt) {
            document.getElementById("finishDialog").style.display = "block";
        });
    }
});

AFRAME.registerComponent('change-color-on-click', {
    init: function() {
        this.el.addEventListener('click', function(evt) {
            document.getElementById("finishDialog").style.display = "block";
            document.querySelector('a-scene').exitVR();
        });
    }
});

AFRAME.registerComponent('hit-test', {
    dependencies: ['material'],
    init: function() {
        var el = this.el;
        el.addEventListener('hit', () => {
            document.getElementById("finishDialog").style.display = "block";
        });
        el.addEventListener('die', () => {
            document.getElementById("finishDialog").style.display = "block";
        });
    }
});

AFRAME.registerComponent('trackball', {
    tick: function() {

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
                    var monInter = setInterval(function() {
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

                            }
                        }
                    }, 1000);

                    setTimeout(function() {
                        clearInterval(monInter);
                    }, 31000);

                }


                var fiveMinutes = 30,
                    display = document.getElementById("time2");
                startTimer(fiveMinutes, display);

                document.getElementById('interrupteur2').addEventListener('click', function(evt) {
                    document.getElementById("compteur").setAttribute("visible", "false");
                    document.getElementById('tinterrupteur').setAttribute('visible', "true");

                });
            }
        }
    }
});

AFRAME.registerComponent('enemyfollow', {
    tick: function() {
        let posCamera = this.el.getAttribute("position");

    }
});

AFRAME.registerComponent('trackballfinish', {
    tick: function() {
        function abs(val) {
            return (val < 0) ? -val : val;
        }
        let pos = this.el.getAttribute("position");

        let posSphere = document.getElementById("fini2").getAttribute("position");

        if (abs(pos.x - posSphere.x) < 2) {
            if (abs(pos.z - posSphere.z) < 2) {
                document.getElementById("finishDialog").style.display = "block";
                document.querySelector('a-scene').exitVR();

            }
        }
    }
});
AFRAME.registerComponent('hit-handler', {
    dependencies: ['material'],

    init: function() {
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
    init: function() {
        let enemy = this.el;
        setInterval(function() {
            enemy.emit('shoot');
        }, 1000);
    }
});

AFRAME.registerComponent('emit-when-colliding', {
        schema: {
          target: {type: 'selector', default: '#player'},
          distance: {type: 'number', default: 1},
          event: {type: 'string', default: 'collided'}
        },
        init: function () {                  
          this.tick = AFRAME.utils.throttleTick(this.checkDist, 200, this);
          this.emiting = false;          
        },
        checkDist: function () {          
          let myPos = new THREE.Vector3( 0, 0, 0 );
          let targetPos = new THREE.Vector3( 0, 0, 0 );
          this.el.object3D.getWorldPosition(myPos);
          this.data.target.object3D.getWorldPosition(targetPos);
          let distanceTo = myPos.distanceTo(targetPos);          
          if (distanceTo < this.data.distance && !this.emiting) {      
            this.emiting = true;            
            this.el.emit(this.data.event, {collidingEntity: this.data.target}, false);
            this.data.target.emit(this.data.event, {collidingEntity: this.el}, false);
          } else {
            this.emiting = false;
          }
        }
});
