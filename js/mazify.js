var lesmurs;
AFRAME.registerComponent("mazify", {

    init: function () {
        let mazeData = {
            data: mazeArr,
            height: 20,
            width: 20
        }

        let maze = this.el;

        const maze_size = 3;
        const maze_height = 3;
        const el = maze;

        for (var x = 0; x < mazeData.height; x++) {
            for (var y = 0; y < mazeData.width; y++) {

                const i = (y * mazeData.width) + x;

                const position = {
                    x: ((x - (mazeData.width / 2)) * maze_size),
                    y: 1.5,
                    z: (y - (mazeData.height / 2)) * maze_size
                };

                if (mazeData.data[i] >= 1 && mazeData.data[i] <= 2) {
                    let wall = document.createElement('a-box');
                    el.appendChild(wall);

                    wall.setAttribute('width', maze_size);
                    wall.setAttribute('height', maze_height);
                    wall.setAttribute('depth', maze_size);
                    wall.setAttribute('position', position);

                    wall.setAttribute('color', '#fff');
                    wall.setAttribute('material', 'src: #wall; repeat: 2 1');
                } else if (mazeData.data[i] == 's') {
                    let tile = document.createElement('a-box');
                    el.appendChild(tile);

                    tile.setAttribute('width', maze_size);
                    tile.setAttribute('height', 0.1);
                    tile.setAttribute('depth', maze_size);

                    tile.setAttribute('position', {
                        x: position.x,
                        y: 0,
                        z: position.z
                    });


                    tile.setAttribute('material', 'src: #start');
                    tile.setAttribute('id', 'start-tile');

                    let player = document.querySelector("#player");
                    let playerPos = player.getAttribute("position");
                    player.setAttribute('position', {
                        x: position.x,
                        y: playerPos.y,
                        z: position.z
                    })
                } else if (mazeData.data[i] == 'f') {
                    let tile = document.createElement('a-box');
                    el.appendChild(tile);

                    tile.setAttribute('width', maze_size);
                    tile.setAttribute('height', 0.1);
                    tile.setAttribute('depth', maze_size);

                    tile.setAttribute('position', {
                        x: position.x,
                        y: 0,
                        z: position.z
                    });

                    tile.setAttribute('material', 'src: #finish');
                    tile.setAttribute('id', 'finish-tile');
                }
            }
        }

        lesmurs = document.querySelectorAll('a-entity[mazify] a-box');

        setTimeout(() => {
            let loader = document.querySelector("#loader");
            loader.remove();
            let scene = document.querySelector("a-scene");
            scene.setAttribute("style", "display:block");
        }, 1000)
    }
})

function reset() {
    location.reload();
}

function closeDialog(spanClose) {
    spanClose.closest('div.modal').setAttribute("style", "display: none");
}