function $(v) {
  return document.getElementById(v);
}

var isValidePosition = function(posInit) {
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

var removeIfExist = function(element) {
  if (document.body.contains(element)) {
    element.remove();
  }
}

var randomIntFromInterval = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var toggleCursorColor = function(el) {
  el.addEventListener('mouseenter', () => cursor.setAttribute('material', 'color: springgreen'));
  el.addEventListener('mouseleave', () => cursor.setAttribute('material', 'color: white'));
}

AFRAME.registerComponent('reticule-position', {
	init: function() {
		let cs = document.querySelectorAll('a-cursor');
		if (AFRAME.utils.device.checkHeadsetConnected()) {
			cs[1].remove();
			this.el.object3D.scale.set(1,1,1);
			this.el.setAttribute('animation__click',"property: scale; startEvents: click; from: 0.5 0.5 0.5; to: 1 1 1; dur: 150");
			this.el.setAttribute('look-at','#handGun');
		} else {
			cs[0].remove();
		}
	},
    tick: function() {
		if (AFRAME.utils.device.checkHeadsetConnected()) {
			const gun = $('handGun').object3D;
			const posGun = gun.getWorldPosition();
			const directionGun = gun.getWorldDirection();
			this.el.object3D.position.set(posGun.x-1*directionGun.x,posGun.y-1*directionGun.y,posGun.z-1*directionGun.z);
		}
    }
});
