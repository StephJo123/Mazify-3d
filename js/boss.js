var boxx = -24
var boxz = 18
var boxx2 = 22

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
    document.getElementById('player').addEventListener('click', function (evt) {
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
    var rotationTmp = this.rotationTmp = this.rotationTmp || {
      x: 0,
      y: 0,
      z: 0
    };
    var el = this.el;
    var missile = document.getElementById('missile2')
    var sphere1 = document.getElementById('sphere1');
    var sphere2 = document.getElementById('sphere2');
    var sphere3 = document.getElementById('sphere3');
    var sphere4 = document.getElementById('sphere4');
    var sphere5 = document.getElementById('sphere5');
    var sphere6 = document.getElementById('sphere6');
    var sphere7 = document.getElementById('sphere7');
    var sphere8 = document.getElementById('sphere8');
    var sphere9 = document.getElementById('sphere9');
    var sphere10 = document.getElementById('sphere10');
    var sphere11 = document.getElementById('sphere11');
    var sphere12 = document.getElementById('sphere12');

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
        sphere1.removeAttribute('shooter');
        sphere2.removeAttribute('shooter');
        sphere3.removeAttribute('shooter');
        sphere4.removeAttribute('shooter');

      }
      vie = vie - 0.06


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
