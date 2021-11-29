var bombactive = false;
var nbTirs = 0;
var tirAutorise = true;
var monInter;
var removeText, removeBox;
var tirAutorise = true;
var tpAutorise = false;
var vie = 20;

function $(v) {
  return document.getElementById(v);
}

/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
  init: function () {
    document.body.addEventListener('mousedown', () => {
      if (nbTirs != 0) {
        if (tirAutorise) {
          tirAutorise = false;
          this.el.emit('shoot');
          $('balle' + (nbTirs - 1)).remove();
          let audio = $('sonArme');
          audio.play();
          audio.currentTime = 0;
          nbTirs -= 1;
        }
      }
    });
    document.body.addEventListener('mouseup', () => {
      tirAutorise = true;
    });
  }
});

/* Joue la musique d'ambiance */
document.addEventListener("click", musicPlay);

function musicPlay() {
  $("musique").play();
  document.removeEventListener("click", musicPlay);
}

AFRAME.registerComponent("collision", {
  tick: function () {
    function abs(val) {
      return (val < 0) ? -val : val;
    }
    let pos = this.el.getAttribute("position");
    let posTeleporteur = document.getElementById("boxTp").getAttribute("position");

    if (abs(pos.x - posTeleporteur.x) < 0.7) {
      if (abs(pos.z - posTeleporteur.z) < 0.7) {
        if (tpAutorise) {
          this.el.setAttribute('position', { x: -2.76, y: 1.6, z: -2.1 });
          let audio = document.querySelector("#sonTeleportation").play();
        }
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
 
        let posSphere = document.getElementById("piege_0").getAttribute("position");
        let posSphere1 = document.getElementById("piege_1").getAttribute("position");
        let posSphere2 = document.getElementById("piege_2").getAttribute("position");
        let posSphere3 = document.getElementById("piege_3").getAttribute("position");
 
        if (abs((pos.x - posSphere.x) || (pos.x - posSphere1.x) || (pos.x - posSphere2.x) || (pos.x - posSphere3.x)) < 0.7) {
            if (abs(pos.z - posSphere.z) < 0.7 || abs(pos.z - posSphere1.z) < 0.7 || abs(pos.z - posSphere2.z) < 0.7 || abs(pos.z - posSphere3.z) < 0.7) {
                document.getElementById("trapDialog").style.display = "block";
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

AFRAME.registerComponent("trackball", {
  tick: function () {
    if (bombactive) return;

    let pos = this.el.getAttribute("position");

    let posSphere = document.getElementById("bombe").getAttribute("position");
    if (Math.abs(pos.x - posSphere.x) < 4 &&
      Math.abs(pos.z - posSphere.z) < 4
    ) {
      bombactive = true;
      $("musique").pause();
      $("countdown").play();
      $("tbombe").setAttribute("visible", "true");
      $("compteur").setAttribute("visible", "true");

      const startTimer = (duration, display) => {
        var timer = duration,
          minutes,
          seconds;
        monInter = setInterval(function () {
          $("compteur").setAttribute("text", "value: " + timer + ";");
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (!$("tinterrupteur").getAttribute("visible") && --timer < 0) {
            $("countdown").pause();
            $("BombeDialogue").style.display = "block";
            document.querySelector("a-scene").exitVR();
            clearInterval(monInter);
            $("compteur").remove();
          }
        }, 1000);
      };

      startTimer(30, $("time2"));

      $("interrupteur2").addEventListener('mouseenter', changeColor);
      $("interrupteur2").addEventListener('mouseleave', changeBack);

      $("interrupteur2").addEventListener("click", function () {
        // stop le compteur pour éviter de continuer le calcul
        clearInterval(monInter);
        $("countdown").pause();
        $("musique").play();
        if (document.contains($("compteur"))) {
          $("compteur").remove();
        }
        $("tinterrupteur").setAttribute("visible", "true");
      });
    }
  },
});

// fonction qui ajoute un nombre de munitions de façon aléatoire
function addAmmo(munitionsBonus) {
  let camera = $('camera');
  let posBalleX = 0.13 + 0.01 * camera.getElementsByTagName("a-image").length;

  for (var i = 0; i < munitionsBonus; i++) {
    let balle = document.createElement('a-image');
    camera.appendChild(balle);
    balle.setAttribute('src', '#bullet');
    balle.setAttribute('id', 'balle' + (nbTirs + i));
    balle.setAttribute('position', {
      x: posBalleX,
      y: -0.07,
      z: -0.2
    });
    balle.setAttribute('scale', {
      x: 0.005,
      y: 0.005,
      z: 0.005
    });
    balle.setAttribute('height', '5');
    balle.setAttribute('width', '0.8');
    posBalleX += 0.01;
  }
  nbTirs += munitionsBonus;
};

// fonction pour les lootboxes
AFRAME.registerComponent("openlootbox", {
  // récupération de l'id de notre lootbox
  schema: {
    id: {},
  },
  init: function () {
    var data = this.data; // valeurs des propriétés des composants.
    var el = this.el; // référence à l'entité du composant.
    var texteBonus = document.getElementById("texteBonus");
    const munitionsBonus = randomIntFromInterval(1, 6); // génération du nombre de munitions offert

    // si une lootbox est touchée, on l'ouvre, puis la supprime...
    if (data.id) {
      el.addEventListener('mouseenter', changeColor);
      el.addEventListener('mouseleave', changeBack);
      el.addEventListener(
        "click",
        () => {
          // animation de la lootbox lors de son ouverture
          el.setAttribute("animation-mixer", "timeScale: 1;");
          el.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            repetitions: 1,
          });

          // affichage d'un message temporaire dans la caméra du joueur
          texteBonus.setAttribute("visible", true);

          // appel de notre fonction qui ajoute un nombre de munitions aléatoire
          addAmmo(munitionsBonus);

          // masquage du message au bout de 4s
          removeText = setTimeout(function () {
            texteBonus.setAttribute("visible", false);
          }, 4000);

          // suppression de la lootbox au bout de 0.8s
          removeBox = setTimeout(function () {
            el.remove();
          }, 800);
        }, {
          once: true,
        }
      );
      // once: true pour que le listener soit automatiquement supprimé après son appel.
      clearTimeout(removeText);
      clearTimeout(removeBox);
    }
  },
});

// notion de génération aléatoire
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

AFRAME.registerComponent('trackballfinish', {
  tick: function () {
    let pos = this.el.getAttribute("position");
    let posSphere = $('fini2').getAttribute("position");

    if (Math.abs(pos.x - posSphere.x) < 2) {
      if (Math.abs(pos.z - posSphere.z) < 2) {
        clearInterval(mainCounter);
        $('finishDialog').children[0].children[1].children[0].innerHTML = "Félicitation, vous avez terminé le labyrinthe en " + Math.round(temps) + "s";
        $('finishDialog').style.display = "block";
        clearInterval(monInter);
        if (document.contains($("compteur"))) {
          $("compteur").remove();
        }
        document.querySelector('a-scene').exitVR();
      }
    }
  }
});

AFRAME.registerComponent("hit-handler", {
  dependencies: ["material"],

  init: function () {
    var positionTmp = (this.positionTmp = this.positionTmp || {
      x: 0,
      y: 0,
      z: 0,
    });
    var el = this.el;

    el.addEventListener("hit", () => {});

    el.addEventListener("die", () => {
      var position = el.getAttribute("position");
      positionTmp.x = position.x + 0.1;
      positionTmp.y = position.y - 100000;
      positionTmp.z = position.z + 0.1;
      el.setAttribute("position", positionTmp);
    });
  },
});

AFRAME.registerComponent("shoot-ennemy", {
  init: function () {
    let enemy = this.el;
    setInterval(function () {
      enemy.emit("shoot");
    }, 1000);
  },
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
        for(i=1;i<13;i++){
            var sphere = "sphere" + i;
            sphere = document.getElementById('sphere'  + i);
        }

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
            piege1.setAttribute('animation', {
                property: 'position',
                to: '-1.8 0.92838 -14.44684',
                loop: true,
                dur: '827,3',
                dir: 'alternate'
            });
            let piege3 = document.getElementById('piege_3');
            piege3.setAttribute('animation', {
                property: 'position',
                to: '-1.8 0.92838 -20', 
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
                to: '-1.8 0.92838 -11', 
                loop: true,
                dur: '827,3',
                dir: 'alternate'
            });
            let piege2 = document.getElementById('piege_2');
            piege2.setAttribute('animation', {
                property: 'position',
                to: '-1.8 0.92838 -17', 
                loop: true,
                dur: '827,3',
                dir: 'alternate'
            });
        }, 14400);
    }
});

AFRAME.registerComponent('munitions', {
  init: function () {
    addAmmo(5);
  }
});

function changeColor() {
  cursor.setAttribute('material', 'color: springgreen');
}

function changeBack() {
  cursor.setAttribute('material', 'color: white');
}
