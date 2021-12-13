var removeText, removeBox, monInter;
var isDead = true;
var tpAutorise, bombactive = false;

function $(v) {
  return document.getElementById(v);
}

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

      const startTimer = (duration) => {
        var timer = duration;
        monInter = setInterval(() => {
          if (document.body.contains($('compteur')))
            $("compteur").setAttribute("text", "value: " + timer + ";");
          if (--timer < 0) {
            $("countdown").pause();
            clearInterval(monInter);
            die($('timeout-msg'));
          }
        }, 1000);

      };

      startTimer(90, $("time2"));

      toggleCursorColor($('interrupteur2'));

      $("interrupteur2").addEventListener("click",() => {
        $("interrupteur2").setAttribute('animation-mixer',{
          timeScale: 0.2,
          loop: 'once'
        });
        // stop le compteur pour éviter de continuer le calcul
        clearInterval(monInter);
        removeIfExist($('tbombe'));
        $("countdown").pause();
        $("musique").play();
        removeIfExist($("compteur"));
        $("tinterrupteur").setAttribute("visible", "true");
        tpAutorise = true;
      });
    }
  },
});

function die(deathText) {

  $('scene').setAttribute('background', 'color: red')

  removeIfExist($('ghost-model'));
  removeIfExist($('ghost-model2'));
  removeIfExist($('ghost-model3'));
  removeIfExist($('ghost-model4'));
  removeIfExist($('ghost-model5'));

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

AFRAME.registerComponent("ghost-collision-detect", {
  tick: function () {
    let ghost = this.el;
    let ghostPos = ghost.object3D.position;
    let playerPos = $('player').object3D.position;

    if (Math.abs(ghostPos.x - playerPos.x) < 1.2 && Math.abs(ghostPos.z - playerPos.z) < 1.2) {
      die($('ghost-msg'));
    }
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
