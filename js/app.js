/*********** Global variables declaration ***********/

// Init game on DOM ready
document.addEventListener("DOMContentLoaded", initGame, true);

// Listen on restart button to restart the game
document.querySelector(".restart").addEventListener("click", function() {
   initGame();
}, true);

// Game deck
const deck = document.getElementById("deck");

// Stars containers
const stars = document.querySelectorAll(".fa-star");

// Variable to store final stars
let finalStars = 3;

// Main & Modal containers
const mainContainer = document.querySelector(".container");
const modalContainer = document.querySelector(".modal");

// Selects moves span
const moves = document.querySelector(".moves");

// Temporal opened card
let _openedCard = null;

// To count matched cards
let matchesCounter = 0;

// Variables for timer purposes
let seconds = 0, minutes = 0, hours = 0, t;

// Span to show timer
let spanTimer = document.querySelector(".timer");

/**
 * @description Shuffle array from http://stackoverflow.com/a/2450976
 * @param {Array} array - Cards to suffle
*/
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

/**
 * @description Resets and prepare the deck to start a new deck
*/
function resetGame() {
	// Clear timer and starts it again
	clearTimeout(t);
	spanTimer.textContent = "00:00:00";
	seconds = 0, minutes = 0, hours = 0;
	timer();

	// Show main container and hides modal
	mainContainer.classList.remove("hidden");
	modalContainer.classList.add("hidden");

	// Clear moves text
	moves.textContent = "0";

	// Reset stars
	stars[1].classList.add("fa-star");
	stars[1].classList.remove("fa-star-o");
	stars[2].classList.add("fa-star");
	stars[2].classList.remove("fa-star-o");

	// Temporal card set to null to be able to compare again
	_openedCard = null;

	// Reset matches counter
	matchesCounter = 0;
}

/**
 * @description Initializes a new game
*/
function initGame() {
	// Clears board and variables to start a new game
	resetGame();

	// Gets HTML items
	const cards = deck.querySelectorAll(".card");

	// Suffles the cards object to generate new deck
	const suffledCards = shuffle(Array.from(cards));

	// Clear previews deck
	deck.innerText = '';

	// Iterates over suffledCards to create the new deck
	for (let i = 0; i < suffledCards.length; i++) {
		let card = suffledCards[i];

		card.classList.remove("show", "open", "match", "rubberBand", "shake");
		card.addEventListener("click", flipCard, true);
		deck.appendChild(card);
	}
}

/**
 * @description Flip cards to show its content
*/
function flipCard(evt) {
	// Gets current moves text
	const currentMoves = +moves.textContent;

	// Clicked card
	const card = evt.target;

	// Sets open and show classes to card to show its content
	card.classList.add("open", "show");

	// Check if this is the first clicked card
	if (!_openedCard) {
		// Temporal saved card
		_openedCard = card;
	} else {
		// Add disabled class to deck to prevent multiple cards opened
		deck.classList.add("disabled");
		// Increases moves count
		moves.textContent = currentMoves + 1;

		// Compare classes to see it both cards matches
		if (_openedCard.classList[1] === card.classList[1]) {
			setTimeout(function() {
				// Set match class to cards and rubberBand animation
				card.classList.add("match", "rubberBand");
				_openedCard.classList.add("match", "rubberBand");

				// Remove open and show classes
				_openedCard.classList.remove("open", "show");
				card.classList.remove("open", "show");

				// Temporal card set to null to be able to compare again
				_openedCard = null;

				// This counter let us know how many matches has the user
				matchesCounter += 1;

				// Toggle stars
				toggleStars();

				// If matches counter is equal to 8 it means the user has won
				if (matchesCounter === 8) {
					// Manage winning
					showResult();
				}
				
				// Remove disabled class from deck to continue playing
				deck.classList.remove("disabled");
			}, 100);
		} else {
			// Means cards didn't match
			_openedCard.classList.add("wrong", "shake");
			card.classList.add("wrong", "shake");

			setTimeout(function() {
				// Removes all classes added previously
				_openedCard.classList.remove("open", "show", "wrong", "shake");
				card.classList.remove("open", "show", "wrong", "shake");

				// Temporal card set to null to be able to compare again
				_openedCard = null;

				// Remove disabled class from deck to continue playing
				deck.classList.remove("disabled");
			}, 500);
		}
	}
}

/**
 * @description Toggle stars depending on succesfull card matches
*/
function toggleStars() {
	if (matchesCounter === 3) {
		stars[2].classList.remove("fa-star");
		stars[2].classList.add("fa-star-o");
		finalStars = 2;
	} else if (matchesCounter === 6) {
		stars[1].classList.remove("fa-star");
		stars[1].classList.add("fa-star-o");
		finalStars = 1;
	}
}

/**
 * @description Manage when user has Won
*/
function showResult() {
	// Selects moves and time
	const finalMoves = moves.textContent;
	const finalTime = spanTimer.textContent;

	// Final moves span
	const finalMovesSpan = document.getElementById("finalMoves");

	// Final stars span
	const finalStarsSpan = document.getElementById("finalStars");

	// Final time spam
	const finalTimeSpan = document.getElementById("finalTime");

	// Set results
	finalMovesSpan.textContent = finalMoves;
	finalStarsSpan.textContent = finalStars;
	finalTimeSpan.textContent = finalTime;

	// Stops timer
	clearTimeout(t);

	// Hide main container and show modal
	mainContainer.classList.add("hidden");
	modalContainer.classList.remove("hidden");
}

/**
 * @description Timer controller
*/
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

/**
 * @description Initializes timer
 */
function timer() {
    t = setTimeout(add, 1000);
}
// End of timer controller
