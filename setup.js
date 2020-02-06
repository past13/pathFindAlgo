function removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i>=0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a,b) {
    return abs(a.i - b.i) + abs(a.j - b.j);
}

function preventBlockStartAndEnd(diff) {
    //dont block start square
    for(let i = 0; i <= diff; i++) {
        for(let j = 0; j <= diff; j++) {
            grid[i][j].wall = false;
        }
    }
    
    //dont block end square
    for(let i = end.i - diff; i <= end.i; i++) {
        for(let j = end.i - diff; j <= end.j; j++) {
            grid[i][j].wall = false;
        }
    }
}

let cols = 65;
let rows = 65;
let preventBlock = 2;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;

let w, h;
var path = [];

function Spot(i, j) {
    this.i = i;
    this.j = j;

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    //add walls
    if (random(1) < 0.3) {
        this.wall = true;
    }

    this.show = function(col) {
        fill(col);
        noStroke();

        //draw walls
        if (this.wall) {
            fill(0);
        }
        rect(this.i * w, this.j * h, w - 1, h - 1);
    };

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

function setup() {
    createCanvas(400, 400);

    w = width / cols;
    h = height / rows;

    for(var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    start.wall = false;
    end.wall = false;

    preventBlockStartAndEnd(preventBlock);

    openSet.push(start);
}

function draw() {

    if (openSet.length > 0) {

        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];

        if(current === end) {
            noLoop();
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
        console.log('no solution');
        noLoop();
        return;
    }

    background(0);

    for (let i = 0;  i < cols; i++) {
        for (let j = 0;  j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }

    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    for (let i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}