// Initializes deck
document.addEventListener("DOMContentLoaded", _generateDeck, true);

// Stars
const stars = document.querySelectorAll(".fa-star");
let finalStars = 3;

// Main & Modal containers
const mainContainer = document.querySelector(".container");
const modalContainer = document.querySelector(".modal");

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

// Checks if win
function winState() {
	// Selects moves and stars
	const finalMoves = moves.textContent;

	// Final moves and final stars spans
	const finalMovesSpan = document.getElementById("finalMoves");
	const finalStarsSpan = document.getElementById("finalStars");

	finalMovesSpan.textContent = finalMoves;
	finalStarsSpan.textContent = finalStars;

	stars[1].classList.add("fa-star");
	stars[1].classList.remove("fa-star-o");
	stars[2].classList.add("fa-star");
	stars[2].classList.remove("fa-star-o");

	clearTimeout(t);
	mainContainer.classList.add("hidden");
	modalContainer.classList.remove("hidden");
}

// Manages stars
function toggleStars() {
	if (counter === 3) {
		stars[2].classList.remove("fa-star");
		stars[2].classList.add("fa-star-o");
		finalStars = 2;
	} else if (counter === 6) {
		stars[1].classList.remove("fa-star");
		stars[1].classList.add("fa-star-o");
		finalStars = 1;
	}
}

function _flipCard(evt) {
	// Add +1 to moves span
	const currentMoves = +moves.textContent;

	const card = evt.target;
	card.classList.add("open", "show");

	if (!_openedCard) {
		_openedCard = card;
	} else {
		moves.textContent = currentMoves + 1;
		if (_openedCard.classList[1] === card.classList[1]) {
			setTimeout(function() {
				card.classList.add("match", "rubberBand");
				_openedCard.classList.add("match", "rubberBand");

				_openedCard.classList.remove("open", "show");
				card.classList.remove("open", "show");
				_openedCard = null;
				counter += 1;
				toggleStars();

				if (counter === 8) {
					winState();
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

	// Show main container and hides modal
	mainContainer.classList.remove("hidden");
	modalContainer.classList.add("hidden");

	// Clear moves text
	moves.textContent = "0";

	// Gets HTML items
	const deck = document.getElementById("deck");
	const cards = deck.querySelectorAll(".card");

	// Suffles the cards object to generate new deck
	const suffledCards = shuffle(Array.from(cards));

	// Clean current deck
	deck.innerHTML = "";
	_openedCard = null;

	// Iterates over suffledCards to create the new deck
	for (let i = 0; i < suffledCards.length; i++) {
		let card = suffledCards[i];
		card.classList.remove("show", "open", "match", "rubberBand", "shake");
		card.addEventListener("click", _flipCard, true);
		deck.appendChild(card);
	}
}
