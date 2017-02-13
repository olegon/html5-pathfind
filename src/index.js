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

function start(width, height) {
    const map = new Map(width - 64, height - 64, 32, 32);
    const canvas = document.querySelector('#main-canvas');

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
        console.log(path);
        drawPath(ctx, path);
    }
}

function drawPath(ctx, map) {
    for (let tile of map) {
        ctx.save();

        ctx.fillStyle = '#c00';

        ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);

        ctx.restore();
    }
}
