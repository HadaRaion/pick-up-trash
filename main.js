'use strict';

const FISH_SIZE = 70;
const FISH_COUNT = 5;
const TRASH_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const timerIndicator = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick);
gameBtn.addEventListener('click', () => {
	if (started) {
		stopGame();
		started = false;
	} else {
		startGame();
		started = true;
	}
});

popUpRefresh.addEventListener('click', startGame);

function startGame() {
	started = true;
	initGame();
	hidePopUp();
	showStopButton();
	showTimerAndScore();
	startGameTimer();
}

function stopGame() {
	started = false;
	stopGameTimer();
	hideGameButton();
	showPopUpWithText('REPLAY ?');
}

function finishGame(win) {
	started = false;
	stopGameTimer();
	hideGameButton();
	showPopUpWithText(win ? 'YOU WON 🎉' : 'YOU LOST 😭');
}

function initGame() {
	score = 0;
	started = true;
	gameScore.innerHTML = FISH_COUNT;
	clearField();
	addItem('fish', FISH_COUNT, '/img/fish.svg');
	addItem('trash', TRASH_COUNT, '/img/trash.svg');
	// countDownTimer(10);
}

function showStopButton() {
	const icon = gameBtn.querySelector('.game__button > span');
	icon.innerHTML = ' stop ';
	gameBtn.style.visibility = 'visible';
}

function hideGameButton() {
	gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
	timerIndicator.style.visibility = 'visible';
	gameScore.style.visibility = 'visible';
}

function showPopUpWithText(text) {
	popUpText.innerText = text;
	popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
	popUp.classList.add('pop-up--hide');
}

function onFieldClick(e) {
	if (!started) {
		console.log('Game is not started');
		return;
	}
	if (e.target.matches('.fish')) {
		stopGameTimer();
		finishGame(false);
	} else if (e.target.matches('.trash')) {
		score++;
		e.target.remove();
		updateScoreBoard();

		if (score === FISH_COUNT) {
			finishGame(true);
		}
	}
}

function countDownTimer(sec) {
	let timeLeft = sec;
	timerIndicator.innerHTML = '00:' + timeLeft;

	timer = setInterval(() => {
		if (timeLeft <= 1) {
			clearInterval(timer);
		}
		timeLeft -= 1;
		timerIndicator.innerHTML = timeLeft;
		timerIndicator.innerHTML = '00:' + timeLeft.toString().padStart(2, '0');
	}, 1000);
}
function startGameTimer() {
	let remainingTimeSec = GAME_DURATION_SEC;
	updateTimerText(remainingTimeSec);
	timer = setInterval(() => {
		if (remainingTimeSec <= 0) {
			clearInterval(timer);
			finishGame(FISH_COUNT === score);
			return;
		}
		updateTimerText(--remainingTimeSec);
	}, 1000);
}

function stopGameTimer() {
	clearInterval(timer);
}

function updateTimerText(time) {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	timerIndicator.innerHTML = `${minutes}:${seconds}`;
}

function updateScoreBoard() {
	gameScore.innerText = FISH_COUNT - score;
}

function addItem(className, count, imgPath) {
	const x1 = 0;
	const y1 = 0;
	const y2 = fieldRect.width - FISH_SIZE;
	const x2 = fieldRect.height - FISH_SIZE;

	for (let i = 1; i <= count; i++) {
		const item = document.createElement('img');
		item.setAttribute('class', className);
		item.setAttribute('src', imgPath);
		item.style.position = 'absolute';

		const x = randomNumber(x1, x2);
		const y = randomNumber(y1, y2);
		item.style.top = `${x}px`;
		item.style.left = `${y}px`;
		field.appendChild(item);
	}

	if ((className = 'fish')) {
		setTimeout(() => {
			moveItem();
		}, 0);
	}
}

function moveItem() {
	const allFish = document.querySelectorAll('.fish');
	allFish.forEach(fish => {
		let times = 1;

		function go() {
			if (times % 2) {
				fish.classList.remove('back');
				fish.style.marginLeft = 30 + randomNumber(100, 10) + 'px';
			} else {
				fish.classList.add('back');
				fish.style.marginLeft = 30 - randomNumber(100, 10) + 'px';
			}
		}

		go();

		fish.addEventListener('transitionend', function () {
			times++;
			go();
		});
	});
}

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function clearField() {
	field.innerHTML = ``;
}
