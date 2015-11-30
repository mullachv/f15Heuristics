
// Global variables
var nMoves = 5;
var nPlayers = 3;
var currentPlayer = 0;
var epsilon = 1e-12;

var mousePosition = document.getElementById('mousePosition');
var message = document.getElementById('message');
var resetButton = document.getElementById('reset');
var scoreBox = document.getElementById('scores');
var canvas = document.getElementById('canvas');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var boardSize = canvasWidth;
var ctx = canvas.getContext('2d');

var moves = []; while(moves.push([]) < nPlayers);
var cache = [];
var scores = [];
var boardControl = [];
var light_colors = genColors(nPlayers, 50, 100);
var dark_colors = genColors(nPlayers, 100, 75);

function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}

function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;

	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));

	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;

	if(s === 0) {
		// Achromatic (grey)
		r = g = b = v;
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;

		case 1:
			r = q;
			g = v;
			b = p;
			break;

		case 2:
			r = p;
			g = v;
			b = t;
			break;

		case 3:
			r = p;
			g = q;
			b = v;
			break;

		case 4:
			r = t;
			g = p;
			b = v;
			break;

		default: // case 5:
			r = v;
			g = p;
			b = q;
	}

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function genColors(total, s, v) {
    var i = 360 / total; // distribute the colors evenly on the hue range
    var r = []; // hold the generated colors
    for (var x=0; x<total; x++)
    {
        r.push(hsvToRgb(i * x, s, v)); // you can also alternate the saturation and value for even more contrast between the colors
    }
    return r;
}

function color2String(color) {
    return "#" + toHex(color[0]) + toHex(color[1]) + toHex(color[2]);
}

// Maintain a cache of squared euclidean distances
function initCache() {
    // Instantiate 2D array
    while(cache.push([]) < boardSize);
    // Fill 2D array
    for (var i=0; i<boardSize; i++) {
        for (var j=0; j<boardSize; j++) {
            var d = i*i + j*j;
            if (i === 0 && j === 0) {
                cache[i].push(1000.0);
            } else {
                cache[i].push(1.0/d);
            }
        }
    }
}

// get mouse position
function getMousePosition(canvas, evt) {
    var x = new Number();
    var y = new Number();
    if (evt.pageX != undefined && evt.pageY != undefined) {
        x = evt.pageX;
        y = evt.pageY;
    } else {
        x = evt.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
        y = evt.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft + 1;
    y -= canvas.offsetTop + 1;
    return {
        x: x,
        y: y
    };
}

function checkGameOver() {
    for (var i=0; i<nPlayers; i++) {
        if (moves[i].length < nMoves) {
            return false;
        }
    }
    return true;
}

function moveValid(x, y) {
    if (x >= boardSize || y >= boardSize || x < 0 || y < 0) {
        return false;
    }
    for (var i=0; i<nPlayers; i++) {
        for (var j=0; j<moves[i].length; j++) {
            if (moves[i][j][0] === x && moves[i][j][1] === y) {
                return false;
            }
        }
    }
    return true;
}

function clearBoard() {
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
}

function initBoard() {
    clearBoard();
    initCache();
}

function resetBoard() {
    clearBoard();
    moves = []; while(moves.push([]) < nPlayers);
    currentPlayer = 0;
    message.innerHTML = "Player 1 to move";
    scoreBox.innerHTML = "";
}

function drawStones() {
    for (var i=0; i<nPlayers; i++) {
        for (var j=0; j<moves[i].length; j++) {
            ctx.fillStyle = color2String(dark_colors[i]);
            ctx.beginPath();
            ctx.arc(moves[i][j][0], moves[i][j][1], 2, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    }
}

function calculateControl() {
    boardControl = new Array();
    for (var i=0; i<boardSize; i++) {
        boardControl[i] = new Array();
        for (var j=0; j<boardSize; j++) {
            boardControl[i][j] = new Array();
        }
    }

    for (var i=0; i<boardSize; i++) {
        for (var j=0; j<boardSize; j++) {

            var pulls = [];
            for (var p=0; p<nPlayers; p++) {
                pulls[p] = 0;
            }

            for (var p=0; p<nPlayers; p++) {
                for (var m=0; m<moves[p].length; m++) {
                    pulls[p] += cache[Math.abs(moves[p][m][0]-i)][Math.abs(moves[p][m][1]-j)];
                }
            }

            var max_val = pulls[0];
            for (var p=1; p<nPlayers; p++) {
                if (pulls[p] > max_val) {
                    max_val = pulls[p];
                }
            }

            for (var p=0; p<nPlayers; p++) {
                if (Math.abs(max_val - pulls[p]) < epsilon) {
                    boardControl[i][j].push(p);
                }
            }

        }
    }
}

function drawBoard() {
    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    var data = imageData.data;

    for (var y=0; y<canvasHeight; y++) {
        for (var x=0; x<canvasWidth; x++) {
            var index = (y * canvasWidth + x) * 4;

            var red = 0;
            var green = 0;
            var blue = 0;
            for (var i=0; i<boardControl[x][y].length; i++) {
                red += light_colors[boardControl[x][y][i]][0];
                green += light_colors[boardControl[x][y][i]][1];
                blue += light_colors[boardControl[x][y][i]][2];
            }
            var n = boardControl[x][y].length;
            data[index]   = red/n;
            data[++index] = green/n;
            data[++index] = blue/n;
            data[++index] = 225;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function calculateScores() {
    scores = [];
    while(scores.push(0) < nPlayers);
    for (var x=0; x<canvasWidth; x++) {
        for (var y=0; y<canvasHeight; y++) {
            n = boardControl[x][y].length;
            for (var p=0; p<n; p++) {
                scores[boardControl[x][y][p]] += 1.0/n;
            }
        }
    }
}

function displayScores() {
    scoreHTML = "";
    for (var p=0; p<nPlayers; p++) {
        if (p === (currentPlayer+1)%nPlayers) {
            scoreHTML += "<div style=\"background-color:" +
                color2String(dark_colors[p]) + ";color:white;font-size:125%\">Player " +
                (p + 1) + ": " + scores[p] + "</div>";
        } else {
            scoreHTML += "<div style=\"background-color:" +
                color2String(dark_colors[p]) + ";color:white\">Player " +
                (p + 1) + ": " + scores[p] + "</div>";
        }
    }
    scoreBox.innerHTML = scoreHTML;
}

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePosition(canvas, evt);
    if (mousePos.x > -1 && mousePos.y > -1) {
        mousePosition.innerHTML = "x:" + mousePos.x + " y:" + mousePos.y;
    }
}, false);

canvas.addEventListener('mouseout', function(evt) {
    mousePosition.innerHTML = "x:? y:?";
}, false);

canvas.addEventListener('click', function(evt) {
    if (checkGameOver()) {
        message.innerHTML = "No more moves";
        return;
    }
    var mousePos = getMousePosition(canvas, evt);
    if (!moveValid(mousePos.x, mousePos.y)) {
        message.innerHTML = "<div style=\"color:red;\">Invalid move</div>";
        return;
    }
    moves[currentPlayer].push([mousePos.x, mousePos.y]);
    clearBoard();
    calculateControl();
    drawBoard();
    drawStones();
    calculateScores();
    displayScores();
    currentPlayer = (currentPlayer + 1) % nPlayers;
    message.innerHTML = "Player " + (currentPlayer + 1) + " to move";
}, false);

resetButton.addEventListener('click', resetBoard, false);

initBoard();
