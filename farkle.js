// stores minimum and maximum number of players
var minPlayers = 1;
var maxPlayers = 5;

// stores actual number of players
var numPlayers;

// this array stores team names
var teams = [];

// stores score limit or turns limit
var limit;

// this array keeps track of scores (change if maxPlayers changes)
var scores = [0,0,0,0,0];

// this array keeps track of farkles for each player (change if maxPlayers changes)
var farkles = ["","","","",""];

// separates first roll (where we'll attach a team name to each die) from the rest
var first_roll;

// this array stores winner(s) for first roll
var winners = [];

// this array stores dice to show for each roll (and empty space where no dice exist)
var diceMatrix = [];

// stores number of dice (and empty space) that can fit in the dice area
var dice_volume = 45;

// stores number of dice to roll
var numDice = 0;

// stores current player
var current;

// this array stores the die in the keeper div
var keepers = [];

// this array keeps track of the hidden spaces in the dice area (helps with removeKeeper())
var hidden = [];

// this array keeps track of the keepers for each roll
var theseKeepers = [];

// keeps track of the roll score for each team
var rollScore = 0;

// keeps track of the turn score for each team
var turnScore = 0;

// this array keeps track of the dice rolled
var thisRoll = [];

// keeps track of whether last roll was a farkle (starting with true inhibits endTurn())
var farkle = true;

// indicates status of rollForYourLife mode (-1 = off, 0 = waiting to start, 1 = on)
var lastRoll = -1;

// store team to beat (first to meet score limit)
var teamToBeat;

// this array keeps track of the turns for each team
var turns = [];

// keeps track of whether a player already rolled
var rolled = false;

// keeps track of highest turn score for single player
var highTurn = 0;

// indicates whether single player wants to play to number of turns or a score
var limit_turns;

// this array stores strings of HTML for images of each die (and an empty string for the empty space)
var dice = ["",
		   "<img id='die1' src='1.png' alt='1' height='65' width='65' style='float: left;'></img>",
	   	   "<img id='die2' src='2.png' alt='2' height='65' width='65' style='float: left;'></img>",
	   	   "<img id='die3' src='3.png' alt='3' height='65' width='65' style='float: left;'></img>",
	  	   "<img id='die4' src='4.png' alt='4' height='65' width='65' style='float: left;'></img>",
	   	   "<img id='die5' src='5.png' alt='5' height='65' width='65' style='float: left;'></img>",
	  	   "<img id='die6' src='6.png' alt='6' height='65' width='65' style='float: left;'></img>"];

// displays the "players" form (hides dice area because they occupy the same space)
function setup() {
	$("#dice_area").hide();
	$("#players").hide().fadeIn(600); // (we have to hide it before we can fade it in)
}

// stores number of players; prepares and displays the "names" form
function done1() {
	// store the number of players
	numPlayers = document.getElementById("numPlayers").value;
	
	// for each player..
	for (var t = 0; t < numPlayers; t++) {
		// add a zero to turns
		turns.push(0);
	}
	
	// if it's single player..
	if (numPlayers == 1) {
		// start with six dice
		numDice = 6;
	}
	
	// if the indicated number of players is between the min and max..
	if (numPlayers >= minPlayers && numPlayers <= maxPlayers) {
		// stores HTML string
		var names = "";
		
		// fade out the done button, then populate "names" form accordingly
		$("#players").fadeOut(600, function() {
			// if it's single player..
			if (numPlayers == 1) {
				// onePlayer instructions
				names += "<font size='4'>What is your name? </font>";
				
				// input box
				names += "<input name='team1' type='text' size='10'></input>";
			} else { // otherwise..
				// build the string piece by piece
				for (var n = 1; n <= numPlayers; n++) {
					// instructions
					names += "<p><font size='4'>Team " + n + ", please choose a name. </font>";
				
					// input box
					names += "<input name='team" + n + "' type='text' size='10' value='Team " + n + "'></input></p>";
				}
			}
			// add a "done" button
			names += "<p><input id='done2' type='Submit' value='Done'></input></p>";
			
			// hide, populate, then fade in the HTML
			$("#names").hide().html(names).fadeIn(600);
		});
	} else { // otherwise..
		// leave done1()
		return;
	}
}

// stores team names; prepares and displays the "limit" form
function done2() {
	// store each team name (change if maxPlayers changes)
 	for (var n = 1; n <= numPlayers; n++) {
		if (n == 1) {
			teams.push(document.names.team1.value);
		} else if (n == 2) {
			teams.push(document.names.team2.value);
		} else if (n == 3) {
			teams.push(document.names.team3.value);
		} else if (n == 4) {
			teams.push(document.names.team4.value);
		} else if (n == 5) {
			teams.push(document.names.team5.value);
		}
  	}
	
	// stores HTML string
	var str = "";
	
	// fade out "names" form..
	$("#names").fadeOut(600, function() {
		// if it's single player..
		if (numPlayers == 1) {
			// instructions
			str += "<font size='4'>In single player mode, you can either play to a certain score limit or you can choose to roll a certain number of turns.";
			
			// options
			str += "<p>What would you like to do?</p></font>";
			
			// set score button
			str += "<p><input id='setLimit' type='Submit' value='Set Score Limit' onClick='javascript: setLimit();'></input>&nbsp;&nbsp;&nbsp;";
			
			// set turns button
			str += "<input id='setTurns' type='Submit' value='Set Number of Turns' onClick='javascript: setTurns();'></input></p>";
			
			// update and fade in "options" form
			$("#options").hide().html(str).fadeIn(600);
		} else {
			// set limit_turns to limit
			limit_turns = "limit";
			
			// display "limit" form
			setLimit();
		}
	});
}

// prepare and display "limit" form
function setLimit() {
	// fade out "options" form..
	$("#options").fadeOut(600, function() {
		// stores HTML string
		var str = "";
	
		// instructions
		str += "<font size='4'>Please choose a score limit</font>";

		// radio buttons
		str += "<p><input type='radio' name='limit' value='5000'><font size='4'> 5,000</font></input>";
		str += "<br><input type='radio' name='limit' value='10000'><font size='4'> 10,000</font></input>";
		str += "<br><input type='radio' name='limit' value='20000'><font size='4'> 20,000</font></input></p>";

		// begin button
		str += "<p><input id='begin' type='Submit' value='Begin'></input></p>";

		// hide, populate, then fade in the HTML
		$("#limit").hide().html(str).fadeIn(600);
		
		// set limit_turns to limit
		limit_turns = "limit";
	});
}

// prepare and display "turns" form
function setTurns() {
	// fade out "options" form..
	$("#options").fadeOut(600, function() {
		// stores HTML string
		var str = "";
	
		// instructions
		str += "<font size='4'>Please choose a number of turns</font>";

		// radio buttons
		str += "<p><input type='radio' name='turns' value='5'><font size='4'> 5</font></input>";
		str += "<br><input type='radio' name='turns' value='10'><font size='4'> 10</font></input>";
		str += "<br><input type='radio' name='turns' value='20'><font size='4'> 20</font></input></p>";

		// begin button
		str += "<p><input id='begin' type='Submit' value='Begin'></input></p>";

		// hide, populate, then fade in the HTML
		$("#turns").hide().html(str).fadeIn(600);
		
		// set limit_turns to turns
		limit_turns = "turns";
	});
}

// stores score limit; prepares and displays the scoreboard
function begin() {
	// if limit_turns set to limit..
	if (limit_turns == "limit") {
		// store the indicated limit
		limit = $('input[name=limit]:checked').val();
	} else { // otherwise..
		// store the indicated number of turns
		limit = $('input[name=turns]:checked').val();
	}
	
	// if a radio button was chosen..
	if (limit != undefined) {
		// fade out "limit" form
		$("#limit").fadeOut(600);
		
		// fade out "turns" form
		$("#turns").fadeOut(600);
		
		// fade out, populate, then fade in the scoreboard and "roll" form or empty dice area
		$("#scoreboard").fadeOut(600, function() {
			// stores HTML string
			var str = "";
			
			// build the string piece by piece
			for (var n = 0; n < numPlayers; n++) {
				// team name
				str += "<p><div id='team" + n + "'>" + teams[n] + "</div>";
				
				// score (0 to start)
				str += "<div id='score" + n + "' style='color: #FFFFFF;'>" + scores[n] + "</div>";
				
				// farkles (just an empty rectangle to start)
				str += "<div id='farkles" + n + "' style='height: 20px; width: 35; border: 1px solid;'>" + farkles[n] + "</div></p>";
			}
				
			// if it's single player..
			if (numPlayers == 1) {
				// add turn ticker (just an empty rectangle to start)
				str += "<font size='2'>Turns<br><div id='ticker' style='color: #FFFFFF;'>" + turns[0] + "</div>";
				
				// add high turn score (just an empty rectangle to start)
				str += "High Score<br><div id='highScore' style='color: #FFFFFF;'>" + highTurn + "</div></font></p>";
			}
			
			// populate scores
			$("#scores").html(str);
			
			// now fade in the scoreboard
			$("#scoreboard").fadeIn(600, function() {
				// for multiple players..
				if (numPlayers > 1) {
					// hide, populate, and fade in "roll" form
					$("#roll").hide().html("<font size='4'>Roll to see who goes first.</font>").fadeIn(600);
					
					// set first roll equal to true
					first_roll = true;
				} else { // for single player..
					// skip first roll
					first_roll = false;
					
					// set current player
					current = 0;
					
					// fade in dice area
					$("#dice_area").fadeIn(600);
				}
			});
		});
	} else { // otherwise..
		// leave begin()
		return;
	}
}

// rolls appropriate number of dice
function rollDice() {
	// clear thisRoll
	thisRoll = [];
	
	// if this is the first roll..
	if (first_roll == true) {
		// fade out "roll" form
		$("#roll").fadeOut(600, function() {
			// fade in dice area
			$("#dice_area").fadeIn(600, function() {
				// if this is the first attempt..
				if (numDice == 0) {
					// one die per player
					numDice = numPlayers;
				}
				
				// randomize dice
				randomizeDice();
				
				// build HTML string for teams; store dice
				buildString();
				
				// find winner(s) among thisRoll array
				findWinners();
			});
		});
 	} else if (first_roll == false) { // if the first roll is over (or never occurred)..
 		// assume a roll is not allowed
 		var doRoll = false;
 		
		// if there are no keepers overall (i.e. it's first roll of the turn) or for this roll..
		if (keepers == 0 && rolled == false) {
			// roll is allowed
			doRoll = true;
		} else if (theseKeepers.length != 0) { // if there are keepers from this roll..
			// roll is allowed
			doRoll = true;
		}
		
		// if lastRoll is not in wait mode and a roll is allowed..
		if (lastRoll != 0 && doRoll == true) {
			// check keepers for unused dice
			var calculate = calculateScore(keepers);
		
			// retrieve array of extras
			var extras = calculate.extra;
		
			// if any keepers were not scored..
			if (extras.length > 0) {
				// for each extra..
				for (var e = 0; e < extras.length; e++) {
					// find the indices of extra in keepers
					var extraIndices = findIndices(keepers, extras[e]);
				
					// store ids of keepers
					var ids = getKeeperIDs();
				
					// store the id of the last instance of extra from keepers
					var extraID = ids[extraIndices[extraIndices.length - 1]];
				
					// store extra div
					var thisExtra = document.getElementById(extraID);
		
					// "Javascript won't let an element commit suicide, but it does permit infanticide..." - Mark Henderson
					thisExtra.parentNode.removeChild(thisExtra);
				
					// remove keeper from keepers array
					keepers.splice(extraIndices[extraIndices.length - 1], 1);
				
					// add a die to numDice
					numDice++;
				}
			}
		
			// if there are no dice left (all six are keepers)..
			if (numDice == 0) {
				// clear keepers
				clearKeepers();
			}
		
			// store score from last roll
			rollScore = turnScore;
		
			// clear keepers from last roll
			theseKeepers = [];
		
			// stores HTML string
			var str = "";
		
			// randomize dice
			randomizeDice();
		
			// build the string piece by piece
			for (var d = 0; d < dice_volume; d++) {
				// store the number at location d in the dice matrix
				var thisSpace = diceMatrix[d];
			
				// add appropriate image or empty space
				str += "<div id='space" + d + "' style='height: 65px; width: 65px; float: left;' onClick='javascript: addKeeper(this.id);'>" + dice[thisSpace] + "</div>";
			}
		
			// populate and show dice area
			$("#dice_area").html(str).show();
			
			// team has rolled this turn
			rolled = true;
		
			// check for farkles
			checkForFarkles();
		}
 	} else { // otherwise..
		// leave rollDice()
		return;
	}
}

// clear keepers and hidden arrays
function clearKeepers() {
	// store ids of keepers
	var ids = getKeeperIDs();
	
	// step through the ids array and remove each div
	for (var i = 0; i < ids.length; i++) {
		// store keeper
		var thisKeeper = document.getElementById(ids[i]);
		
		// "Javascript won't let an element commit suicide, but it does permit infanticide..." - Mark Henderson
		thisKeeper.parentNode.removeChild(thisKeeper);
	}
	
	// clear keepers array
	keepers = [];
	
	// clear hidden array
	hidden = [];
	
	// roll six dice
	numDice = 6;
}

// randomize the dice (think of it as shaking a cup of dice)
function randomizeDice() {
	// fill dice matrix (cup) with zeros (air)
	for (var z = 0; z < dice_volume; z++) {
		diceMatrix[z] = 0;
	}
	
	// randomize dice and place them at the beginning of the dice matrix (put in dice)
	for (var n = 0; n < numDice; n++) {
		// returns a random number between 1 and 6 (inclusive) and stores it in the dice matrix
		diceMatrix[n] = Math.floor(Math.random()*6)+1;
		
		// after the first roll..
		if (first_roll == false) {
			// store die for this roll
			thisRoll.push(diceMatrix[n]);
		}
	}
	
	// shuffle the dice matrix (shake cup)
	diceMatrix = shuffle(diceMatrix);
}

// builds the HTML string for a roll
function buildString() {
	// fill thisRoll with zeros
	for (var r = 0; r < numPlayers; r++) {
		thisRoll[r] = 0;
	}
	
	// stores the HTML string
	var str = "";
	
	// keeps track of which team names have been used
	var teamIndex = 0;
	
	// build the string piece by piece
	for (var d = 0; d < dice_volume; d++) {
		// store the number at location d in the dice matrix
		var thisSpace = diceMatrix[d];
		
		// add appropriate image (1-6 = dice) or empty space (0 = empty space)
		str += "<div id='space" + d + "' style='height: 90px; width: 65px; float: left;'>" + dice[thisSpace];
		
		// if there is a die in this space..
		if (thisSpace > 0) {
			// if there was previously a tie..
			if (winners.length > 0) {
				// assign a winning team name
				str += "<br><center>" + teams[winners[teamIndex]] + "</center></div>";
				
				// store die number in array
				thisRoll[winners[teamIndex]] = thisSpace;
			} else if (first_roll == true) { // otherwise (and it's still the first roll)..
				// assign next team name
				str += "<br><center>" + teams[teamIndex] + "</center></div>";
				
				// store die number in array
				thisRoll[teamIndex] = thisSpace;
			}
			
			// increment index
			teamIndex++;
		} else { // otherwise..
			// finish the string without a team name
			str += "</div>";
		}
	}
	
	// reset winners
	winners = [];
	
	//populate dice area
	$("#dice_area").html(str);
}

// determines winners of first roll; results in tie-breaker or start of game
function findWinners() {
	// determine highest number
	var highest = Math.max.apply(Math, thisRoll);
	
	// store indices of highest number in thisRoll array
	winners = findIndices(thisRoll, highest);
	
	// if there are more than one winners..
	if (winners.length > 1) {
		// winners need to roll again
		numDice = winners.length;
	} else { // otherwise..
		// it's not the first roll anymore
		first_roll = false;
		
		// set the current player
		current = winners[0];
		
		// store div id for current player
		var currentDiv = document.getElementById("team" + current);
		
		// increase font size
		currentDiv.innerHTML = "<font size='5'>" + teams[current] + "</div>";
		
		// start with 6 dice
		numDice = 6;
	}
}

// checks for farkle(s); updates turnScore, scoreboard, and dice area
function checkForFarkles() {
	// check dice area for a score
	var calculate = calculateScore(thisRoll);
	
	// store score of dice in dice area
	var diceArea = calculate.score;
	
	// if there are no scoreable dice in dice area..
	if (diceArea == 0) {
		// update farkles for current player
		farkles[current] += "F";

		// store div for score of appropriate team
		var teamFarkles = document.getElementById("farkles" + current);

		// populate scoreboard
		teamFarkles.innerHTML = "<font color='#FF0000'>" + farkles[current] + "</font>";
		
		// reset turnScore
		turnScore = 0;
		
		// reset rollScore
		rollScore = 0;
		
		// store div for tempScore
		var tempDiv = document.getElementById("tempScore");

		// empty tempScore
		tempDiv.innerHTML = "<font color='#FFFFFF'>" + turnScore + "</font>";
		
		// if team has three farkles..
		if (farkles[current] == "FFF") {
			// subtract 500 points from team score
			scores[current] -= 500;
			
			// store score div of appropriate team
			var teamScore = document.getElementById("score" + current);

			// populate scoreboard
			teamScore.innerHTML = scores[current];
			
			// reset team farkles
			farkles[current] = "";
			
			// populate scoreboard
			teamFarkles.innerHTML = "";
		}
		
		// clear keepers
		clearKeepers();
		
		// store div id for current player
		var currentDiv = document.getElementById("team" + current);
		
		// decrease font size
		currentDiv.innerHTML = teams[current];
		
		// increment turns for current team
		turns[current] += 1;
		
		// if it's single player..
		if (numPlayers == 1) {
			// add new turns to ticker
			$("#ticker").html(turns[current]);
		}
		
		// move to next team
		current++;
		
		// if current is larger than number of players
		if (current >= numPlayers) {
			// go to first player
			current = 0;
		}
		
		// store div id for current player
		var currentDiv = document.getElementById("team" + current);
		
		// increase font size
		currentDiv.innerHTML = "<font size='5'>" + teams[current] + "</div>";
		
		// next player has not rolled yet this turn
		rolled = false;
		
		// check for a winner
		checkForWinner();
		
		// set farkle to true
		farkle = true;
	} else { // otherwise..
		// set farkle to false
		farkle = false;
	}
}

function checkForWinner() {
	// if current is zero..
	if (current == 0) {
		// last team to go is last in teams array
		var lastToGo = numPlayers - 1;
	} else { // otherwise..
		// subtract 1 from current
		var lastToGo = current - 1;
	}
	
	// if lastRoll mode is on and all players went..
	if (lastRoll == 1 && current == teamToBeat) {
		// determine the winner
		determineWinner();
	} else { // otherwise..
		// if limit_turns is set to limit..
		if (limit_turns == "limit") {
			// get the score of the last player to go
			var checker = scores[lastToGo];
		} else { // otherwise..
			// get the number of turns of the last player to go
			var checker = turns[lastToGo];
		}
		
		// if score or turns for last player is greater than or equal to limit..
		if (checker >= limit) {
			// stores the HTML string
			var str = "";
			
			if (limit_turns == "limit") {
				// announcement
				str += "<font size='5'>" + teams[lastToGo] + ", you reached " + limit + " points!<br><br>";
			} else { // otherwise..
				// announcement
				str += "<font size='5'>" + teams[lastToGo] + ", you reached " + limit + " turns!<br><br>";
			}
		
			// for all but the winner..
			for (var t = 0; t < teams.length; t++) {
				// if t isn't the winner
				if (t != lastToGo) {
					// add team name
					str += teams[t] + "<br>";
				}
			}
		
			str += "</font>";
		
			// rollForYourLife button
			str += "<p><input id='rollForYourLife' type='Submit' value='Roll For Your Life'></input></p>";
		
		
			// announce the teamToBeat!
			$("#lastRoll").hide().html(str).fadeIn(600);
		
			// store teamToBeat
			teamToBeat = lastToGo;
		
			// set lastRoll to waiting mode
			lastRoll = 0;
		}
	}
}

// removes die from dice area and adds a new instance of it to keepers
function addKeeper(id) {
	// if last roll was not a farkle..
	if (farkle == false) {
		// store the div of the space
		var space = document.getElementById(id);
	
		// store the die (getElementsByTagName() returns values in an array)
		var die = space.getElementsByTagName("img");
	
		// if there isn't a die in this space..
		if (space.innerHTML == "") {
			// leave the function
			return;
		}
	
		// hide the space (makes it a lot easier to display again, if necessary)
		space.style.visibility = "hidden";
	
		// add id of hidden space to hidden array
		hidden.push(space.id);
	
		// pull alt from die in array (parseInt() converts it from a string to an integer); add it to keepers array
		keepers.push(parseInt(die[0].alt));
	
		// store keeper for this roll
		theseKeepers.push(parseInt(die[0].alt));
		
		// check for score among theseKeepers
		var calculate = calculateScore(theseKeepers);
	
		// update score for current player
		turnScore = calculate.score + rollScore;
	
		// store div for score of appropriate team
		var tempDiv = document.getElementById("tempScore");

		// populate tempScore
		tempDiv.innerHTML = "<font color='#FFFFFF'>" + turnScore + "</div>";
	
		// stores HTML string
		var str = "";
	
		// build HTML string with each keeper
		for (var k = 0; k < keepers.length; k++) {
			// add keeper
			str += "<div id='keeper" + k + "' style='height: 65px; width: 65px; float: left;' onClick='javascript: removeKeeper(this.id);'>" + dice[keepers[k]] + "</div>";
		}
	
		// populate keepers
		$("#keepers").html(str);
	
		// roll one less die on the next roll
		numDice--;
	} else { // otherwise..
		// do nothing
		return;
	}
}

// removes die from keepers and displays it again in the dice area
function removeKeeper(id) {
    // store ids of keepers
	var ids = getKeeperIDs();
	
	// store index of selected keeper
	var keeperIdx = ids.indexOf(id);
	
	// store space of keeper in dice area
	var space = document.getElementById(hidden[keeperIdx]);
	
	// store indices of space id in hidden array
	var duplicates = findIndices(hidden,space.id);
    
    // if the space has a die in it, is hidden, and it is the last duplicate..
	if (space.hasChildNodes() && space.style.visibility == "hidden" && duplicates[duplicates.length - 1] == keeperIdx) {
		// find this keeper among the keepers for this roll
		var k = theseKeepers.indexOf(keepers[keeperIdx]);
		
		// remove keeper from this roll
    	theseKeepers.splice(k,1);
    	
		// remove keeper from keepers array
		keepers.splice(keeperIdx,1);
		
		// check for score among theseKeepers
		var calculate = calculateScore(theseKeepers);
    	
    	// update score for current player
    	turnScore = calculate.score + rollScore;
    	
    	// store div for tempScore
		var tempDiv = document.getElementById("tempScore");
	
		// populate tempScore
		tempDiv.innerHTML = "<font color='#FFFFFF'>" + turnScore + "</div>";
	 	
		// store the keeper div (the div holding the die is the child element of the parent div, keepers)
		var keeperDiv = document.getElementById(id);
		
		// "Javascript won't let an element commit suicide, but it does permit infanticide..." - Mark Henderson
		keeperDiv.parentNode.removeChild(keeperDiv);
		
		// make the space on the dice area visible again
		space.style.visibility = "visible";
		
		// remove hidden space from hidden array
		hidden.splice(keeperIdx,1);
		
		// roll one more die on the next roll
		numDice++;
	} else { // otherwise..
		// leave removeKeeper()
		return;
	}
}

// stores keeper ids and returns them in ids array
function getKeeperIDs() {
	// store the divs of the current keepers (getElementsByTagName() returns values in an array)
	var divs = document.getElementById("keepers").getElementsByTagName("div");

	// stores ids of all keepers
	var ids = [];

	// store all keeper ids
	for (var i = 0; i < divs.length; i++) {
		ids.push(divs[i].id);
	}
	
	// return the result (will be stored in an array when getKeeperIDs() is called)
	return ids;
}

// takes in an array, finds the indices of some object, and returns them in indices array
function findIndices(array, object) {
	// this array stores indices of object in array
	var indices = [];
	
	// start at the beginning of array
	var position = 0;
	
	// index for indices array
	var idx = 0;
	
	// step through the array and find indices of object
	while (position < array.length) {
		// determine first instance of object
		var i = array.indexOf(object, position);
	
		// if the object is found (indexOf() returns -1 if no match is found)..
		if (i > -1) {
			// store index
			indices[idx] = i;
			
			// increment index
			idx++;
			
			// move to position after last index
			position = i + 1;
		} else { // otherwise..
			// there are no more winners
			position = array.length;
		}
	}
	
	// return the result (will be stored in an array when findIndices() is called)
	return indices;
}

// check array for all score combinations
function calculateScore(array) {
	// this array stores unused dice
	var unused = [];
	
	// make a copy of array, to avoid changing it (theseKeepers and thisRoll are global variables)
	for (var i = 0; i < array.length; i++) {
		unused.push(array[i]);
	}
	
	// store number of dice in array
	var l = unused.length;
	
	// stores score to return (in case of multiple combinations)
	var score = 0;
	
	// if there are 6..
	if (l == 6) {
		// check for six of a kind
		for (var x = 1; x <= 6; x++) {
			var contains = containsAll([x,x,x,x,x,x], unused);

			// retrieve result from structured array
			if (contains.result == true) {
				// return score and empty array
				return {score: 6000,
						extra: []
				};
			}           
		}
		
		// check for a straight
		var contains = containsAll([1,2,3,4,5,6], unused);

		// retrieve result from structured array
		if (contains.result == true) {
			// return score and empty array
			return {score: 1500,
					extra: []
			};
		}
		
		// check for 2 three of a kinds
		for (var x = 1; x <= 6; x++) {
			for (var y = 1; y <= 6; y++) {
				var contains = containsAll([x,x,x,y,y,y], unused);
				
				// retrieve result from structured array
				if (contains.result == true) {
					// return score and empty array
					return {score: 2000,
							extra: []
					};
				}
			}
		}
		
		// check for a full house
		for (var x = 1; x <= 6; x++) {
			for (var y = 1; y <= 6; y++) {
				var contains = containsAll([x,x,y,y,y,y], unused);
				
				// retrieve result from structured array
				if (contains.result == true) {
					// return score and empty array
					return {score: 2500,
							extra: []
					};
				}
			}
		}
		
		// check for three pairs
		for (var x = 1; x <= 6; x++) {
			for (var y = 1; y <= 6; y++) {
				for (var z = 1; z <= 6; z++) {
					var contains = containsAll([x,x,y,y,z,z], unused);
		
					// retrieve result from structured array
					if (contains.result == true) {
						// return score and empty array
						return {score: 1500,
								extra: []
						};
					}
				}
			}
		}
	}
	
	// if there are five or more..
	if (l >= 5) {
		// check for five of a kind
		for (var x = 1; x <= 6; x++) {
			var contains = containsAll([x,x,x,x,x], unused);
 		
			// retrieve result from structured array
			if (contains.result == true) {
				score += 3000;
 			
				// retrieve unused array from structured array
				unused = contains.array;
	
				// reset length
				l = unused.length;
			}
		}
	}
	
	// if there are four or more..
	if (l >= 4) {
		// check for four of a kind
		for (var x = 1; x <= 6; x++) {
			var contains = containsAll([x,x,x,x], unused);
 		
			// retrieve result from structured array
			if (contains.result == true) {
				score += 2000;
 			
				// retrieve unused array from structured array
				unused = contains.array;
	
				// reset length
				l = unused.length;
			}
		}
	}
	
	//  if there are three or more..
	if (l >= 3) {
		// check for three of a kind
		for (var x = 1; x <= 6; x++) {
			var contains = containsAll([x,x,x], unused);
 		
			// retrieve result from structured array
			if (contains.result == true) {
				// if they are 2s, 3s, 4s, 5s, or 6s..
				if (x > 1) {
					// multiply by 100
					score += x * 100;
				} else { // otherwise..
					// they are 1s
					score += 1000;
				}
 			
				// retrieve unused array from structured array
				unused = contains.array;

				// reset length
				l = unused.length;
			}
		}
	}
	
	// if there are two or more..
	if (l >= 2) {
		// check for two ones
 		var contains = containsAll([1,1], unused);
 		
 		// retrieve result from structured array
 		if (contains.result == true) {
			score += 200;
 			
 			// retrieve unused array from structured array
 			unused = contains.array;
	
			// reset length
			l = unused.length;
		}
	}
	
	// if there are still two or more..
	if (l >= 2) {
		// check for two fives
 		var contains = containsAll([5,5], unused);
 		
 		// retrieve result from structured array
 		if (contains.result == true) {
			score += 100;
 			
 			// retrieve unused array from structured array
 			unused = contains.array;
	
			// reset length
			l = unused.length;
		}
	}
	
	// if there is one or more..
 	if (l >= 1) {
 		// check for a one
 		var contains = containsAll([1], unused);
 		
 		// retrieve result from structured array
 		if (contains.result == true) {
			score += 100;
 			
 			// retrieve unused array from structured array
 			unused = contains.array;
	
			// reset length
			l = unused.length;
 		}
 	}
 	
	// if there is still one or more..
 	if (l >= 1) {
 		// check for a five
 		var contains = containsAll([5], unused);
 		
 		// retrieve result from structured array
 		if (contains.result == true) {
 			score += 50;
 			
 			// retrieve unused array from structured array
 			unused = contains.array;
	
			// reset length
			l = unused.length;
		}
 	}
 	
 	// return additive score and array with unused dice
 	return {score: score,
 			extra: unused
 	};
}

// takes in score combination and unused array; determines whether combination exists in unused array
function containsAll(combination, unused) {
	// l is defined up front for speed
	var l = combination.length;
	
	// stores unused dice
	var un = [];
	
	// make a copy of unused array, to avoid changing it
	for (var i = 0; i < unused.length; i++) {
		un.push(unused[i]);
	}
	
	// this array stores used dice
	var used = [];
	
	for (var i = 0; i < l; i++)  {
		// store index of combination die in unused array
		var c = un.indexOf(combination[i]);
		
		// if unused doesn't contain this combination die..
		if (c == -1) {
			return false;
		} else { // otherwise..
			// add die to used array
			used.push(un[c]);
			
			// remove die from unused (since most combinations contain multiples)
  			un.splice(c,1);
		}
	}
	
	// take out scored dice
	unused = difference(unused, used);
	
	// score combination exists in array; return true and unused array
	return {
		result: true,
		array: unused
	};
}

// takes in unused and used arrays; returns difference
function difference(unused, used) {
	// this array stores unused dice
	var un = [];
	
	// make a copy of unused array, to avoid changing it
	for (var i = 0; i < unused.length; i++) {
		un.push(unused[i]);
	}
	
	// this array stores used dice
	var u = [];
	
	// make a copy of used array, to avoid changing it
	for (var i = 0; i < used.length; i++) {
		u.push(used[i]);
	}
	
	for (i = 0; i < u.length; i++) {
		// store first index of used number in unused
		var j = un.indexOf(u[i]);
		
		// if used number is found (indexOf() returns -1 if no match is found)..
		if (j > -1) {
			// remove it from unused
			un.splice(j, 1);
		}
	}
	
	// return unused (which now only has values that aren't in used array)
	return un;
}

// ends turn and checks for winner; if necessary, displays "lastRoll" form
function endTurn() {
	// check theseKeepers for unused dice
	var calculate = calculateScore(theseKeepers);
	
	// retrieve array of extras
	var extras = calculate.extra;
	
	// assume there are extras in theseKeepers
	var justExtras = true;
	
	// if there are six keepers and none are extras..
	if (keepers.length == 6 && extras.length == 0) {
		// leave endTurn()
		justExtras = false;
	}
	
	// if there are some, but less than six keepers total and/or on this roll (unless some are extras), and the last roll was not a farkle..
	if (keepers.length != 0 && theseKeepers.length != 0 && justExtras == true && farkle == false) {
		// add turnScore to team score 
		scores[current] += turnScore;
	
		// store div for score of appropriate team
		var scoreDiv = document.getElementById("score" + current);

		// populate scoreboard
		scoreDiv.innerHTML = scores[current];
		
		// increment turns for current team
		turns[current] += 1;
		
		// if it's single player..
		if (numPlayers == 1) {
			// add new turns to ticker
			$("#ticker").html(turns[current]);
			
			// if new this turn score is higher than highTurn..
			if (turnScore > highTurn) {
				// store new highTurn
				highTurn = turnScore;
				
				// add new highTurn
				$("#highScore").html(turnScore);
			}
		}
	
		// reset turnScore
		turnScore = 0;
		
		// reset farkles
		farkles[current] = "";
		
		// store div for farkles of appropriate team
		var farklesDiv = document.getElementById("farkles" + current);
		
		// reset farkles
		farklesDiv.innerHTML = "";
	
		// store div for tempScore
		var tempDiv = document.getElementById("tempScore");

		// empty tempScore
		tempDiv.innerHTML = "<font color='#FFFFFF'>" + turnScore + "</font>";
	
		// clear keepers
		clearKeepers();
		
		// hide dice area
		$("#dice_area").hide();
		
		// store div id for current player
		var currentDiv = document.getElementById("team" + current);
		
		// decrease font size
		currentDiv.innerHTML = teams[current];
		
		// move to next team
		current++;
	
		// if current is larger than number of players
		if (current >= numPlayers) {
			// go to first player
			current = 0;
		}
		
		// store div id for current player
		var currentDiv = document.getElementById("team" + current);
		
		// increase font size
		currentDiv.innerHTML = "<font size='5'>" + teams[current] + "</div>";
		
		// next player has not rolled yet this turn
		rolled = false;
		
		// check for a winner
		checkForWinner();
	} else { // otherwise..
		// do nothing
		return;
	}
}

// fades out "lastRoll" form; sets rollForYourLife mode to waiting
function rollForYourLife() {
	// fade out the roll form
	$("#lastRoll").fadeOut(600, function() {
		// turn lastRoll on
		lastRoll = 1;
	});
}

// determines final winner; congratulates winner
function determineWinner() {
	// determine highest score
	var highest = Math.max.apply(Math, scores);

	// store index of highest score in scores array
	var winnerFinal = findIndices(scores, highest);
	
	// if there is a tie..
	if (winnerFinal > 1) {
		// teamToBeat wins
		var winner = teams[teamToBeat];
	} else { // otherwise..
		// high scorer wins
		var winner = teams[winnerFinal[0]];
	}
	// set lastRoll to wait (prevents rollDice())
	lastRoll = 0;
	
	// hide dice area
	$("#dice_area").hide();
	
	// if it's single player..
	if (numPlayers == 1) {
		// congratulate player
		var str = "<center><font size='6'>Congratulations, " + teams[0] + "!</font>";
	} else { // otherwise..
		// announce winner
		var str = "<center><font size='6'>" + winner + " wins!</font>";
	}

	// populate last Roll form
	$("#lastRoll").hide().html(str).fadeIn(600);
}