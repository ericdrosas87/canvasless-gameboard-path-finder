const mapContainer = document.querySelector("#map-container");
let duder;

// To-do: Turn these into classes
let destination = [0,0]; // x, y
let playPos = [0,4]; // x, y

// define map model
let map = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0,0,1,0],
    [2,1,1,1,0,0,0,0,1,0],
    [0,0,1,0,0,0,0,1,1,0],
    [0,0,1,1,1,0,1,1,0,0],
    [0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

// build map view
for(let i = 0; i < map.length; i++) {
    for(let j = 0; j < map.length; j++) {
        let span = document.createElement("div");
        span.style.width = "50px";
        span.style.height = "50px";
        span.style.border = "1px solid black";
        if(map[i][j] > 0) {
            if(map[i][j] == 2) {
                span.id = "start-position";
            }
            span.style.backgroundColor = "green";
            
            // Bind event listeners
            addBlockClickListener(span);
            addBlockHoverListener(span);
        } else {
            span.style.backgroundColor = "blue";
        }
        
        // Add attributes to the view elements to tie the element back to the map model
        span.setAttribute("data-x-pos", j);
        span.setAttribute("data-y-pos", i);

        span.classList.add("game-block");
        span.style.display = "inline-block";
        mapContainer.appendChild(span);
    }
    mapContainer.appendChild(document.createElement("br"));
}

// add event listener to game blocks
function addBlockClickListener(block) {
    block.addEventListener("click", (e) => {
        
        let rect = e.target.getBoundingClientRect();
        let destX = e.target.getAttribute("data-x-pos");
        let destY = e.target.getAttribute("data-y-pos");
        destination[0] = destX;
        destination[1] = destY;

        // Call the algorithm to determine if the move is valid
        let moveIsValid = findPath(playPos[0], playPos[1], 5);
        if(moveIsValid) {
            playPos[0] = destX;
            playPos[1] = destY;
            console.log("move is valid!");
            duder.style.left = rect.left + 7 + "px";
            duder.style.top = rect.top + 7 + "px";
        } else {
            console.log("move is NOT valid!");
        }
        console.log(rect);
    })
}

function addBlockHoverListener(block) {
    block.addEventListener("mouseover", e => {
        destination[0] = e.target.getAttribute("data-x-pos");
        destination[1] = e.target.getAttribute("data-y-pos");
        let moveIsValid = findPath(playPos[0], playPos[1], 5);
        if(moveIsValid) {
            e.target.style.backgroundColor = "yellow";
        } else {
            e.target.style.backgroundColor = "lightgreen";
        }
        
    });
    block.addEventListener("mouseout", e => {
        e.target.style.backgroundColor = "green";
    });
}

// get ref to starting position
let startingBlock = document.querySelector("#start-position");
let startBlockRect = startingBlock.getBoundingClientRect();

// create dude
let dude = document.createElement("div");
dude.style.height = "35px";
dude.style.width = "35px";
dude.style.background = "url(./dude.png)";
dude.style.position = "absolute";
dude.style.transition = "top left 2s ease 0s";
dude.id = "the-dude";
mapContainer.appendChild(dude);

duder = document.querySelector("#the-dude");
duder.style.left = startBlockRect.left + 7 + "px";
duder.style.top = startBlockRect.top + 7 + "px";

function findPath(startX, startY, movesLeft, debug = "") {
    startX = parseInt(startX);
    startY = parseInt(startY);
    let foundTile = false;
    console.log(`x: ${startX}, y: ${startY}, moves: ${movesLeft}, debug: ${debug}`);
    if(movesLeft > 0) {

        // Found destination!
        if(startX == destination[0] && startY == destination[1]) {
            console.log("found destination!!!!!");
            foundTile = true;
        }

        // Try up, down, left, right - recursively
        if(!foundTile && startY != 0 && map[startY - 1][startX] > 0) { // up
            foundTile = findPath(startX, startY - 1, movesLeft - 1, "UP");
        }
        if (!foundTile && startX != 9 && map[startY][startX + 1] > 0) { // right
            foundTile = findPath(startX + 1, startY, movesLeft - 1, "RIGHT");
        }
        if (!foundTile && startY != 9 && map[startY + 1][startX] > 0) { // down
            foundTile = findPath(startX, startY + 1, movesLeft - 1, "DOWN");
        }
        if (!foundTile && startX != 0 && map[startY][startX - 1] > 0) { // left
            foundTile = findPath(startX - 1, startY, movesLeft - 1, "LEFT");
        }

    } 

    return foundTile;
    
}

