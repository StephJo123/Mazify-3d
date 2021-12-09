var removeBunny;
var nbLapins = 0;
AFRAME.registerComponent('last-component', {
  init: function () {
    // apparament obligé de faire comme ça si on veut attendre que la mazification soit faite
    setTimeout(() => {
      const start = $('start-tile');

      $('startMenu').setAttribute('position', start.object3D.position);
      $('startMenu').object3D.position.x += 2;

      let posfinish = $('startMenu').object3D.position;

      if (!isValidePosition(posfinish)) {
        $('startMenu').setAttribute('position', start.object3D.position);
        $('startMenu').object3D.position.z -= 2;
        if (!isValidePosition(posfinish)) {
          $('startMenu').setAttribute('position', start.object3D.position);
          $('startMenu').object3D.position.z += 2;
          if (!isValidePosition(posfinish)) {
            $('startMenu').setAttribute('position', start.object3D.position);
            $('startMenu').object3D.position.x -= 2;
          }
        }
      }
      $('startMenu').object3D.position.y += 1;
      $('startMenu').setAttribute('visible', 'true');

      // partage les lapins à travers le labyrinthe
      let lapins = Array.from(document.querySelectorAll('.bunny'));
      const pas = Math.floor((400 - lesmurs.length) / lapins.length);
      let numVide = 0;
      for (let x = 0; x < 20; ++x) {
        for (let y = 0; y < 20; ++y) {
          const i = (y * 20) + x;

          if (mazeArr[i] == 0) {
            numVide++;
            if (numVide == pas) {
              numVide = 0;
              const l = lapins.shift();
              l.object3D.position.set((x - 10) * 3, 0, (y - 10) * 3);
            }
          }
        }
      }
    }, 500);
  }
});

/* début du jeu */
AFRAME.registerComponent('startgame', {
  init: function () {
    toggleCursorColor(this.el);

    this.el.addEventListener('click', () => {
      startTimer(500);
      $('compteur').setAttribute('visible', true);
      $('scene').setAttribute('fog', 'color: #444');
      $('player').setAttribute("movement-controls", "enabled: true");
      this.el.remove();
    });
  }
});

const startTimer = (duration) => {
  var timer = duration;
  const compteur = $('compteur');
  monInter = setInterval(function () {
    if (document.body.contains(compteur))
      compteur.setAttribute("text", "value: " + timer + ";");

    if (--timer < 0 && nbLapins != 13) {
      clearInterval(monInter);
      clearBunnies();
      die();
    }
  }, 1000);
};

AFRAME.registerComponent("collect-bunny", {
  init: function () {
    var el = this.el; // référence à l'entité du composant.
    toggleCursorColor(el);
    el.addEventListener(
      "click",
      () => {
        nbLapins++;
        document.getElementById('collectedBunnies').setAttribute('visible', true);
        document.getElementById('collectedBunnies').setAttribute('text', 'value: ' + nbLapins + "/13");
        let audio = $('collect_sound');
        audio.play();
        audio.currentTime = 0;
        $('collectedBunnies').setAttribute('text', 'value: ' + nbLapins + "/13");
        el.remove();
        if (nbLapins == 13) {
          clearBunnies();
          win();
        }
      }, {
        once: true,
      }
    );
  }
});

function win() {
  dialogEvenement("finish_game", "blue");
  const confetti = $('confetti_animation');
  confetti.setAttribute('position', $('finish_game').object3D.position);
  confetti.setAttribute('visible', true);
}

function die() {
  dialogEvenement("restart", "red");
  const timeout = $('timeout-msg');
  timeout.setAttribute('position', $('restart').object3D.position);
  timeout.object3D.position.y += 0.75;
  timeout.setAttribute('visible', true);
}

function dialogEvenement(state, color) {
  $('scene').setAttribute('background', 'color: ' + color);

  if (document.body.contains($('compteur')) && $('compteur').getAttribute('visible')) {
    $('compteur').remove();
    clearInterval(monInter);
  }

  // blocage des controles du joueur
  const player = $('player');
  player.setAttribute("movement-controls", "enabled: false");

  // inversion de couleur
  $('body').setAttribute('style', "background-color: " + color)
  $('scene').setAttribute('fog', 'color: ' + color);
  cursor.setAttribute('material', 'color: ' + color);

  $(state).setAttribute('position', player.object3D.position);
  $(state).object3D.position.x += 2;

  let posfinish = $(state).object3D.position;

  if (!isValidePosition(posfinish)) {
    $(state).setAttribute('position', player.object3D.position);
    $(state).object3D.position.z -= 2;
    if (!isValidePosition(posfinish)) {
      $(state).setAttribute('position', player.object3D.position);
      $(state).object3D.position.z += 2;
      if (!isValidePosition(posfinish)) {
        $(state).setAttribute('position', player.object3D.position);
        $(state).object3D.position.x -= 2;
      }
    }
  }
  $(state).object3D.position.y += 1;

  $(state).setAttribute('visible', true);
}

function clearBunnies() {
  document.querySelectorAll('.bunny').forEach(element => element.remove());
}