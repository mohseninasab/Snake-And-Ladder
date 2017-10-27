/*%%%%%%   Global Variables  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

var snake = [];
var ladder = [];
var players = [];
var winners = [];
var lAndSpositions = [];
var tableData = [];
var queue = 0;
var chips = ["blueChips", "redChips", "yellowChips", "greenChips"];
var colorBox = ["blueBox", "redBox", "yellowBox", "greenBox"];
var panposition = "middle";
var gameEnd = false;
var lastPlayer =
    {
        playerId: 0,
        chance: 0
    }
var autoSnake = [{
    beginS: 25,
    endS: 8
}, {
    beginS: 75,
    endS: 28
}, {
    beginS: 55,
    endS: 11
}, {
    beginS: 82,
    endS: 50
}, {
    beginS: 98,
    endS: 3
}];
var autoLadder = [{
    beginL: 70,
    endL: 94
}, {
    beginL: 48,
    endL: 72
}, {
    beginL: 37,
    endL: 78
}, {
    beginL: 59,
    endL: 84
}, {
    beginL: 7,
    endL: 23
}];


//------------------------------------------------
window.onload = function () {
    createTableData();
    //    console.log("tableData-->", tableData);
};


//######################################################################################
// thisfunction called by windows.onload to create an array of objects that hold important data
//like snakes or ladder or position of each element of array in the dom table.
//######################################################################################

function createTableData() {
    var i;
    for (i = 0; i < 100; i++) {
        tableData.push({
            ladder: false, // these are the default values of 
            snake: false, // table 
            occupied: false,
            occupiedBy: -1,
            destination: i,
            endof: "",
            position: {
                row: 0,
                cell: 0
            }
        });
    }
}

//########## [Select Box] ##################################################################
//this function show text Boxes when you select the number of players
//##########################################################################################


function showTextBox() {
    var i;
    var playerNo = parseInt(document.getElementById("selectBox").value); // reccive the number of plater
    var playerBox = document.getElementById("palyerBox");
    players = [];
    playerBox.innerHTML = "";

    console.log("players in Game:", playerNo);

    // this loop will generate nember of dom text box depends on value of Select Box

    for (i = 0; i < playerNo; i++) {
        playerBox.innerHTML += "<p class='playerTitle'>Player " + (i + 1) + "</p><input class='PlayerName'>";
    }
    for (i = 0; i < playerNo; i++) {
        document.getElementsByClassName("PlayerName")[i].value = chips[i];

    }
}
//######### [Button Add Snake] ############################################################

function addSnake() {
    var alphaExp = /^[0-9]+$/;
    var beginOfSnake = parseInt(document.getElementById("addS0").value);
    var endOfSnake = parseInt(document.getElementById("addS1").value);
    var snakeNo = document.getElementById("demoS");

    if (beginOfSnake <= endOfSnake) {
        alert("the head of snake should be higher then it's tail !!!");
        return;
    }
    if (beginOfSnake == 1) {
        alert(" You can't put snake in first room !!");
        return;
    }
    if (beginOfSnake >= 100) {
        alert("The number that you intered is more then 100 !!");
        return;
    }

    if (alphaExp.test(beginOfSnake) && alphaExp.test(endOfSnake)) {
        var check = checkTable(beginOfSnake, endOfSnake);
        if (check == false) {
            alert("chose another Room. \nRoom is occupied !");
            return;
        } else {
            snake.push({
                beginS: beginOfSnake,
                endS: endOfSnake
            });

            tableData[beginOfSnake - 1].snake = true;
            tableData[beginOfSnake - 1].destination = endOfSnake - 1;
            tableData[endOfSnake - 1].endof = "snake";

            document.getElementById("addS0").value = "";
            document.getElementById("addS1").value = "";
        }
    }
    demoS.innerHTML = snake.length;


}
//########## [Button Add Ladder] #########################################################
function addLadder() {
    var alphaExp = /^[0-9]+$/;
    var beginOfLadder = parseInt(document.getElementById("addL0").value);
    var endOfLadder = parseInt(document.getElementById("addL1").value);
    var LadderNo = document.getElementById("demoL");

    if (beginOfLadder >= endOfLadder) {
        alert(" the top of a ladder should be higher then the bottom !!!");
        return;
    }
    if (endOfLadder == 1) {
        alert(" you can't use room 1 as the top of ladder");
        return;
    }
    if (endOfLadder >= 100) {
        alert(" you can't use room 100 as the top of ladder");
        return;
    }
    if (alphaExp.test(beginOfLadder) && alphaExp.test(endOfLadder)) {
        var check = checkTable(beginOfLadder, endOfLadder);
        if (check == false) {
            alert("chose another Room. \nRoom is occupied !");
            return;
        } else {

            ladder.push({
                beginL: beginOfLadder,
                endL: endOfLadder

            });

            tableData[beginOfLadder - 1].ladder = true;
            tableData[beginOfLadder - 1].destination = endOfLadder - 1;
            tableData[endOfLadder - 1].endof = "ladder";

            document.getElementById("addL0").value = "";
            document.getElementById("addL1").value = "";
        }
    }

    LadderNo.innerHTML = ladder.length;
}
//######################################################################################
function autoAdd() {
    var i;
    for (i = 0; i < autoSnake.length; i++) {
        tableData[autoSnake[i].beginS - 1].snake = true;
        tableData[autoSnake[i].beginS - 1].destination = autoSnake[i].endS - 1;
        tableData[autoSnake[i].endS - 1].endof = "snake";
    }
    for (i = 0; i < autoLadder.length; i++) {
        tableData[autoLadder[i].beginL - 1].ladder = true;
        tableData[autoLadder[i].beginL - 1].destination = autoLadder[i].endL - 1;
        tableData[autoLadder[i].endL - 1].endof = "ladder";
    }
    console.log("Auto Add->", tableData);
}
//######################################################################################


function checkTable(input1, input2) {
    var i;
    var legnth = lAndSpositions.length;
    for (i = 0; i < legnth; i++) {
        if (input1 == lAndSpositions[i] || input2 == lAndSpositions[i]) {
            return false;
        }
    }
    lAndSpositions.push(input1);
    lAndSpositions.push(input2);
}

function clear(input) {
    var i, length = input.length;
    for (i = 0; i < length; i++) {
        input.pop();
    }
}

function removeChips() {
    var i;
    var lenght = tableData.length;
    for (i = 0; i < lenght; i++) {
        if (tableData[i].occupied === true) {
            clearRoom(i);
            tableData[i].occupied = false;
            tableData[i].occupiedBy = -1;
        }
    }
    for (i = 0; i < players.length; i++) {
        players[i].position = -1;
        players[i].victory = false;
    }
}

//######### [Button Start] ###############################################################

function SetupGame() {
    var i;
    var alphaExp = /^[0-9a-zA-Z]+$/;
    var textBoxes = document.getElementsByClassName("PlayerName");
    var playerNo = parseInt(document.getElementById("selectBox").value);
    if (playerNo === 1) {
        alert("Please Add player !");
        return;
    }
    if (snake.length === 0 && ladder.length === 0) {
        alert("You didn't Enter ladder And snake !! We take care of it ");
        autoAdd();
    }
    if (snake.length != 0 && ladder.length === 0) {
        alert("Please add more ladders !!!");
        return;
    }
    if (snake.length === 0 && ladder.length != 0) {
        alert("Please add more snakes !!!");
        return;
    }
    for (i = 0; i < playerNo; i++) {
        if (alphaExp.test(textBoxes[i].value)) {
            players.push({
                id: i,
                name: textBoxes[i].value,
                colorCode: i,
                position: -1,
                victory: false,
                record: 0
            });
        } else {
            alert("invalid Player Name !");
            break;
            players = [];
        }
    }
    startGame();
}
//######################################################################################


function newGame() {
    gameEnd = false;
    queue = 0;
    clear(snake);
    clear(ladder);
    clear(players);
    clear(lAndSpositions);
    clear(tableData);
    createTableData();
    document.getElementById("demoL").innerHTML = "0";
    document.getElementById("demoS").innerHTML = "0";
    document.getElementById("movDemo").className = "fade";
    document.getElementById("controlPanel").setAttribute("class", "controller fade");
    document.getElementById("tBoard").setAttribute("class", "tableBoard fade");
    document.getElementById("tableFrame").innerHTML = "";
    if (panposition === "top") {
        document.getElementById("allSetting").setAttribute("class", "moveMiddle");
        document.getElementById("settingBox").setAttribute("class", "setting");
        panposition = "middle"
    }
    document.getElementById("chipField").innerHTML = "";
    setTimeout(PutToMiddle, 500);
}
//###### [Button Reset] ################################################################
function resetGame() {
    gameEnd = false;
    queue = 0;

    if (players.length != 0) {
        removeChips();
        document.getElementById("chipField").innerHTML = "";
        generatecontroller();
    }
}
//######################################################################################

function startGame() {
    if (panposition === "middle") {
        document.getElementById("settingBox").setAttribute("class", "fade");
        document.getElementById("allSetting").setAttribute("class", "moveTop");
        panposition = "top";
    }
    document.getElementById("movDemo").className = "movingDemo downPo";
    document.getElementById("settingBox").setAttribute("class", "fade");
    document.getElementById("allSetting").setAttribute("class", "moveTop");
    setTimeout(PutToTop, 500);
    setTimeout(generateTable, 500);
    setTimeout(generatecontroller, 500);
    console.log("table Data ->",tableData);

}

//######################################################################################
//Animations
function PutToTop() {
    document.getElementById("allSetting").setAttribute("class", "gameSetupBar top");
}

function PutToMiddle() {
    document.getElementById("allSetting").setAttribute("class", "gameSetupBar middle");

}
//######################################################################################

function generateTable() {
    document.getElementById("tBoard").setAttribute("class", "tableBoard visible");
    var table = document.getElementById("tableFrame");
    table.innerHTML = "";
    var i, j, temp, tempObj, k = 100;
    var row, cell;

    for (i = 0; i < 10; i++) {
        row = table.insertRow(i);
        temp = k % 20;
        if (temp === 0) {
            for (j = 0; j < 10; j++) {

                tableData[k - 1].position.row = i;
                tableData[k - 1].position.cell = j;
                tempObj = tableData[k - 1];

                if (tempObj.snake === true) {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<p class='destination'>" + (tempObj.destination + 1) + "</p><h3 class='roomNumber'>" + k + "</h3>";
                    cell.setAttribute("class", "snakeHead");
                }
                if (tempObj.endof === "snake") {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<h3 class='roomNumber'>" + k + "</h3>";
                    cell.setAttribute("class", "snakeTail");
                }
                if (tempObj.ladder === true) {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<p class='destination'>" + (tempObj.destination + 1) + "</p><h3 class='roomNumber '>" + k + "</h3>";
                    cell.setAttribute("class", "bottomLadder");

                }
                if (tempObj.endof === "ladder") {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<h3 class='roomNumber'>" + k + "</h3>";
                    cell.setAttribute("class", "topLadder");

                }
                if (tempObj.snake === false && tempObj.ladder === false && tempObj.endof === "") {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<h3 class='roomNumber'>" + k + "</h3>";

                }
                k--;
            }
        }
        if (temp != 0) {
            k = k - 9;
            for (j = 0; j < 10; j++) {

                tableData[k - 1].position.row = i;
                tableData[k - 1].position.cell = j;
                tempObj = tableData[k - 1];

                if (tempObj.snake === true) {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<p class='destination'>" + (tempObj.destination + 1) + "</p><h3 class='roomNumber'>" + k + "</h3>";
                    cell.setAttribute("class", "snakeHead");
                }
                if (tempObj.endof === "snake") {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<h3 class='roomNumber'>" + k + "</h3>";
                    cell.setAttribute("class", "snakeTail");
                }
                if (tempObj.ladder === true) {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<p class='destination'>" + (tempObj.destination + 1) + "</p><h3 class='roomNumber'>" + k + "</h3>";
                    cell.setAttribute("class", "bottomLadder");
                }
                if (tempObj.endof === "ladder") {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<h3 class='roomNumber'>" + k + "</h3>";
                    cell.setAttribute("class", "topLadder");
                }
                if (tempObj.snake === false && tempObj.ladder === false && tempObj.endof === "") {
                    cell = row.insertCell(j);
                    cell.innerHTML = "<h3 class='roomNumber'>" + k + "</h3>";
                }
                k++;
            }
            k = k - 11;
        }
    }
    console.log("Table Data with Position in Table -->", tableData);
}
//######################################################################################
function popQueue() {
    var answer, i;
    for (i = 0; i < players.length; i++) {
        if (players[i].victory === false) {
            break;
        }
        if (i === players.length - 1) {
            gameEnd = true;
        }
    }
    if (queue >= players.length) {
        queue = 0;
    }
    while (true) {
        if (players[queue].victory === true) {
            queue++;
        }
        if (queue >= players.length) {
            queue = 0;
        }

        if (players[queue].victory === false) {
            answer = queue;
            queue++;
            return answer;
        }
        if (queue >= players.length) {
            queue = 0;
        }
    }
}
//######################################################################################
function showNextDemo(pid) {
    var i;
    pid++;
    if (pid >= players.length) {
        pid = 0;
    }
    //    console.log("pid in Demo->",pid);
    for (i = 0; i < players.length; i++) {
        if (players[i].victory === false) {
            break;
        }
        if (i === players.length - 1) {
            document.getElementById("mDemo").innerHTML = players[pid].name;
            return;
        }
    }
    while (true) {
        if (players[pid].victory === true) {
            pid++;
        }
        if (pid >= players.length) {
            pid = 0;
        }

        if (players[pid].victory === false) {
            document.getElementById("diceBtn").className = colorBox[pid];
            return;
        }
        if (pid >= players.length) {
            pid = 0;
        }
    }
}
//######################################################################################
function addChips(number, clear) {
    if (clear === true) {
        document.getElementById("chipField").innerHTML = "";
    } else if (clear === false) {
        document.getElementById("chipField").innerHTML += "<div class='chipsRoom " + chips[number] + "' id='home" + players[number].id + "' ></div>";
    }
}
//######################################################################################
function generatecontroller() {
    showNextDemo(-1);
    document.getElementById("controlPanel").setAttribute("class", "controller visible");
    var i;
    for (i = 0; i < players.length; i++) {
        addChips(i, false);
    }
}
//######## [Button Roll The Dice] ######################################################
function rollDice() {
    var pId;
    var diceNo = Math.floor(Math.random() * 6) + 1;
    document.getElementById("mDemo3").innerHTML = "";
    if (gameEnd === true) {
        alert("The Game Is Finished");
        return;
    }

    if (lastPlayer.chance === 0) {
        pId = popQueue();
        lastPlayer.playerId = pId;
    } else if (lastPlayer.chance >= 1) {
        pId = lastPlayer.playerId;
        lastPlayer.chance = lastPlayer.chance - 1;
    }
    if (diceNo === 6 && players[pId].position != -1) {
        setTimeout(function(){ document.getElementById("mDemo3").innerHTML = "You got a prize";},300);
        //console.log(chips[pId], "got a prize");
        lastPlayer.chance += 1;
    } else {
        showNextDemo(pId , diceNo);
    }
    movTopAnim(pId ,diceNo);
    console.log(chips[pId], " -> ", diceNo);
    setTimeout(moveChips, 700, diceNo, players[pId].id);

}
//######################################################################################
//Moving Chips in Table

function moveChips(dice, pid) {
    var text, newPos, oldpos;
    oldpos = players[pid].position;
    newPos = oldpos + dice;


    if (oldpos === -1 && dice === 6) {
        if (tableData[0].occupied === true) {
            kickout(tableData[0].occupiedBy);
        }
        text = "home" + pid;
        document.getElementById(text).className = "chipsRoom fade";
        players[pid].position = 0;
        tableData[0].occupied = true;
        tableData[0].occupiedBy = players[pid].id;
        showChipsInTable(players[pid].id, players[pid].position);
        document.getElementById("mDemo3").innerHTML = "You are in";
        return;
    }
     if(oldpos === -1 && dice != 6){
        document.getElementById("mDemo3").innerHTML = "You need 6 to get in";
        return;
    }
    if (oldpos != -1 && (newPos) > 99) {
        var temp =99 - oldpos;
        document.getElementById("mDemo3").innerHTML = "You need "+ temp +" to win";
        return;
    } else if (oldpos != -1 && (newPos) < 99) {

        if (tableData[newPos].occupied === true) {
            kickout(tableData[newPos].occupiedBy);
        }

        clearRoom(oldpos);
        tableData[oldpos].occupied = false;
        tableData[oldpos].occupiedBy = -1;

        players[pid].position = newPos;
        tableData[newPos].occupied = true;
        tableData[newPos].occupiedBy = players[pid].id;
        showChipsInTable(players[pid].id, players[pid].position);

    }
    if (tableData[newPos].destination != newPos && oldpos != -1) {
        setTimeout(jump, 300, pid, tableData[newPos].destination);
    }

    if (newPos === 99) {
        clearRoom(oldpos);
        tableData[oldpos].occupied = false;
        tableData[oldpos].occupiedBy = -1;

        players[pid].position = newPos;
        showChipsInTable(players[pid].id, players[pid].position)
        setTimeout(pushToWinners, 500, pid);
        tableData[99].occupied = false;
        tableData[99].occupiedBy = -1;

    }
    //console.log(tableData);
}

//######################################################################################
// if the chip falls into a room with snake or ladder function "moveChips()" 
//will call this
//######################################################################################

function jump(pid, distin) {

    oldpos = players[pid].position;

    if (tableData[oldpos].snake === true) {
        document.getElementById("mDemo3").innerHTML = "snake";
        var audio = document.getElementById("snakeBell");
        audio.play();
        //alert("!!!! snake  !!!!");
    }
    if (tableData[oldpos].ladder === true) {
        document.getElementById("mDemo3").innerHTML = "ladder";
        var audio = document.getElementById("ladderBell");
        audio.play();
        //alert("*** ladder  ***");
    }

    if (tableData[distin].occupied === true) {
        kickout(tableData[distin].occupiedBy);
    }

    clearRoom(players[pid].position);
    tableData[oldpos].occupied = false;
    tableData[oldpos].occupiedBy = -1;

    players[pid].position = distin;
    tableData[distin].occupied = true;
    tableData[distin].occupiedBy = players[pid].id;
    showChipsInTable(players[pid].id, players[pid].position);

}

//######################################################################################

function showChipsInTable(pid, pos) {
    var table = document.getElementById("tableFrame");
    var tCell = tableData[pos].position.cell;
    var tRow = tableData[pos].position.row;
    //console.log("show in Table ->", tableData[pos].position, pos);

    if (tableData[pos].snake === true) {
        table.rows[tRow].cells[tCell].className = "snakeHead ";
        //console.log("snake Head->");
    } else if (tableData[pos].ladder === true) {
        table.rows[tRow].cells[tCell].className = "bottomLadder ";

    } else if (tableData[pos].endof === "ladder") {
        table.rows[tRow].cells[tCell].className = "topLadder ";

    } else if (tableData[pos].endof === "snake") {
        table.rows[tRow].cells[tCell].className = "snakeTail ";
       // console.log("snake Tail->");

    } else {
        table.rows[tRow].cells[tCell].className = "";

    }

    table.rows[tRow].cells[tCell].className += chips[pid];
    table.rows[tRow].cells[tCell].innerHTML = "";
}

//######################################################################################
// this function will find the table cell that needs to be cleaned 
// the position of every cell in table are saved in the tableData[].position
//######################################################################################

function clearRoom(pos) {
    var temp = tableData[pos];
    var table = document.getElementById("tableFrame");
    var tCell = temp.position.cell;
    var tRow = temp.position.row;
    //    console.log("clear ->", tableData[pos].position, pos);

    if (tableData[pos].snake === true) {
        table.rows[tRow].cells[tCell].className = "snakeHead ";
        table.rows[tRow].cells[tCell].innerHTML = "<p class='destination'>" + (temp.destination + 1) + "</p><h3 class='roomNumber'>" + (pos + 1) + "</h3>";
    } else if (tableData[pos].ladder === true) {
        table.rows[tRow].cells[tCell].className = "bottomLadder ";
        table.rows[tRow].cells[tCell].innerHTML = "<p class='destination'>" + (temp.destination + 1) + "</p><h3 class='roomNumber'>" + (pos + 1) + "</h3>";
    } else if (tableData[pos].endof === "ladder") {
        table.rows[tRow].cells[tCell].className = "topLadder ";
        table.rows[tRow].cells[tCell].innerHTML = "<h3 class='roomNumber'>" + (pos + 1) + "</h3>";

    } else if (tableData[pos].endof === "snake") {
        table.rows[tRow].cells[tCell].className = "snakeTail ";
        table.rows[tRow].cells[tCell].innerHTML = "<h3 class='roomNumber'>" + (pos + 1) + "</h3>";

    } else {
        table.rows[tRow].cells[tCell].className = "";
        table.rows[tRow].cells[tCell].innerHTML = "<h3 class='roomNumber'>" + (pos + 1) + "</h3>";

    }

}
//######################################################################################
//  when two chips placed in one room in table this function will kick out the first 
//  chip in the romm " called from function moveChips() "
//######################################################################################

function kickout(pid) {
    document.getElementById("mDemo3").innerHTML = "kick " + players[pid].name + " out";
    //console.log("kick ", players[pid].name, " out !!"); 
    players[pid].position = -1;
    var text = "home" + pid;
    document.getElementById(text).className = "chipsRoom " + chips[pid];
}
//######################################################################################
// this function will make copy of player that finish the game in array "winners"
//
//######################################################################################


function pushToWinners(pid) {
    clearRoom(99); // this call a function to clean the last 
    alert(players[pid].name + " wins the game !!!");
    players[pid].position = -1; // reset the property position  to default
    players[pid].victory = true; // reset the property position  to default
    players[pid].record += 1; //this increas the number of victories
    winners.push(players[pid]); //copy to winners
}


//######################################################################################
// this function will change the language .
//######################################################################################
function  movTopAnim(pId ,diceNo){
    document.getElementById("movDemo").className = "movingDemo middleToTop";
    setTimeout(movMidAnim,300,pId,diceNo);
}
function movMidAnim(pId,diceNo) {
    document.getElementById("mDemo2").innerHTML = players[pId].name;
    document.getElementById("DiceDemo2").innerHTML = diceNo;
    document.getElementById("movDemo").className = "movingDemo downToMiddle " + colorBox[pId];
    setTimeout(reposition,300,pId,diceNo);
}
function reposition(pId,diceNo){
    document.getElementById("movDemo").className = "movingDemo middlePo "+ colorBox[pId];
}