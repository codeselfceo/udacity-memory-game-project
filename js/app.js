/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 // Initializes deck
document.addEventListener("DOMContentLoaded", _generateDeck, true);

// Selects moves span
const moves = document.querySelector(".moves");

// Array to store opened cards
let _openedCard = null;

// To count pairs
let counter = 0;

// Variables used in timer
let seconds = 0, minutes = 0, hours = 0, t;
let spanTimer = document.querySelector(".timer");

// Timer
function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    spanTimer.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

 // Listen on restart button to restart the game
document.querySelector(".restart").addEventListener("click", function() {
	_generateDeck();
}, true);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function _flipCard(evt) {
	// Add +1 to moves span
	const currentMoves = +moves.textContent;
	moves.textContent = currentMoves + 1;

	const card = evt.target;
	card.classList.add("open", "show");

	if (!_openedCard) {
		_openedCard = card;
	} else {
		if (_openedCard.classList[1] === card.classList[1]) {
			setTimeout(function() {
				card.classList.add("match", "rubberBand");
				_openedCard.classList.add("match", "rubberBand");

				_openedCard.classList.remove("open", "show");
				card.classList.remove("open", "show");
				_openedCard = null;
				counter += 1;
				if (counter === 8) {
					clearTimeout(t);
				}
			}, 100);
		}
		else {
			_openedCard.classList.add("wrong", "shake");
			card.classList.add("wrong", "shake");
			setTimeout(function() {
				_openedCard.classList.remove("open", "show", "wrong", "shake");
				card.classList.remove("open", "show", "wrong", "shake");
				_openedCard = null;
			}, 500);
		}
	}
}

/**
 * Generates a deck
*/
function _generateDeck() {
	// Clear timer and initializes it
	clearTimeout(t);
	spanTimer.textContent = "00:00:00";
	seconds = 0, minutes = 0, hours = 0;
	timer();

	// Clear moves text
	moves.textContent = "0";

	// Gets HTML items
	const deck = document.getElementById("deck");
	const cards = deck.querySelectorAll(".card");

	// Suffles the cards object to generate new deck
	const suffledCards = shuffle(Array.from(cards));

	// Clean current deck
	deck.innerHTML = "";

	// Iterates over suffledCards to create the new deck
	for (let i = 0; i < suffledCards.length; i++) {
		let card = suffledCards[i];
		card.classList.remove("show", "open", "match", "rubberBand", "shake");
		card.addEventListener("click", _flipCard, true);
		deck.appendChild(card);
	}
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
