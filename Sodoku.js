const easy1 = [
    "-12--6358-7-843-26863125---3-4-5869-7586--23--96432--72475-1--398--647-263128---5",
    "412976358579843126863125479324758691758619234196432587247591863985364712631287945"
];
const easy2 = [
    "8-63-79-271259--3-4-328-65-124-738--56-8243--3-7-592-6-35-1876-67-432-8-9-8765-2-",
    "856347912712596438493281657124673895569824371387159246235918764671432589948765123"
];
const easy3 = [
    "-1859--42-7462-95--92--41362-948-6-5--135642--659--873846--5-91157-6-38--231485--",
    "618593742374621958592874136239487615781356429465912873846735291157269384923148567"
];
const medium1 = [
    "8-14-9-7---7-325-154--1-9-29-61-4-5-2--97-16--345--2-7762---4-9-85-91--6--9-47-25",
    "821459673697832541543716982976124358258973164134568297762385419485291736319647825"
];
const medium2 = [
    "5873--1--1----49733-4-72--572-8-3--48--9-7-21-3142--8-4-8--92-7-5974--3---3-58-19",
    "587396142162584973394172865726813594845967321931425786418639257259741638673258419"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
];
//Create variables
let timer;
let timeRemaining;
let lives;
let selectedNum;
let selectedTile;
let disableSelect;
let easy = [easy1[0], easy2[0], easy3[0]];
let medium = [medium1[0], medium2[0]];
let boardCheck;

window.onload = function () {
    id("start-btn").addEventListener("click", startGame);
    //Add event listener to each number in number-container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            //If selecting is not disabled
            if (!disableSelect) {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //Deselect all other numbers
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    //Select it and update selectedNum
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

function startGame() {
    let board;
    if (id("diff-1").checked) board = easy[Math.floor(Math.random() * 3)];
    else if (id("diff-2").checked) board = medium[Math.floor(Math.random() * 2)];
    else board = hard[0];
    boardCheck = board;
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining 3";
    generateBoard(board);
    //Start the timer
    startTimer();
    //Set theme
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }
    //Show number-container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    //Set timer for first second
    id("timer").textContent = timeConversion(timeRemaining);
    timer = setInterval(function () {
        timeRemaining--;
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}

function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    //clear previous board
    clearPrevious();
    let idCount = 0;
    //Creat 81 tiles
    for (let i = 0; i < 81; i++) {
        //Creat a new paragraph element
        let tile = document.createElement("p");
        if (board.charAt(i) !== "-") {
            tile.textContent = board.charAt(i);
        } else {
            //Add click event listener to tile
            tile.addEventListener("click", function () {
                //If selecting is not disabled
                if (!disableSelect) {
                    //If the tile is already selected
                    if (tile.classList.contains("selected")) {
                        //Then remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        //Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        //Assign tile id
        tile.id = idCount;
        //Increment for next tile
        idCount++;
        //Add tile class to all tiles
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6) {
            tile.classList.add("rightBorder");
        }
        //Add tile to board
        id("board").appendChild(tile);
    }
}

function updateMove() {
    //If a tile and a number is selected
    if (selectedTile && selectedNum) {
        //Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        //If the number matches the corresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            //Deselects the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //Clear the selected variables
            selectedNum = null;
            selectedTile = null;
            //Check if board is completed
            if (checkDone()) {
                endGame();
            }
        } else {
            //Disable selecting new number for one second
            disableSelect = true;
            //Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one second
            setTimeout(function () {
                lives--;
                //If no lives left end game
                if (lives === 0) {
                    endGame();
                } else {
                    //If lives is not equal to zero
                    id("lives").textContent = "Lives Remaining: " + lives;
                    disableSelect = false;
                }
                //Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //Clear the tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }
    }
}

function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame() {
    //Disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);
    if (lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You Lost, Try it again ...";
    } else {
        id("lives").textContent = "You Won, Congratulations !";
    }
}

function checkCorrect(tile) {
    //Set solution based on difficulty selection
    let solution;
    if (id("diff-1").checked) {
        if (boardCheck === easy1[0]) solution = easy1[1];
        else if (boardCheck === easy2[0]) solution = easy2[1];
        else solution = easy3[1];
    } else if (id("diff-2").checked) {
        if (boardCheck === medium1[0]) solution = medium1[1];
        else solution = medium2[1];
    } else solution = hard[1];
    //If tile's number is equal to solution's number
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}

function clearPrevious() {
    let tiles = qsa(".tile");
    //Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    //If there is a timer clear it
    if (timer) clearTimeout(timer);
    //Deselect any numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
}

function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

window.addEventListener('click', musicPlay);

function musicPlay() {
    document.getElementById('music').play();
    // document.getElementById('music').pause();
    window.removeEventListener('music', musicPlay);
}