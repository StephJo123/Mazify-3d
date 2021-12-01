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

      boxz += 2;
    }
  }
});

