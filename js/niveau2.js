var removeBunny;
var nbLapins = 0;

function $(v) {
  return document.getElementById(v);
}

/* début du jeu */
AFRAME.registerComponent('startgame', {
  init: function () {
    this.el.addEventListener('mouseenter', changeColor);
    this.el.addEventListener('mouseleave', changeBack);

    this.el.addEventListener('click', () => {
      // document.querySelector('a-scene').enterVR();
      startTimer(60, $("time2"));
      $('compteur').setAttribute('visible', true);
      $('scene').setAttribute('fog', 'color: #444');
      $('player').setAttribute("movement-controls", "enabled: true");
      this.el.remove();
    });

    lesmurs = document.querySelectorAll('a-entity[mazify] a-box');
  }
});

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
      clearInterval(monInter);
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
      el.addEventListener('mouseenter', changeColor);
      el.addEventListener('mouseleave', changeBack);
      el.addEventListener(
        "click",
        () => {
          nbLapins++;
          $('collectedBunnies').setAttribute('text', 'value: ' + nbLapins + "/13");
          el.remove();
        }, {
          once: true,
        }
      );
    }
  },
});

function die() {

  $('scene').setAttribute('background', 'color: red')

  if (document.body.contains($('compteur')) && $('compteur').getAttribute('visible')) {
    $('compteur').remove();
    clearInterval(monInter);
  }

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
  $('timeout-msg').setAttribute('position', {
    x: currentRestartPos.x,
    y: newYpos,
    z: currentRestartPos.z
  });

  $('restart').setAttribute('visible', true);
  $('timeout-msg').setAttribute('visible', true);
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

function changeColor() {
  cursor.setAttribute('material', 'color: springgreen');
}

function changeBack() {
  cursor.setAttribute('material', 'color: white');
}