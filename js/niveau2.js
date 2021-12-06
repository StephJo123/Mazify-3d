var removeBunny;
var nbLapins = 0;

function $(v) {
  return document.getElementById(v);
}

/* début du jeu */
AFRAME.registerComponent('startgame', {
  init: function () {
    this.el.addEventListener('mouseenter', () => cursor.setAttribute('material', 'color: springgreen'));
    this.el.addEventListener('mouseleave', () => cursor.setAttribute('material', 'color: white'));

    this.el.addEventListener('click', () => {
      startTimer(60);
      $('compteur').setAttribute('visible', true);
      $('scene').setAttribute('fog', 'color: #444');
      $('player').setAttribute("movement-controls", "enabled: true");
      this.el.remove();
    });
  }
});

const startTimer = (duration) => {
  var timer = duration;
  monInter = setInterval(function () {
    if (document.body.contains($('compteur')))
      $("compteur").setAttribute("text", "value: " + timer + ";");

    if (--timer < 0 && nbLapins != 13) {
      clearInterval(monInter);
      clearBunnies();
      die();
    }
  }, 1000);

};

AFRAME.registerComponent("collect-bunny", {
  schema: {
    id: {},
  },
  init: function () {
    var data = this.data; // valeurs des propriétés des composants.
    var el = this.el; // référence à l'entité du composant.

    if (data.id) {
      this.el.addEventListener('mouseenter', () => cursor.setAttribute('material', 'color: springgreen'));
      this.el.addEventListener('mouseleave', () => cursor.setAttribute('material', 'color: white'));
      el.addEventListener(
        "click",
        () => {
          nbLapins++;
          $('collectedBunnies').setAttribute('text', 'value: ' + nbLapins + "/13");
          el.remove();
          if (nbLapins == 1) {
            clearBunnies();
            win();
          }
        }, {
          once: true,
        }
      );
    }
  },
});

function win() {
  dialogEvenement("finish_game", "blue");

  let currentFinishPos = $('finish_game').object3D.position;
  $('confetti_animation').setAttribute('position', {
    x: currentFinishPos.x,
    y: currentFinishPos.y,
    z: currentFinishPos.z + 1
  });
  $('confetti_animation').setAttribute('visible', true);
}

function die() {
  dialogEvenement("restart", "red");

  let currentRestartPos = $('restart').object3D.position;
  let newYpos = $('restart').object3D.position.y + 0.75;
  $('timeout-msg').setAttribute('position', {
    x: currentRestartPos.x,
    y: newYpos,
    z: currentRestartPos.z
  });

  $('timeout-msg').setAttribute('visible', true);
}

function dialogEvenement(state, color) {
  $('scene').setAttribute('background', 'color: ' + color);

  if (document.body.contains($('compteur')) && $('compteur').getAttribute('visible')) {
    $('compteur').remove();
    clearInterval(monInter);
  }

  // blocage des controles du joueur
  $('player').setAttribute("movement-controls", "enabled: false");

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

function clearBunnies() {
  document.querySelectorAll('.bunny').forEach(element => element.remove());
}