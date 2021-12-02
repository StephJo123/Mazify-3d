lesmurs = document.querySelectorAll('a-entity[mazify] a-box');

// Question labyrinthe
AFRAME.registerComponent('question_resolue', {
  init: function () {
    var goodA = document.getElementsByClassName('goodA');
    for (let i = 0; i < goodA.length; i++) {
      goodA[i].addEventListener('click', function (evt) {

        for (let j = 0; j <= questionsArr.length; j++) {
          if (goodA[i].id == questionsArr[j]) {
            existantG = false;
            break;
          } else if (j == questionsArr.length) {
            existantG = true;
          }
        }

        if (existantG == true) {
          questionsArr.push(goodA[i].id);
          var texteBonus = $("texteBonus");

          // affichage d'un message temporaire dans la caméra du joueur
          texteBonus.setAttribute("visible", true);
          // masquage du message au bout de 2s

          removeText = setTimeout(function () {
            texteBonus.setAttribute("visible", false);
          }, 2000);
        }
      });
    }
    clearTimeout(removeText);
  }
});

// Question labyrinthe
AFRAME.registerComponent('question_erreur', {
  init: function () {
    var badA = document.getElementsByClassName('badA');
    for (let i = 0; i < badA.length; i++) {
      badA[i].addEventListener('click', function (evt) {

        for (let j = 0; j <= questionsArrB.length; j++) {
          if (badA[i].id == questionsArrB[j]) {
            existantB = false;
            break;
          } else if (j == questionsArrB.length) {
            existantB = true;
          }
        }

        if (existantB == true) {
          questionsArrB.push(badA[i].id);
          var texteErreur = $("texteErreur");

          texteErreur.setAttribute("visible", true);

          removeText = setTimeout(function () {
            texteErreur.setAttribute("visible", false);
          }, 2000);
        }
      });
    }
    clearTimeout(removeText);
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
      (Math.abs(pos.y - posTrap.y) < 0.7) && (Math.abs(pos.z - posTrap.z) < 0.1) ||
      (Math.abs(pos.y - posTrap2.y) < 0.7) && (Math.abs(pos.z - posTrap2.z) < 0.1) ||
      (Math.abs(pos.x - posTrap3.x) < 0.7) && (Math.abs(pos.z - posTrap3.z) < 0.1) ||
      (Math.abs(pos.x - posTrap4.x) < 0.7) && (Math.abs(pos.z - posTrap4.z) < 0.1)
    ) {
      $('scene').setAttribute('fog', 'color: red');
    }
  }
});