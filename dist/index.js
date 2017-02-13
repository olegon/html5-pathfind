(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _map = require('./map');

window.addEventListener('load', function () {
    start(window.innerWidth, window.innerHeight);
});

window.addEventListener('resize', function () {
    start(window.innerWidth, window.innerHeight);
});

function getMousePosition(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function start(width, height) {
    var map = new _map.Map(width - 64, height - 64, 32, 32);
    var canvas = document.querySelector('#main-canvas');

    canvas.width = map.getTotalWidth();
    canvas.height = map.getTotalHeight();

    canvas.addEventListener('click', function (e) {
        var clickPosition = getMousePosition(canvas, e);

        map.handleClick(clickPosition);

        drawMap(ctx, map);
    });

    var ctx = canvas.getContext('2d');

    drawMap(ctx, map);
}

function drawMap(ctx, map) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = map.getTiles()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tile = _step.value;

            ctx.save();

            if (tile.blocked) {
                ctx.fillStyle = '#000';
            } else {
                ctx.fillStyle = '#fff';
            }

            ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
            ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);

            ctx.restore();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var path = (0, _map.getPathTo)(map, 0, 0, map.tilesHeightCount - 1, map.tilesWidthCount - 1);
    if (path) {
        console.log(path);
        drawPath(ctx, path);
    }
}

function drawPath(ctx, map) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = map[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var tile = _step2.value;

            ctx.save();

            ctx.fillStyle = '#c00';

            ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
            ctx.strokeRect(tile.x, tile.y, tile.width, tile.height);

            ctx.restore();
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}

},{"./map":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Map = exports.Tile = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getPathTo = getPathTo;

var _stack = require('./stack');

var _stack2 = _interopRequireDefault(_stack);

var _queue = require('./queue');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tile = exports.Tile = function () {
    function Tile(row, column, x, y, width, height) {
        _classCallCheck(this, Tile);

        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        if (Math.random() < 0.25) {
            this.blocked = true;
        } else {
            this.blocked = false;
        }
    }

    _createClass(Tile, [{
        key: 'toggleBlock',
        value: function toggleBlock() {
            this.blocked = !this.blocked;
        }
    }]);

    return Tile;
}();

var Map = exports.Map = function () {
    function Map(width, height) {
        var cellWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
        var cellHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

        _classCallCheck(this, Map);

        this.tilesWidthCount = Math.floor(width / cellWidth);
        this.tilesHeightCount = Math.floor(height / cellHeight);
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        this.tiles = [];

        for (var i = 0; i < this.tilesHeightCount; i++) {
            for (var j = 0; j < this.tilesWidthCount; j++) {
                this.tiles.push(new Tile(i, j, j * cellWidth, i * cellHeight, cellWidth, cellHeight));
            }
        }
    }

    _createClass(Map, [{
        key: 'handleClick',
        value: function handleClick(_ref) {
            var x = _ref.x,
                y = _ref.y;

            var row = Math.floor(y / this.cellWidth);
            var column = Math.floor(x / this.cellHeight);

            var tile = this.tiles.find(function (tile) {
                return tile.row == row && tile.column == column;
            });

            if (tile !== undefined) {
                tile.toggleBlock();
            }
        }
    }, {
        key: 'getTotalWidth',
        value: function getTotalWidth() {
            return this.tilesWidthCount * this.cellWidth;
        }
    }, {
        key: 'getTotalHeight',
        value: function getTotalHeight() {
            return this.tilesHeightCount * this.cellHeight;
        }
    }, {
        key: 'getTiles',
        value: function getTiles() {
            return this.tiles;
        }
    }]);

    return Map;
}();

function getPathTo(map, fromRow, fromColumn, toRow, toColumn) {
    var tiles = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = map.getTiles()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var tile = _step.value;

            tiles[tile.row] = tiles[tile.row] || [];
            tiles[tile.row].push({
                row: tile.row,
                column: tile.column,
                status: tile.blocked,
                mapTile: tile
            });
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    if (tiles[fromRow] && tiles[fromRow][fromColumn] && tiles[fromRow][fromColumn].status === false) {
        var queue = new _queue2.default();

        queue.enqueue(tiles[fromRow][fromColumn]);
        tiles[fromRow][fromColumn].status = -1;

        var found = false;

        while (!queue.empty()) {
            var _currentNode = queue.dequeue();

            if (_currentNode.row == toRow && _currentNode.column == toColumn) {
                found = true;
                break;
            }

            if (_currentNode.row > 0 && tiles[_currentNode.row - 1][_currentNode.column].status == false) {
                tiles[_currentNode.row - 1][_currentNode.column].status = _currentNode.status - 1;
                queue.enqueue(tiles[_currentNode.row - 1][_currentNode.column]);
            }

            if (_currentNode.row < map.tilesHeightCount - 1 && tiles[_currentNode.row + 1][_currentNode.column].status == false) {
                tiles[_currentNode.row + 1][_currentNode.column].status = _currentNode.status - 1;
                queue.enqueue(tiles[_currentNode.row + 1][_currentNode.column]);
            }

            if (_currentNode.column > 0 && tiles[_currentNode.row][_currentNode.column - 1].status == false) {
                tiles[_currentNode.row][_currentNode.column - 1].status = _currentNode.status - 1;
                queue.enqueue(tiles[_currentNode.row][_currentNode.column - 1]);
            }

            if (_currentNode.column < map.tilesWidthCount - 1 && tiles[_currentNode.row][_currentNode.column + 1].status == false) {
                tiles[_currentNode.row][_currentNode.column + 1].status = _currentNode.status - 1;
                queue.enqueue(tiles[_currentNode.row][_currentNode.column + 1]);
            }
        }

        if (found === true) {
            var stack = new _stack2.default();
            var path = [];

            stack.push(tiles[toRow][toColumn]);
            path.push(tiles[toRow][toColumn]);

            while (!stack.empty()) {
                var currentNode = stack.pop();

                path.push(currentNode.mapTile);

                if (currentNode.row > 0 && tiles[currentNode.row - 1][currentNode.column].status == currentNode.status + 1) {
                    stack.push(tiles[currentNode.row - 1][currentNode.column]);
                } else if (currentNode.row < map.tilesHeightCount - 1 && tiles[currentNode.row + 1][currentNode.column].status == currentNode.status + 1) {
                    stack.push(tiles[currentNode.row + 1][currentNode.column]);
                } else if (currentNode.column > 0 && tiles[currentNode.row][currentNode.column - 1].status == currentNode.status + 1) {
                    stack.push(tiles[currentNode.row][currentNode.column - 1]);
                } else if (currentNode.column < map.tilesWidthCount - 1 && tiles[currentNode.row][currentNode.column + 1].status == currentNode.status + 1) {
                    queue.enqueue(tiles[currentNode.row][currentNode.column + 1]);
                    stack.push(tiles[currentNode.row][currentNode.column + 1]);
                }
            }

            return path;
        }
    }

    return null;
}

},{"./queue":3,"./stack":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function () {
    function Queue() {
        _classCallCheck(this, Queue);

        this.v = [];
    }

    _createClass(Queue, [{
        key: "enqueue",
        value: function enqueue(el) {
            this.v.push(el);
        }
    }, {
        key: "dequeue",
        value: function dequeue() {
            if (this.v.length > 0) {
                return this.v.shift(1);
            } else {
                throw new Error("Empty queue.");
            }
        }
    }, {
        key: "size",
        value: function size() {
            return this.v.length;
        }
    }, {
        key: "empty",
        value: function empty() {
            return this.size() == 0;
        }
    }]);

    return Queue;
}();

exports.default = Queue;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stack = function () {
    function Stack() {
        _classCallCheck(this, Stack);

        this.v = [];
    }

    _createClass(Stack, [{
        key: "push",
        value: function push(el) {
            this.v.push(el);
        }
    }, {
        key: "pop",
        value: function pop() {
            if (this.v.length > 0) {
                return this.v.pop();
            } else {
                throw new Error("Empty stack.");
            }
        }
    }, {
        key: "peek",
        value: function peek() {
            if (this.v.length > 0) {
                return this.v[this.v.length - 1];
            } else {
                throw new Error("Empty stack.");
            }
        }
    }, {
        key: "size",
        value: function size() {
            return this.v.length;
        }
    }, {
        key: "empty",
        value: function empty() {
            return this.size() == 0;
        }
    }]);

    return Stack;
}();

exports.default = Stack;

},{}]},{},[1]);
