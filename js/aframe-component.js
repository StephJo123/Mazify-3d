var removeText, removeBox, monInter;
var nbTirs = 0;
var tirAutorise, isDead = true;
var tpAutorise, bombactive = false;
var vie = 20;
var lesmurs;

function $(v) {
  return document.getElementById(v);
}

/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
  init: function () {
    document.body.addEventListener('mousedown', () => {
      if (nbTirs != 0 && tirAutorise) {
        tirAutorise = false;
        this.el.emit('shoot');
        $('balle' + (nbTirs - 1)).remove();
        let audio = $('sonArme');
        audio.play();
        audio.currentTime = 0;
        nbTirs -= 1;
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
    let pos = this.el.object3D.position;
    let posTeleporteur = $("boxTp").object3D.position;

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
    let pos = this.el.object3D.position;

    let posPiege = $("piege_0").object3D.position;
    let posPiege1 = $("piege_1").object3D.position;
    let posPiege2 = $("piege_2").object3D.position;
    let posPiege3 = $("piege_3").object3D.position;

    if (Math.abs(pos.x - posPiege.x) < 0.4 || Math.abs(pos.x - posPiege1.x) < 0.4 || Math.abs(pos.x - posPiege2.x) < 0.4 || Math.abs(pos.x - posPiege3.x) < 0.4) {
      if (Math.abs(pos.z - posPiege.z) < 0.4 || Math.abs(pos.z - posPiege1.z) < 0.4 || Math.abs(pos.z - posPiege2.z) < 0.4 || Math.abs(pos.z - posPiege3.z) < 0.4) {
        die($('trap-msg'));
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

    let pos = this.el.object3D.position;

    let posBombe = $("bombe").object3D.position;
    if (Math.abs(pos.x - posBombe.x) < 4 &&
      Math.abs(pos.z - posBombe.z) < 4
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

          if (--timer < 0) {
            $("countdown").pause();
            clearInterval(monInter);
            die($('timeout-msg'));
          }
        }, 1000);

      };

      startTimer(30, $("time2"));

      $("interrupteur2").addEventListener('mouseenter', changeColor);
      $("interrupteur2").addEventListener('mouseleave', changeBack);

      $("interrupteur2").addEventListener("click", function () {
        // stop le compteur pour éviter de continuer le calcul
        clearInterval(monInter);
        $("tbombe").remove();
        $("countdown").pause();
        $("musique").play();
        removeIfExist($("compteur"));
        $("tinterrupteur").setAttribute("visible", "true");
        tpAutorise = true;
      });
    }
  },
});

function isValidePosition(posInit) {
  let bool = true;
  lesmurs.forEach(function (el) {
    const posN = el.object3D.position;
    if (Math.abs(posN.x - posInit.x) < 2 && Math.abs(posN.z - posInit.z) < 2) {
      bool = false;
      return;
    }
  })
  return bool;
}

function removeIfExist(element) {
  if (document.body.contains(element)) {
    element.remove();
  }
}

function die(deathText) {

  $('scene').setAttribute('background', 'color: red')

  removeIfExist($('ghost-model'));

  if (document.body.contains($('compteur')) && $('compteur').getAttribute('visible')) {
    $('compteur').remove();
    clearInterval(monInter);
  }

  removeIfExist($('tbombe'));

  // blocage des controles du joueur
  $('player').setAttribute("movement-controls", "enabled: false");

  // inversion de couleur
  $('body').setAttribute('style', "background-color: red;")
  $('scene').setAttribute('fog', 'color: red');
  cursor.setAttribute('material', 'color: red');

  $('restart').setAttribute('position', player.object3D.position);
  $('restart').object3D.position.x += 2;
  $('timeout-msg').object3D.position.x += 2;

  let posRestart = $('restart').object3D.position;

  if (!isValidePosition(posRestart)) {
    $('restart').setAttribute('position', player.object3D.position);
    $('restart').object3D.position.z -= 2;
    if (!isValidePosition(posRestart)) {
      $('restart').setAttribute('position', player.object3D.position);
      $('restart').object3D.position.z += 2;
      if (!isValidePosition(posRestart)) {
        $('restart').setAttribute('position', player.object3D.position);
        $('restart').object3D.position.x -= 2;
      }
    }
  }
  $('restart').object3D.position.y += 1;

  let currentRestartPos = $('restart').object3D.position;
  let newYpos = $('restart').object3D.position.y + 0.75;
  deathText.setAttribute('position', {
    x: currentRestartPos.x,
    y: newYpos,
    z: currentRestartPos.z
  });

  $('restart').setAttribute('visible', true);
  deathText.setAttribute('visible', true);
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
    balle.object3D.position.set(posBalleX, -0.07, -0.2);
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



AFRAME.registerComponent("ghost-collision-detect", {
  tick: function () {
    let ghost = this.el;
    let ghostPos = ghost.object3D.position;
    let playerPos = $('player').object3D.position;

    if (Math.abs(ghostPos.x - playerPos.x) < 0.80 && Math.abs(ghostPos.z - playerPos.z) < 0.80) {
      die($('ghost-msg'));
    }
  }
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

AFRAME.registerComponent('delais', {
  init: function () {
    setTimeout(() => {
      $('blade1').setAttribute('animation-mixer', '');
      $('blade3').setAttribute('animation-mixer', '');

    }, 15000);
    setTimeout(() => {
      $('piege_1').setAttribute('animation', {
        property: 'position',
        to: '-1.8 0.92838 -14.44684',
        loop: true,
        dur: '827,3',
        dir: 'alternate'
      });
      $('piege_3').setAttribute('animation', {
        property: 'position',
        to: '-1.8 0.92838 -20',
        loop: true,
        dur: '827,3',
        dir: 'alternate'
      });
    }, 14900);

    setTimeout(() => {
      $('blade').setAttribute('animation-mixer', '');
      $('blade2').setAttribute('animation-mixer', '');
    }, 14500);

    setTimeout(() => {
      $('piege_0').setAttribute('animation', {
        property: 'position',
        to: '-1.8 0.92838 -11',
        loop: true,
        dur: '827,3',
        dir: 'alternate'
      });
      $('piege_2').setAttribute('animation', {
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