var bombactive = false;
var nbTirs = 0;
var test = 0;
var tirAutorise = true;
var monInter;
var removeText, removeBox;

function $(v) {
  return document.getElementById(v);
}

/* Permet de tirer */
AFRAME.registerComponent('click-to-shoot', {
  init: function () {
    document.body.addEventListener('mousedown', () => {
      if (nbTirs != 0) {
        if (tirAutorise) {
          tirAutorise = false;
          this.el.emit('shoot');
          $('balle' + (nbTirs - 1)).remove();
          let audio = $('sonArme');
          audio.play();
          audio.currentTime = 0;
          nbTirs -= 1;
        }
      }
    });
    document.body.addEventListener('mouseup', () => {
      tirAutorise = true;
    });
  }
});

/* Joue la musique d'ambiance */
document.addEventListener("click", musicPlay);

function musicPlay() {
  $("musique").play();
  document.removeEventListener("click", musicPlay);
}

AFRAME.registerComponent("collision", {
  tick: function () {
    let pos = this.el.getAttribute("position");

    let posSphere = $("boxTp").getAttribute("position");

    if (
      Math.abs(pos.x - posSphere.x) < 0.7 &&
      Math.abs(pos.z - posSphere.z) < 0.7
    ) {
      this.el.setAttribute("position", {
        x: -2.76,
        y: 1.6,
        z: -2.1,
      });
      $("sonTeleportation").play();
    }
  },
});

AFRAME.registerComponent("trackball", {
  tick: function () {
    if (bombactive) return;

    let pos = this.el.getAttribute("position");

    let posSphere = document.getElementById("bombe").getAttribute("position");
    if (Math.abs(pos.x - posSphere.x) < 4 &&
      Math.abs(pos.z - posSphere.z) < 4
    ) {
      bombactive = true;
      $("musique").pause();
      $("countdown").play();
      $("tbombe").setAttribute("visible", "true");
      $("compteur").setAttribute("visible", "true");

      const startTimer = (duration, display) => {
        var timer = duration,
          minutes,
          seconds;
        monInter = setInterval(function () {
          $("compteur").setAttribute("text", "value: " + timer + ";");
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (!$("tinterrupteur").getAttribute("visible") && --timer < 0) {
            $("countdown").pause();
            $("BombeDialogue").style.display = "block";
            document.querySelector("a-scene").exitVR();
            clearInterval(monInter);
            $("compteur").remove();
          }
        }, 1000);
      };

      startTimer(30, $("time2"));

      $("interrupteur2").addEventListener("click", function () {
        // stop le compteur pour éviter de continuer le calcul
        clearInterval(monInter);
        $("countdown").pause();
        $("musique").play();
        $("compteur").remove();
        $("tinterrupteur").setAttribute("visible", "true");
      });
    }
  },
});

// fonction qui ajoute un nombre de munitions de façon aléatoire
function addAmmo(munitionsBonus) {
  let camera = $('camera');
  let posBalleX = -0.02 + 0.01 * camera.getElementsByTagName("a-image").length;
  for (var i = 0; i < munitionsBonus; i++) {
    let balle = document.createElement('a-image');
    camera.appendChild(balle);
    balle.setAttribute('src', '#bullet');
    balle.setAttribute('id', 'balle' + (nbTirs + i));
    balle.setAttribute('position', {
      x: posBalleX,
      y: 0.08,
      z: -0.2
    });
    balle.setAttribute('scale', {
      x: 0.005,
      y: 0.005,
      z: 0.005
    });
    balle.setAttribute('height', '5');
    balle.setAttribute('width', '0.8');
    posBalleX += 0.01;
  }
  nbTirs += munitionsBonus;
};

// fonction pour les lootboxes
AFRAME.registerComponent("openlootbox", {
  // récupération de l'id de notre lootbox
  schema: {
    id: {},
  },
  init: function () {
    var data = this.data; // valeurs des propriétés des composants.
    var el = this.el; // référence à l'entité du composant.
    var texteBonus = document.getElementById("texteBonus");
    const munitionsBonus = randomIntFromInterval(1, 6); // génération du nombre de munitions offert

    // si une lootbox est touchée, on l'ouvre, puis la supprime...
    if (data.id) {
      el.addEventListener('mouseenter', changeColor);
      el.addEventListener('mouseleave', changeBack);
      el.addEventListener(
        "click",
        () => {
          // animation de la lootbox lors de son ouverture
          el.setAttribute("animation-mixer", "timeScale: 1;");
          el.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            repetitions: 1,
          });

          // affichage d'un message temporaire dans la caméra du joueur
          texteBonus.setAttribute("visible", true);

          // appel de notre fonction qui ajoute un nombre de munitions aléatoire
          addAmmo(munitionsBonus);

          // masquage du message au bout de 4s
          removeText = setTimeout(function () {
            texteBonus.setAttribute("visible", false);
          }, 4000);

          // suppression de la lootbox au bout de 0.8s
          removeBox = setTimeout(function () {
            el.remove();
          }, 800);
        }, {
          once: true,
        }
      );
      // once: true pour que le listener soit automatiquement supprimé après son appel.
      clearTimeout(removeText);
      clearTimeout(removeBox);
    }
  },
});

// notion de génération aléatoire
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

AFRAME.registerComponent('trackballfinish', {
  tick: function () {
    let pos = this.el.getAttribute("position");
    let posSphere = $('fini2').getAttribute("position");

    if (Math.abs(pos.x - posSphere.x) < 2) {
      if (Math.abs(pos.z - posSphere.z) < 2) {
        clearInterval(mainCounter);
        $('finishDialog').children[0].children[1].children[0].innerHTML = "Félicitation, vous avez terminé le labyrinthe en " + Math.round(temps) + "s";
        $('finishDialog').style.display = "block";
        clearInterval(monInter);
        $("compteur").remove();
        document.querySelector('a-scene').exitVR();
      }
    }
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

AFRAME.registerComponent("shoot-ennemy", {
  init: function () {
    let enemy = this.el;
    setInterval(function () {
      enemy.emit("shoot");
    }, 1000);
  },
});

AFRAME.registerComponent('munitions', {
  init: function () {
    addAmmo(5);
  }
});

function changeColor() {
  cursor.setAttribute('material', 'color: springgreen');
}

function changeBack() {
  cursor.setAttribute('material', 'color: black');
}