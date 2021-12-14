/* début du jeu */
AFRAME.registerComponent('startgame', {
  init: function () {

    toggleCursorColor(this.el);
    this.el.addEventListener('click', () => {
      $('scene').setAttribute('fog', 'color: #444');
      $('player').setAttribute("movement-controls", "enabled: true");
      $('tinstruction').remove();
      $('ghost-model').setAttribute("ghost-follow", "");
      $('ghost-model2').setAttribute("ghost-follow", "");
      $('ghost-model3').setAttribute("ghost-follow", "");
      $('ghost-model4').setAttribute("ghost-follow", "");
      $('ghost-model5').setAttribute("ghost-follow", "");
      this.el.remove();
    });

    lesmurs = document.querySelectorAll('a-entity[mazify] a-box');
  }
});

AFRAME.registerComponent('ghost-follow', {
  init: function () {
    let ghost = this.el;

    function avance(ghost, pas) {
      let rotation = ghost.object3D.rotation;
      let pos = ghost.object3D.position;
      if (Math.abs(rotation.y + 1.5708) < 0.2) {
        ghost.object3D.position.set(pos.x - pas, pos.y, pos.z);
      } else if (Math.abs(rotation.y - 1.5708) < 0.2) {
        ghost.object3D.position.set(pos.x + pas, pos.y, pos.z);
      } else {
        ghost.object3D.position.set(pos.x, pos.y, pos.z += (rotation.z >= -0.2 && rotation.z <= 0.2) ? pas : -pas);
      }
    }
    setInterval(function () {
      avance(ghost, 1); // on avance pour savoir si la position sera dans le mur
      if (!isValidePosition(ghost.object3D.position)) { // s'il est dans un mur
        avance(ghost, -1); // on revient avant de tourner
        ghost.object3D.rotateY((Math.random() <= 0.5) ? 1.5708 : -1.5708); // on tourne
      }
    }, 500);
    ghost.object3D.rotation.set(0, -1.5708, 0);
  }
});