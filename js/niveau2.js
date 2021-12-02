var removeBunny;
var nbLapins = 0;

function $(v) {
  return document.getElementById(v);
}

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