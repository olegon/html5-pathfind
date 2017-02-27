import { Map, getPathTo } from './map';

window.addEventListener('load', () => {
    start(window.innerWidth, window.innerHeight);
});

window.addEventListener('resize', () => {
    start(window.innerWidth, window.innerHeight);
});

function getMousePosition(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

function removeElementById(id) {
    const element = document.getElementById(id);

    if (element != null) {
        const parent = element.parentElement;

        parent.removeChild(element);
    }
}

function start(width, height) {
    const TILE_SIZE = 24;

    removeElementById('main-canvas');

    const map = new Map(width - 64, height - 64, TILE_SIZE, TILE_SIZE);  

    const body = document.body;
    const canvas = document.createElement('canvas');
    body.appendChild(canvas);

    canvas.id = 'main-canvas';
    canvas.title = 'Clique para liberar ou obstruir parte do caminho.';
    canvas.width = map.getTotalWidth();
    canvas.height = map.getTotalHeight();

    canvas.addEventListener('click', (e) => {
        const clickPosition = getMousePosition(canvas, e);

        map.handleClick(clickPosition);

        drawMap(ctx, map);
    });

    const ctx = canvas.getContext('2d');

    drawMap(ctx, map);
}

function drawMap(ctx, map) {
    for (let tile of map.getTiles()) {
        ctx.save();

        if (tile.blocked) {
            ctx.fillStyle = '#000';
        }
        else {
            ctx.fillStyle = '#fff';
        }

        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);

        ctx.restore();
    }

    const path = getPathTo(map, 0, 0, map.tilesHeightCount - 1, map.tilesWidthCount - 1);
    if (path) {
        drawPath(ctx, path);
    }
}

var timeouts = [];
function drawPath(ctx, path) {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];

    const delay = 5;
    let totalDelay = 0;

    for (let tile of path) {

        let timeout = setTimeout(function () {
            ctx.save();

            ctx.fillStyle = '#c00';
            ctx.strokeStyle = '#000';

            ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
            ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);

            ctx.restore();
        }, totalDelay);   

        timeouts.push(timeout);

        totalDelay += delay;     
    }
}
