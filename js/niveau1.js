var removeText;
var existantG = true;
var questionsArr = [];
var removeText;

/* début du jeu */
AFRAME.registerComponent('startgame', {
  init: function () {
    toggleCursorColor(this.el);

    this.el.addEventListener('click', () => {
      document.querySelector('a-scene').enterVR();
      $('scene').setAttribute('fog', 'color: #444');
      $('player').setAttribute("movement-controls", "enabled: true");
      this.el.remove();
    });
  }
});

  
// Question labyrinthe
AFRAME.registerComponent('question_resolue', {
  init: function () {
    var bonnereponse=0;
    var goodA = document.getElementsByClassName('goodA');
    for(let i = 0; i < goodA.length; i++) {
      goodA[i].addEventListener('click', function(evt) {

        for(let j = 0; j <= questionsArr.length; j++) {
            if(goodA[i].id == questionsArr[j]) {
              existantG = false;
              break;
            }
            else if(j == questionsArr.length) {
              existantG = true;
            }
        }

        if (existantG) {
          questionsArr.push(goodA[i].id);

          // affichage d'un message temporaire dans la caméra du joueur
          $("texteBonus").setAttribute("visible", true);
          // masquage du message au bout de 2s
      
          removeText = setTimeout(function () {
            $("texteBonus").setAttribute("visible", false);
          }, 2000);
        }
        if(bonnereponse==3){
          console.log('youhou');
        }
        bonnereponse+=1;
      });
    }
  clearTimeout(removeText);
  }
});

// Question labyrinthe
AFRAME.registerComponent('question_erreur', {
  init: function () {
    var badA = document.getElementsByClassName('badA');
    for(let i = 0; i < badA.length; i++) {
      badA[i].addEventListener('click', function(evt) {
          dieNiveau2($('badanswer-msg'));
      });
    }
  }
});

AFRAME.registerComponent('collision_piege_niveau2', {

  tick: function () {

    let pos = this.el.getAttribute("position");
    let posTrap = $("spike").getAttribute("position");
    let posTrap2 = $("spike2").getAttribute("position");
    let posTrap3 = $("spike3").getAttribute("position");
    let posTrap4 = $("spike4").getAttribute("position");

    if (
      (Math.abs(pos.x - posTrap.x) < 0.2) && (Math.abs(pos.z - posTrap.z) < 0.1)
      ||
      (Math.abs(pos.x - posTrap2.x) < 0.2) && (Math.abs(pos.z - posTrap2.z) < 0.1)
      ||
      (Math.abs(pos.x - posTrap3.x) < 0.2) && (Math.abs(pos.z - posTrap3.z) < 0.1) 
      ||
      (Math.abs(pos.x - posTrap4.x) < 0.2) && (Math.abs(pos.z - posTrap4.z) < 0.1)
    ) {
      //$('scene').setAttribute('fog', 'color: red');
      dieNiveau2($('trap-msg'));
    }
  }
});

function dieNiveau2(deathText) {
  // blocage des controles du joueur
  $('player').setAttribute("movement-controls", "enabled: false");

  // inversion de couleur
  $('scene').setAttribute('fog', 'color: red');
  cursor.setAttribute('material', 'color: red');

  $('restart').setAttribute('position', player.object3D.position);
  $('restart').object3D.position.x += 2;

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
