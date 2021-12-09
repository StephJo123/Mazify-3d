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

var removeIfVrOrNot = function(target) {
	let cs = document.querySelectorAll(target);
	if (cs.length == 2) {
		(AFRAME.utils.device.checkHeadsetConnected()) ? cs[1].remove() : cs[0].remove();
	}
}

AFRAME.registerComponent('reticule-position', {
	init: function() {
		removeIfVrOrNot('a-cursor');
	},
    tick: function() {
		if (AFRAME.utils.device.checkHeadsetConnected()) {
			const ogun = $('gun-model');
			const gun = (ogun) ? ogun.object3D : $('handGun').object3D;
			let posGun = new THREE.Vector3();
			gun.getWorldPosition(posGun);
			const directionGun = new THREE.Vector3();
			gun.getWorldDirection(directionGun);
			this.el.object3D.position.set(posGun.x-1*directionGun.x,posGun.y-1*directionGun.y,posGun.z-1*directionGun.z);
		}
    }
});

AFRAME.registerComponent('id-compteur-vr',{
	init: function() {
		let c = document.querySelectorAll('a-entity.compteur');
		if (c.length == 2) {
			c = c[(AFRAME.utils.device.checkHeadsetConnected()) ? 0 : 1];
			c.setAttribute('id','compteur');
			if (AFRAME.utils.device.checkHeadsetConnected()) {
				c.setAttribute('look-at','#camera');
			}
		}
	},
	tick: function() {
		const acomp = $('compteur');
		if (AFRAME.utils.device.checkHeadsetConnected() && acomp != null){
			const handLeft = $('gauche').object3D;
			let t = new THREE.Vector3();
			handLeft.getWorldPosition(t);
			acomp.object3D.position.set(t.x,t.y+0.2,t.z);
		}
	}
})
