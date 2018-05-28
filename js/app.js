// Constants
const starOne = document.querySelector('.star-one');
const starTwo = document.querySelector('.star-two');
const starThree = document.querySelector('.star-three');
const starRating = document.querySelector('.stars');
const cards = document.querySelectorAll('.card');
const gameBoard = document.querySelector('.deck');
const movesCounter = document.querySelector('.moves');
const popUp = document.querySelector('.pop-up-modal');
const timerContent = document.querySelector('.time');

// Instance Specific
let cardDeck = [...cards];
let clickedCards = [];
let matchedCards = [];
let moves = 0;
let matches = 0;
let stars = [];
let time = 0;
let minutes = 0;
let seconds = 0;
let timeTrigger = true;

// Cupid Shuffle 
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

/*
 * New Game && Reset Functions
 */

const newGame = () => {
	let partialId = 0;
	let shuffledDeck = shuffle(cardDeck);
	
	for(card of shuffledDeck){
		card.id = 'card-' + partialId;
		gameBoard.appendChild(card);
		card.classList.remove('open','show','match');
		card.addEventListener('click', cardClick);
		partialId++;
	}
};

const reset = () => {
    let resetBtn = document.querySelector('.restart');	
	timerEnd();
	moves = 0;
	matches = 0;
	seconds = 0;
	minutes = 0;
	clickedCards = [];
	matchedCards = [];
	stars = [];
	timeTrigger = true;
	determineRating(moves);
	resetBtn.addEventListener('click', newGame());
	timerContent.innerHTML = `<span class="time">Time: 0${minutes}:0${seconds}</span>`;
	movesCounter.innerHTML = `<span class="moves">${moves} Moves</span>`;
	popUp.classList.add('display-none');
};

/*
 * Primary Event Listener
 */

// TODO Convert this old school function to an arrow function at some point
function cardClick() {
	// Validation to give application time to execute... otherwise BUGS! >:(
	if (clickedCards.length === 2 || matchedCards.includes(this.id)) {
		return;
	}
	// Validation++ to make sure the same card cannot be clicked twice rapidly
	if(clickedCards.length === 0 || this.id != clickedCards[0].id){

		if(timeTrigger){
			timerStart();
			timeTrigger = false;
		}
		this.classList.add('show', 'open');	
		clickedCards.push(event.target);
		determineAction();			
	}
	else {
		return;
	}
	determineRating(moves);
}

/*
 * For More Abstraction because why not?
 */

const determineAction = () => {
	if(clickedCards.length ===2 ){
		moves++;	
		displayMoves(moves);
		if(clickedCards[0].innerHTML === clickedCards[1].innerHTML){
			matchingPair();
		} else {
			failedPair();
		}
	}
};

/*
 * For Matching && Failed Pairs
 */

const matchingPair = () => {
    matches++;
	clickedCards[0].classList.remove('open', 'show');
	clickedCards[0].classList.add('match', 'pulse');
	event.target.classList.remove('open', 'show');
	event.target.classList.add('match', 'pulse');
	matchedCards.push(clickedCards[0].id);
	matchedCards.push(clickedCards[1].id);
	clickedCards = [];
	
	checkForWin();
};

const failedPair = () => {
    setTimeout(function(){
		clickedCards[0].classList.remove('open', 'show');
		clickedCards[1].classList.remove('open', 'show');
		clickedCards = [];
	}, 750);
};

/*
 * Star Specific Functions
 */

const determineRating = (moves) => {
	// Check For the Potential Reset
	if (moves === 0){
		starThree.classList.remove('far', 'fa-star');	
		starTwo.classList.remove('far', 'fa-star');
		starOne.classList.remove('far', 'fa-star');
		starThree.classList.add('fas', 'fa-star');
		starTwo.classList.add('fas', 'fa-star');
		starOne.classList.add('fas', 'fa-star');
	}
	// Removes Stars depending on how many moves have been made
	if(moves >= 11 && moves <= 15){
		starThree.classList.remove('fas', 'fa-star');
		starThree.classList.add('far', 'fa-star');		
	} else if(moves >= 16 && moves <= 21){
		starTwo.classList.remove('fas', 'fa-star');
		starTwo.classList.add('far', 'fa-star');
	} else if(moves >= 22){
		starOne.classList.remove('fas', 'fa-star');
		starOne.classList.add('far', 'fa-star');
	}
};

const finalRating = (moves) => {
    stars.push(starOne.outerHTML + starTwo.outerHTML + starThree.outerHTML);
};

/*
 * Move Specific Function
 */

const displayMoves = (moves) => {
	if (moves >= 1 && moves <= 10) {
		movesCounter.innerHTML = `<span class="moves green">${moves} Moves</span>`;
	} else if (moves >= 11 && moves <= 15) {
		movesCounter.innerHTML = `<span class="moves gold">${moves} Moves</span>`;
	} else {
		movesCounter.innerHTML = `<span class="moves red">${moves} Moves</span>`;
	}
};

/*
 * Modal Specific Function
 */

const displayModal = () => {
    popUp.innerHTML = 
	`<h1 class="heading-one">Congratulations!</h1>
	<h4 class="heading-three">Your Stats</h4>
	<p class="sub-heading">Moves:</p><p class="text-white">${moves}</p>
	<p class="sub-heading">Time:</p><p class="text-white">${minutes} minutes and ${seconds} seconds!</p>
	<p class="sub-heading">Rating:</p><p class="stars-modal text-white">${stars}</p>
	<p class="text-white">Play Again?</p>
	<div class="restart" onclick="reset()">
    <i class="fas fa-redo text-white"></i>
  	</div>
	 `;
};

/*
 * Timer Specific Functions
 */

const displayTimer = () => {
    seconds++;
	if(seconds === 60){
		minutes++;
		seconds = 0;
	}

	if(minutes > 9 && seconds > 9){
		timerContent.innerHTML = `<span class="time">Time: ${minutes}:${seconds}</span>`;
	}
	else if(minutes > 9 && seconds < 9){
		timerContent.innerHTML = `<span class="time">Time: ${minutes}:0${seconds}</span>`;
	}
	else if(minutes < 9 && seconds > 9){
		timerContent.innerHTML = `<span class="time">Time: 0${minutes}:${seconds}</span>`;
	}
	else{
		timerContent.innerHTML = `<span class="time">Time: 0${minutes}:0${seconds}</span>`;
	}	
};

const timerStart = () => {
	clearInterval(time);
	seconds = 0;
	minutes = 0;
	time = setInterval(displayTimer, 1000);
};

const timerEnd = () => {
	clearInterval(time);
};

/*
 * Win Specific Functions
 */

const checkForWin = () => {
	if(matches === 8){
		displayWin();
	}
};

const displayWin = () => {
	timerEnd();
	finalRating(moves);
	displayModal();
	popUp.classList.remove('display-none');
};

// Kicks Things Off :)
newGame();
/* 
                         ''~``
                        ( o o )
+------------------.oooO--(_)--Oooo.------------------+
|                Made by Brendan Pettis               |
|                    .oooO                            |
|                    (   )   Oooo.                    |
+---------------------\ (----(   )--------------------+
                       \_)    ) /
                             (_/
*/