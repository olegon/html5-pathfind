import Stack from './stack';
import Queue from './queue';

export class Tile {
    constructor (row, column, x, y, width, height) {
        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        if (Math.random() < 0.25) {
            this.blocked = true;
        }
        else {
            this.blocked = false;
        }
    }

    toggleBlock () {
        this.blocked = !this.blocked;
    }
}

export class Map {
    constructor (width, height, cellWidth = 10, cellHeight = 10) {
        this.tilesWidthCount = Math.floor(width / cellWidth);
        this.tilesHeightCount = Math.floor(height / cellHeight);

        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;      

        // TODO: sempre deixar um caminho aberto, porém sem força bruta.

        let tries = 10;

        while (tries-- > 0) {
            this.tiles = [];

            for (let i = 0; i < this.tilesHeightCount; i++) {
                for (let j = 0; j < this.tilesWidthCount; j++) {
                    this.tiles.push(new Tile(i, j, j * cellWidth, i * cellHeight, cellWidth, cellHeight));
                }
            }

            if (getPathTo(this, 0, 0, this.tilesHeightCount - 1, this.tilesWidthCount - 1) != null) break;
        }
    }

    getTileCoordinates(x, y) {
        const row = Math.floor(y / this.cellHeight);
        const column = Math.floor(x / this.cellWidth);

        return {
            row,
            column
        };
    }

    getTileFromCoordinates(row, column) {
        return this.tiles.find((tile) => tile.row == row && tile.column == column);
    }

    handleClick({ x, y }) {
        const { row, column } = this.getTileCoordinates(x, y);

        const tile = this.getTileFromCoordinates(row, column);

        if (tile !== undefined) {
            tile.toggleBlock();
        }
    }

    getTotalWidth() {
        return this.tilesWidthCount * this.cellWidth;
    }

    getTotalHeight() {
        return this.tilesHeightCount * this.cellHeight;
    }

    getTiles() {
        return this.tiles;
    }
}

export function getPathTo(map, fromRow, fromColumn, toRow, toColumn) {
    const tiles = [];

    for (let tile of map.getTiles()) {
        tiles[tile.row] = tiles[tile.row] || [];
        tiles[tile.row].push({
            row: tile.row,
            column: tile.column,
            status: tile.blocked,
            mapTile: tile
        });
    }

    if (tiles[fromRow] && tiles[fromRow][fromColumn] && tiles[fromRow][fromColumn].status === false) {
        const queue = new Queue();

        queue.enqueue(tiles[fromRow][fromColumn]);
        tiles[fromRow][fromColumn].status = -1;

        let found = false;

        while (!queue.empty()) {
            const currentNode = queue.dequeue();

            if (currentNode.row == toRow
                && currentNode.column == toColumn) {
                found = true;
                break;
            }

            if (currentNode.row > 0
                && tiles[currentNode.row - 1][currentNode.column].status == false) {
                tiles[currentNode.row - 1][currentNode.column].status = currentNode.status - 1;
                queue.enqueue(tiles[currentNode.row - 1][currentNode.column]);
            }

            if (currentNode.row < map.tilesHeightCount - 1
                && tiles[currentNode.row + 1][currentNode.column].status == false) {
                tiles[currentNode.row + 1][currentNode.column].status = currentNode.status - 1;
                queue.enqueue(tiles[currentNode.row + 1][currentNode.column]);
            }

            if (currentNode.column > 0
                && tiles[currentNode.row][currentNode.column - 1].status == false) {
                tiles[currentNode.row][currentNode.column - 1].status = currentNode.status - 1;
                queue.enqueue(tiles[currentNode.row][currentNode.column - 1]);
            }

            if (currentNode.column < map.tilesWidthCount - 1
                && tiles[currentNode.row][currentNode.column + 1].status == false) {
                tiles[currentNode.row][currentNode.column + 1].status = currentNode.status - 1;
                queue.enqueue(tiles[currentNode.row][currentNode.column + 1]);
            }
        }

        if (found === true) {
            const stack = new Stack();
            const path = [];

            stack.push(tiles[toRow][toColumn]);
            path.push(tiles[toRow][toColumn]);

            while (!stack.empty()) {
                var currentNode = stack.pop();

                path.push(currentNode.mapTile);

                if (currentNode.row > 0
                    && tiles[currentNode.row - 1][currentNode.column].status == currentNode.status + 1) {
                    stack.push(tiles[currentNode.row - 1][currentNode.column]);
                }
                else if (currentNode.row < map.tilesHeightCount - 1
                    && tiles[currentNode.row + 1][currentNode.column].status == currentNode.status + 1) {
                    stack.push(tiles[currentNode.row + 1][currentNode.column]);
                }
                else if (currentNode.column > 0
                    && tiles[currentNode.row][currentNode.column - 1].status == currentNode.status + 1) {
                    stack.push(tiles[currentNode.row][currentNode.column - 1]);
                }
                else if (currentNode.column < map.tilesWidthCount - 1
                    && tiles[currentNode.row][currentNode.column + 1].status == currentNode.status + 1) {
                    queue.enqueue(tiles[currentNode.row][currentNode.column + 1]);
                    stack.push(tiles[currentNode.row][currentNode.column  + 1])
                }
            }

            return path;
        }
    }

    return null;
}
