var removeText, removeBox, monInter;
var nbTirs = 0;
var tirAutorise, isDead, existantG, existantB = true;
var tpAutorise, bombactive = false;
var vie = 20;
var questionsArr = [];
var questionsArrB = [];
function $(v) {
  return document.getElementById(v);
}

/* début du jeu */
AFRAME.registerComponent('startgame', {
  init: function () {
    this.el.addEventListener('mouseenter', changeColor);
    this.el.addEventListener('mouseleave', changeBack);

    this.el.addEventListener('click', () => {
      document.querySelector('a-scene').enterVR();
      $('scene').setAttribute('fog', 'color: #444');
      $('player').setAttribute("keyboard-controls", "enabled: true");
      this.el.remove();
    });
  }
});


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
AFRAME.registerComponent('click-to-shoot-boss', {
  init: function () {
    document.body.addEventListener('mousedown', () => {
      this.el.emit('shoot')
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
    let pos = this.el.getAttribute("position");
    let posTeleporteur = $("boxTp").getAttribute("position");

    if (Math.abs(pos.x - posTeleporteur.x) < 0.7) {
      if (Math.abs(pos.z - posTeleporteur.z) < 0.7) {
        if (tpAutorise) {
          this.el.object3D.position.set(6, 0, -9);
        }
      }
    }
  }
});

AFRAME.registerComponent('collision_piege', {

  tick: function () {
    let pos = this.el.getAttribute("position");

    let posSphere = $("piege_0").getAttribute("position");
    let posSphere1 = $("piege_1").getAttribute("position");
    let posSphere2 = $("piege_2").getAttribute("position");
    let posSphere3 = $("piege_3").getAttribute("position");

    if (Math.abs((pos.x - posSphere.x) || Math.abs(pos.x - posSphere1.x) || Math.abs(pos.x - posSphere2.x) || Math.abs(pos.x - posSphere3.x)) < 0.7) {
      if (Math.abs(pos.z - posSphere.z) < 0.7 || Math.abs(pos.z - posSphere1.z) < 0.7 || Math.abs(pos.z - posSphere2.z) < 0.7 || Math.abs(pos.z - posSphere3.z) < 0.7) {
        if (isDead) {
          if (document.body.contains($('compteur'))) {
            if ($('compteur').getAttribute('visible') == true) {
              $('compteur').remove();
            }
          }
          isDead = false;
          die();
        }
      }
    }
  }
});

AFRAME.registerComponent('tpsalleboss', {

  tick: function () {
    $('skull2').addEventListener('click', function () {
      $('skull2').setAttribute('animation', {
        property: 'position',
        to: '16.312 2.2 -20.9'
      });
      $('skull2').setAttribute('link', 'href:niveau1.html')
    });
  }
});

AFRAME.registerComponent("trackball", {
  tick: function () {
    if (bombactive) return;

    let pos = this.el.getAttribute("position");

    let posSphere = $("bombe").getAttribute("position");
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
          if (document.body.contains($('compteur')))

            $("compteur").setAttribute("text", "value: " + timer + ";");
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (!$("tinterrupteur").getAttribute("visible") && --timer < 0) {
            $("countdown").pause();
            die();
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
        tpAutorise = true;
      });
    }
  },
});

function isValidePosition(posInit) {
  let bool = true;
  document.querySelectorAll('a-box').forEach(function (el) {
    const posN = el.getAttribute('position');
    if (Math.abs(posN.x - posInit.x) < 2 && Math.abs(posN.z - posInit.z) < 2) {
      bool = false;
      return;
    }
  })
  return bool;
}

function die() {
  // blocage des controles du joueur
  $('player').setAttribute("keyboard-controls", "enabled: false");

  // inversion de couleur
  $('body').setAttribute('style', "background-color: red;")
  $('scene').setAttribute('fog', 'color: red');
  cursor.setAttribute('material', 'color: red');

  $('restart').setAttribute('position', player.getAttribute('position'));
  $('restart').object3D.position.x += 2;

  let posRestart = $('restart').getAttribute('position');

  if (!isValidePosition(posRestart)) {
    $('restart').setAttribute('position', player.getAttribute('position'));
    $('restart').object3D.position.z -= 2;
    if (!isValidePosition(posRestart)) {
      $('restart').setAttribute('position', player.getAttribute('position'));
      $('restart').object3D.position.z += 2;
      if (!isValidePosition(posRestart)) {
        $('restart').setAttribute('position', player.getAttribute('position'));
        $('restart').object3D.position.x -= 2;
      }
    }
  }
  $('restart').object3D.position.y += 1;
  $('restart').setAttribute('visible', true);
}

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
    var texteBonus = $("texteBonus");
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

    el.addEventListener("hit", () => {
      console.log('coucou')
    });

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

AFRAME.registerComponent('munitions', {
  init: function () {
    addAmmo(5);
  }
});

AFRAME.registerComponent('ghost-follow', {
  tick: function () {
    let ghost = this.el;
    let posGhost = ghost.getAttribute('position');
    let posPlayer = $('player').getAttribute('position');
    let pas = 0.05,
      signeX = 0,
      signeZ = 0;
    if (Math.abs(posGhost.x - posPlayer.x) > pas) {
      signeX = (posGhost.x > posPlayer.x) ? -pas : pas;
    }
    if (Math.abs(posGhost.z - posPlayer.z) > pas) {
      signeZ = (posGhost.z > posPlayer.z) ? -pas : pas;
    }
    ghost.setAttribute('position', {
      x: posGhost.x + signeX,
      y: 0,
      z: posGhost.z + signeZ
    });

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


function changeColor() {
  cursor.setAttribute('material', 'color: springgreen');
}

function changeBack() {
  cursor.setAttribute('material', 'color: white');
}

// Question labyrinthe
AFRAME.registerComponent('question_resolue', {
  init: function () {
    var goodA = document.getElementsByClassName('goodA');
    for(let i = 0; i < goodA.length; i++) {
      goodA[i].addEventListener('click', function(evt) {

        for(let j = 0; j <= questionsArr.length; j++) {
            if(goodA[i].id == questionsArr[j]) {
              existantG = false;
              break;
            }
            else if(j == questionsArr.length) {
              existantG = true;
            }
        }
        
        if(existantG == true) {
          questionsArr.push(goodA[i].id);
          var texteBonus = $("texteBonus"); 

          // affichage d'un message temporaire dans la caméra du joueur
          texteBonus.setAttribute("visible", true);
          // masquage du message au bout de 2s
      
          removeText = setTimeout(function () {
            texteBonus.setAttribute("visible", false);
          }, 2000);    
        }  
      });
    }
  clearTimeout(removeText);
  }
});

// Question labyrinthe
AFRAME.registerComponent('question_erreur', {
  init: function () {
    var badA = document.getElementsByClassName('badA');
    for(let i = 0; i < badA.length; i++) {
      badA[i].addEventListener('click', function(evt) {

        for(let j = 0; j <= questionsArrB.length; j++) {
          if(badA[i].id == questionsArrB[j]) {
            existantB = false;
            break;
          }
          else if(j == questionsArrB.length) {
            existantB = true;
          }
        }

        if(existantB == true) {
          questionsArrB.push(badA[i].id);
          var texteErreur = $("texteErreur"); 

          texteErreur.setAttribute("visible", true);

          removeText = setTimeout(function () {
            texteErreur.setAttribute("visible", false);
          }, 2000);
        }
      });
    }
    clearTimeout(removeText);
  }
});

AFRAME.registerComponent('collision_piege_niveau2', {

  tick: function () {

    let pos = this.el.getAttribute("position");
    let posTrap = $("spike").getAttribute("position");
    let posTrap2 = $("spike2").getAttribute("position");
    let posTrap3 = $("spike3").getAttribute("position");
    let posTrap4 = $("spike4").getAttribute("position");

    if (
      (Math.abs(pos.y - posTrap.y) < 0.7) && (Math.abs(pos.z - posTrap.z) < 0.1)
      ||
      (Math.abs(pos.y - posTrap2.y) < 0.7) && (Math.abs(pos.z - posTrap2.z) < 0.1)
      ||
      (Math.abs(pos.x - posTrap3.x) < 0.7) && (Math.abs(pos.z - posTrap3.z) < 0.1)
      ||
      (Math.abs(pos.x - posTrap4.x) < 0.7) && (Math.abs(pos.z - posTrap4.z) < 0.1)
    ) {
      $('scene').setAttribute('fog', 'color: red');
    }
  }
});