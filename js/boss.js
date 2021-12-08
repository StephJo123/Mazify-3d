var boxx = -24;
var boxz = 18;
var boxx2 = 22;

function $(v) {
  return document.getElementById(v);
}

AFRAME.registerComponent("auto-enter-vr", {
  init: function () {
    $('player').addEventListener('click', function () {
      document.querySelector('a-scene').enterVR()
    });
  }
});

AFRAME.registerComponent('shoot-ennemy-boss', {
  init: function () {
    let enemy = this.el;
    setInterval(function () {
      enemy.emit('shoot');
    }, 1800);
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
      console.log('ok')
    });

    el.addEventListener("die", () => {
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
        

      }
      if (vie < 5) {

        $('bosslife').setAttribute('material', 'color:red');
      }

      if (vie < 0) {
        el.parentNode.remove(el);
        el.parentNode.remove(el);
        el.parentNode.remove(el);
        el.parentNode.remove(el);
        el.parentNode.remove(el);
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

AFRAME.registerComponent('camera-hit', {
  tick: function () {
    let human = this.el;
    let humanPos = human.object3D.position;
    let playerPos = $('player2').object3D.position;

    humanPos.set(playerPos.x, playerPos.y, playerPos.z + 1);
  }
  
});