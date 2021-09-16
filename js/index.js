var boardGame = document.getElementById("board-game");
var grid = {};
var players = [];
var weapons = [{
        name: "sword",
        damage: 60
    },
    {
        name: "gun",
        damage: 40
    },
    {
        name: "axe",
        damage: 15
    },
    {
        name: "bowandarrow",
        damage: 45
    }
    
]

class Player {

    constructor(health, weapon, name, position, turn, mode){
        this.health = health,
        this.weapon = weapon,
        this.name = name,
        this.position = position,
        this.turn = turn,
        this.mode = mode
    };

    setHealth(value){
        this.health += value;
    }
    getHealth(){
        return this.health
    }
    //
    setWeapon(value){
        this.weapon = value;
    }
    getWeapon(){
        return this.weapon
    }

    getName(){
        return this.name
    }
    //-----
    setPosition(value){
        this.position= value;
    }
    getPosition(){
        return this.position
    }
    //-----
    setTurn(value){
        this.turn= value;
    }
    getTurn(){
        return this.turn
    }
    //-----
    setMode(value){
        this.mode= value;
    }
    getMode(){
        return this.mode
    }
    //-----
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function getWeapon(option) {
    return weapons[option]
}
//------------------------------------------
function fight(currentPlayer, mode) {

    var nextPlayer = 2 - currentPlayer + 1
    if (players[currentPlayer].getHealth()> 0 && players[nextPlayer].getHealth() > 0) {

      //  if (currentPlayer == 1) {
            alert('Weapon damage' + players[currentPlayer].getWeapon().damage + 'player: ' + currentPlayer + 'next: ' + nextPlayer);

            if (mode == "attack") {
                alert('Attack')
                players[nextPlayer].setHealth(-players[currentPlayer].getWeapon().damage);
                document.getElementById(players[nextPlayer].getName() +"-health").innerHTML = players[nextPlayer].getHealth();
                 //show buttons  of the next player
                document.getElementById("attack" + nextPlayer).classList.remove("hide");
                document.getElementById("defence" + nextPlayer).classList.remove("hide");
                //Hide buttons  of the next player
                document.getElementById("attack" + currentPlayer).classList.add("hide");
                document.getElementById("defence" + currentPlayer).classList.add("hide");

            } else {
                alert("Defence")
                players[currentPlayer].setHealth(players[nextPlayer].getWeapon().damage * 0.5);
                document.getElementById(players[currentPlayer].getName() +"-health").innerHTML = players[currentPlayer].getHealth();
                 //show buttons  of the next player
                 document.getElementById("attack" + nextPlayer).classList.remove("hide");
                 document.getElementById("defence" + nextPlayer).classList.remove("hide");
                 //Hide buttons  of the next player
                 document.getElementById("attack" + currentPlayer).classList.add("hide");
                 document.getElementById("defence" + currentPlayer).classList.add("hide");
            }
      
    } else {
        if (players[nextPlayer].getHealth() > players[currentPlayer].getHealth()) {
            alert('Game Over, the winner is : ' + players[nextPlayer].getName());
            location.reload()
        } else {
            alert('Game Over, the winner is : ' + players[currentPlayer].getName());
            location.reload()
        }
    }
}
//--------------------------------------------------     
function movePlayer(toPosition) {

    let arr = toPosition.split("-")
    var toPosition_i = parseInt(arr[0])
    var toPosition_j = parseInt(arr[1])
    
    for (var currentPlayer = 1; currentPlayer <= 2; currentPlayer++) {
        //alert(currentPlayer)

         if (players[currentPlayer].getTurn()) {
          
            //document.getElementById("turn-first").innerHTML = "In Turn";
            $("#turn-first").html("<p>In Turn</p>");
            
           // document.getElementById("turn-second").innerHTML = "Waiting";
           $("#turn-second").html("<p>Waiting</p>");

            // store old player position in variable to reduce lookups
            let fromPosition_i = players[currentPlayer].getPosition().i
            let fromPosition_j = players[currentPlayer].getPosition().j

            // check if destination isObstacle or isPLayer and is moving within a valid range
            if (!(grid[[toPosition_i, toPosition_j]].isObstacle || grid[[toPosition_i, toPosition_j]].isPlayer) &&
                toPosition_i <= fromPosition_i + 3 &&
                toPosition_i >= fromPosition_i - 3 &&
                toPosition_j <= fromPosition_j + 3 &&
                toPosition_j >= fromPosition_j - 3 &&
                (toPosition_i == fromPosition_i || toPosition_j == fromPosition_j)) {

                document.getElementById(toPosition).classList.add(players[currentPlayer].getName()); // add player CSS to new selected square
                document.getElementById(`${fromPosition_i}-${fromPosition_j}`).classList.remove(players[currentPlayer].getName()); // remove player CSS from old square
                // check for weapon in destination

                // storing and remove location from grid
                grid[[fromPosition_i, fromPosition_j]].isTaken = false // move player from old location
                grid[[fromPosition_i, fromPosition_j]].isPlayer = false

                grid[[toPosition_i, toPosition_j]].isTaken = true // move player to new location
                grid[[toPosition_i, toPosition_j]].isPlayer = true

                if (grid[[toPosition_i, toPosition_j]].isWeapon) {

                    //check if player already has a weapon
                    
                    if(players[currentPlayer].getWeapon().name !="default" ){
                        let currentWeapon = players[currentPlayer].getWeapon();
                        //if yes pick new weapon and drop old one 
                        // assign weapon to player
                        players[currentPlayer].setWeapon(grid[[toPosition_i, toPosition_j]].weapon)
                        document.getElementById(players[currentPlayer].getName() +"-weapon").innerHTML = players[currentPlayer].getWeapon().name + '<br> Power: '+ players[currentPlayer].getWeapon().damage; 
                        // remove weapon from board
                        document.getElementById(toPosition).classList.remove(grid[[toPosition_i, toPosition_j]].weapon.name);
                        //replace weapon on grid
                        grid[[toPosition_i, toPosition_j]].weapon = currentWeapon;
                        // replace weapon on board
                        //document.getElementById(toPosition).classList.add(currentWeapon.name);
                        $("#"+toPosition).addClass(currentWeapon.name);

                    }else{
                    
                    //Just pick weapon and remove weapon from board and grid
                     // assign weapon to player 
                     //alert(currentPlayer);
                     players[currentPlayer].setWeapon(grid[[toPosition_i, toPosition_j]].weapon)
                     document.getElementById(players[currentPlayer].getName() +"-weapon").innerHTML = players[currentPlayer].weapon.name + '<br> Power: '+ players[currentPlayer].weapon.damage; 
                     // remove weapon from board
                     document.getElementById(toPosition).classList.remove(grid[[toPosition_i, toPosition_j]].weapon.name);
                     //remove the weapon from grid
                     grid[[toPosition_i, toPosition_j]].weapon = {};
                     grid[[toPosition_i, toPosition_j]].isWeapon = false;

                    }
 
                }
                console.log(grid[[fromPosition_i, fromPosition_j]])
                console.log(grid[[toPosition_i, toPosition_j]])
                // change player saved position
                players[currentPlayer].setPosition({i:toPosition_i, j: toPosition_j}) 

                //Switching players turns
                var nextPlayer = 2 - currentPlayer + 1

                players[currentPlayer].setTurn(false)
                players[nextPlayer].setTurn(true) // XOR

                //document.getElementById("turn-second").innerHTML = "In Turn";
                $("#turn-second").html("<p>In Turn</p>");

                //document.getElementById("turn-first").innerHTML = "Waiting";
                $("#turn-first").html("<p>Waiting</p>");


                var nextPlayerPostion_i = players[nextPlayer].getPosition().i
                var nextPlayerPostion_j = players[nextPlayer].getPosition().j
                
            }
            console.log(nextPlayerPostion_i, nextPlayerPostion_j)
            console.log(fromPosition_i, fromPosition_j)

            // Check the position of the players 
            if (((nextPlayerPostion_i == toPosition_i + 1 ||
                        nextPlayerPostion_i == toPosition_i - 1) &&
                    nextPlayerPostion_j == toPosition_j) ||

                (nextPlayerPostion_i == toPosition_i &&
                    (nextPlayerPostion_j == toPosition_j - 1 ||
                        nextPlayerPostion_j == toPosition_j + 1))) {

                if (confirm(`Fight : ${players [currentPlayer].getName()}`)) {
                    alert("Choose A Button")
                   
                    document.getElementById("attack" + currentPlayer).classList.remove("hide");
                    
                } else {
                    alert("Cancel The Game & Start Again");
                   
                    location.reload();
                }
            }
            // This line has to terminate the loop
            currentPlayer = 3;
            }
        }
}

function createBoard() {
    let square = "";
    for (var i = 1; i < 11; i++) {
        for (var j = 1; j < 11; j++) {
            grid[[i, j]] = {
                "isTaken": false,
                "isWeapon": false,
                "isObstacle": false,
                "isPlayer": false,
                "weapon": {}
            };
            square += `<div class="box" id="${i}-${j}" onClick=movePlayer("${i}-${j}")></div>`;
        }
    }
    boardGame.innerHTML = square;
}
createBoard()

function addObstacle(boardGame) {
    for (var len = 0; len < 12; len++) {

        var i = getRandom(1, 10)
        var j = getRandom(1, 10)

        if (grid[[i, j]].isTaken) {
            len = len - 1;
        } else {
            grid[[i, j]].isTaken = true
            grid[[i, j]].isObstacle = true
            document.getElementById(`${i}-${j}`).style.background = 'radial-gradient(circle,black,darkgrey)';
        }
    }
}
addObstacle(boardGame)

function addWeapons(boardGame) {

    for (var length = 0; length < 4; length++) {
        var option = length;
        var i = getRandom(1, 10)
        var j = getRandom(1, 10)

        if (grid[[i, j]].isTaken) {
            length = length - 1;
        } else {
            grid[[i, j]].isTaken = true
            grid[[i, j]].isWeapon = true
            grid[[i, j]].weapon = getWeapon(option)
            document.getElementById(i + '-' + j).classList.add(grid[[i, j]].weapon.name);
        }
    }
}
addWeapons(boardGame)


function addPlayers(boardGame) {
   for (var x = 1; x <= 2; x++) {
        var i = getRandom(1, 10)
        var j = getRandom(1, 10)

        if (grid[[i, j]].isTaken) {
            x = x - 1
        } else {
            grid[[i, j]].isTaken = true
            grid[[i, j]].isPlayer = true
            let turn = true;
            if(x!=1){
                turn =false;
             }
             players[x] = new Player(100,
                { name: "default", damage: 1},
                `player-${x}`,
                { i: i, j: j},
                turn,
                "defence"
                 )
            
            document.getElementById(i + '-' + j).classList.add(players[x].getName());
        
        }
        
    }
    //document.getElementById("player-1-health").innerHTML = players[1].getHealth();
    $("#player-1-health").html(players[1].getHealth());

   // document.getElementById("player-2-health").innerHTML = players[2].getHealth();
    $("#player-2-health").html(players[2].getHealth());


    //document.getElementById("attack1").classList.add("hide");
    $("#attack1").addClass("hide");

    //document.getElementById("defence1").classList.add("hide");
    $("#defence1").addClass("hide");

   // document.getElementById("attack2").classList.add("hide");
    $("#attack2").addClass("hide");

    //document.getElementById("defence2").classList.add("hide");
    $("#defence2").addClass("hide");
  
}
addPlayers(boardGame)
