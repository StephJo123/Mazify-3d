var boxx = -24;
var boxz = 18;
var boxx2 = 22;

function $(v) {
  return document.getElementById(v);
}

AFRAME.registerComponent("sallboss", {
  init: function () {
    let scene = document.querySelector('a-scene');

    for (var i = 0; i < 25; i++) {
      let boxe = document.createElement('a-box');
      scene.appendChild(boxe);
      boxe.setAttribute('position', {
        x: boxx,
        y: 2,
        z: 20
      });
      boxe.setAttribute('scale', {
        x: 2,
        y: 4,
        z: 2
      });
      boxe.setAttribute('material', 'src: #wall');
      boxe.setAttribute('color', '#336699');
      boxx += 2;
    }
    for (var i = 0; i < 24; i++) {
      let boxe = document.createElement('a-box');
      scene.appendChild(boxe);
      boxe.setAttribute('position', {
        x: 24,
        y: 2,
        z: boxz
      });
      boxe.setAttribute('scale', {
        x: 2,
        y: 4,
        z: 2
      });
      boxe.setAttribute('material', 'src: #wall');
      boxe.setAttribute('color', '#336699');

      boxz -= 2;

    }
    for (var i = 0; i < 24; i++) {
      let boxe = document.createElement('a-box');
      scene.appendChild(boxe);
      boxe.setAttribute('position', {
        x: boxx2,
        y: 2,
        z: -28
      });
      boxe.setAttribute('scale', {
        x: 2,
        y: 4,
        z: 2
      });
      boxe.setAttribute('material', 'src: #wall');
      boxe.setAttribute('color', '#336699');

      boxx2 -= 2;

    }
    for (var i = 0; i < 25; i++) {
      let boxe = document.createElement('a-box');
      scene.appendChild(boxe);
      boxe.setAttribute('position', {
        x: -24,
        y: 2,
        z: boxz
      });
      boxe.setAttribute('scale', {
        x: 2,
        y: 4,
        z: 2
      });
      boxe.setAttribute('material', 'src: #wall');
      boxe.setAttribute('color', '#336699');

      boxz += 2;
    }
  }
});

AFRAME.registerComponent("auto-enter-vr", {
  init: function () {
    $('player').addEventListener('click', function () {
      document.querySelector('a-scene').enterVR()
    });
  }
});

AFRAME.registerComponent('shoot-ennemy-boss', {
  init: function () {
    shootEnnemy(1800);
  }
});

AFRAME.registerComponent('shoot-ennemy-rafale', {
  init: function () {
    shootEnnemy(2500);
  }
});

function shootEnnemy(duration) {
  let enemy = this.el;
  setInterval(function () {
    enemy.emit('shoot');
  }, duration);
}


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

AFRAME.registerComponent('hit-handler-boss', {
  dependencies: ['material'],

  init: function () {
    var rotationTmp = this.rotationTmp = this.rotationTmp || {
      x: 0,
      y: 0,
      z: 0
    };
    var el = this.el;

    el.addEventListener('hit', () => {
      $('bosslife').setAttribute('geometry', {
        width: vie
      });
      if (vie < 10) {
        $('bosslife').setAttribute('material', 'color:orange')
        $('missile2').setAttribute('visible', 'true')
        $('missile2').setAttribute('animation', {
          property: 'position',
          to: '0 0 -1',
          dur: 3000
        });

      }
      if (vie < 5) {

        $('bosslife').setAttribute('material', 'color:red');

        for (i = 5; i <= 12; i++) {
          $('sphere' + i).setAttribute('shoot-ennemy-rafale', null);
        }
      }

      if (vie < 0) {
        el.parentNode.remove(el);

        for (j = 1; j <= 4; j++) {
          $('sphere' + j).removeAttribute('shooter');
        }
      }
      vie -= 0.06;
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
      $('roar').play();
    }, 20000);
  }
});