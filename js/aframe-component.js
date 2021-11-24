var bombactive = false;
var nbTirs = 5;
var posBalleX = -0.25;
var test = 0;
var tirAutorise = true;

function $(v){
return document.getElementById(v);
}

/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
    init: function () {
        document.body.addEventListener('mousedown', () => {
            if(nbTirs != 0) {
                if(tirAutorise) {
                    this.el.emit('shoot');
                    $('balle'+(nbTirs-1)).remove();
                    let audio = $('sonArme');
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
  $('musique').play();
  document.removeEventListener('click', musicPlay);
} 

AFRAME.registerComponent('collision', {

    tick: function() {
      let pos = this.el.getAttribute("position");
      
      let posSphere = $('boxTp').getAttribute("position");

      if (Math.abs(pos.x-posSphere.x) < 0.7 ) {
        if(Math.abs(pos.z-posSphere.z) < 0.7) {
          this.el.setAttribute('position', { x: -2.76, y: 1.6, z:-2.1 });
          $('sonTeleportation').play();
        }
      }
    }
  });

AFRAME.registerComponent('trackball', {
    tick: function () {

        if (bombactive)
            return;

        let pos = this.el.getAttribute("position");

        let posSphere = document.querySelector('a-sphere').getAttribute("position");
        if (Math.abs(pos.x - posSphere.x) < 4) {
            if (Math.abs(pos.z - posSphere.z) < 4) {
                bombactive = true;
                $('musique').pause(); 
                $('countdown').play(); 
                $('tbombe').setAttribute("visible", "true");
                $('compteur').setAttribute("visible", "true");

                var monInter;
                function startTimer(duration, display) {
                    var timer = duration,
                        minutes, seconds;
                        monInter = setInterval(function () {
                        $('compteur').setAttribute("text", "value: " + timer + ";");
                        minutes = parseInt(timer / 60, 10)
                        seconds = parseInt(timer % 60, 10);

                        minutes = minutes < 10 ? "0" + minutes : minutes;
                        seconds = seconds < 10 ? "0" + seconds : seconds;

                        display.textContent = minutes + ":" + seconds;

                        if (!$('tinterrupteur').getAttribute('visible')) {
                            if (--timer < 0) {
                                $('countdown').pause(); 
                                $('BombeDialogue').style.display = "block";
                                document.querySelector('a-scene').exitVR();
                                clearInterval(monInter);
                                $('compteur').setAttribute("visible", "false");
                            }
                        }
                    }, 1000);
                }

                startTimer(30, $('time2'));

                $('interrupteur2').addEventListener('click', function () {
                    // stop le compteur pour éviter de continuer le calcul
                    clearInterval(monInter);
                    $('countdown').pause();
                    $('musique').play(); 
                    $('compteur').setAttribute("visible", "false");
                    $('tinterrupteur').setAttribute('visible', "true");
                });
            }
        }
    }
});

AFRAME.registerComponent('trackballfinish', {
    tick: function () {
        let pos = this.el.getAttribute("position");
        let posSphere = $('fini2').getAttribute("position");

        if (Math.abs(pos.x - posSphere.x) < 2) {
            if (Math.abs(pos.z - posSphere.z) < 2) {
                clearInterval(mainCounter);
                $('finishDialog').children[0].children[1].children[0].innerHTML = "Félicitation, vous avez terminé le labyrinthe en " + Math.round(temps) + "s";
                $('finishDialog').style.display = "block";
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
        let camera = $('camera');
        for(var i=0;i<nbTirs;i++){
          let balle = document.createElement('a-image');
          camera.appendChild(balle);
          balle.setAttribute('src', '#bullet');
          balle.setAttribute('id','balle'+i);
          balle.setAttribute('position',{x: posBalleX, y:1, z: -2});
          balle.setAttribute('scale',{x: 10, y: 10, z: 10});
          balle.setAttribute('scale',{x: 0.01, y:0.01, z: 0.01});
          balle.setAttribute('height', '14');
          balle.setAttribute('width', '3');
          posBalleX += 0.1;
        }
    }
});
