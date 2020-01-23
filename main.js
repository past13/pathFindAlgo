function removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i>=0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a,b) {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}   

let globalTimeout;

let cols = 20;
let rows = 20;

let grid = new Array(cols);
let start;
let end;
let openSet = [];
let closedSet = [];

function Spot(i, j) {
    this.i = i;
    this.j = j;

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];

    this.show = function(color) {
        var c = document.getElementById("CursorLayer");
        var ctx = c.getContext("2d");

        ctx.fillStyle = color;
        ctx.fillRect(2 * i * 10, 2 * j * 10, 19, 19);
    }

    this.addNeighbors = function(grid) {
        let i = this.i;
        let j = this.j;

        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    }
}

async function startAlgo() {
    let promise = new Promise((resolve, reject) => {
        createCanvas();
        let setupResult = setup();
        if (setupResult) {
            resolve(setupResult);
        } else {
            reject("something went wrong");
        }
    });

let result = await promise; 
    if (result) {
        globalTimeout = window.setInterval(animate, 10);
    }
}

function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.id = "CursorLayer";
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.zIndex = 8;
    canvas.style.border = "1px solid";
    canvas.style.backgroundColor = "black"; 
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas); 
    return true;
}

function setup() {
    for(var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    openSet.push(start);
    return true;
}

function animate() {
    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];

        if(current === end) {
            clearTimeout(globalTimeout);
            console.log("Done");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1;
                
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;   
                neighbor.previous = current;
            }
        }
    } else {
        console.log('work done');
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j].show("white");
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show("red");
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show("green");
    }
}

startAlgo();