const cardArray = [	{ name: 'card1', img: 'card1.png' },	{ name: 'card1', img: 'card1.png' },	{ name: 'card2', img: 'card2.png' },	{ name: 'card2', img: 'card2.png' },	{ name: 'card3', img: 'card3.png' },	{ name: 'card3', img: 'card3.png' },	{ name: 'card4', img: 'card4.png' },	{ name: 'card4', img: 'card4.png' },	{ name: 'card5', img: 'card5.png' },	{ name: 'card5', img: 'card5.png' },	{ name: 'card6', img: 'card6.png' },	{ name: 'card6', img: 'card6.png' }];

const grid = document.getElementById('memory-board');
let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];

// Create game board
function createBoard() {
	cardArray.sort(() => 0.5 - Math.random());
	for (let i = 0; i < cardArray.length; i++) {
		const card = document.createElement('div');
		card.classList.add('card');
		card.dataset.id = i;
		card.addEventListener('click', flipCard);
		const cardFront = document.createElement('div');
		cardFront.classList.add('card-front');
		cardFront.style.backgroundImage = `url(${cardArray[i].img})`;
		const cardBack = document.createElement('div');
		cardBack.classList.add('card-back');
		card.appendChild(cardBack);
		card.appendChild(cardFront);
		grid.appendChild(card);
	}
}

// Flip card
function flipCard() {
	const cardId = this.dataset.id;
	this.classList.add('flip');
	cardsChosen.push(cardArray[cardId].name);
	cardsChosenId.push(cardId);
	if (cardsChosen.length === 2) {
		setTimeout(checkForMatch, 500);
	}
}

// Check for match
function checkForMatch() {
	const cards = document.querySelectorAll('.card');
	const optionOneId = cardsChosenId[0];
	const optionTwoId = cardsChosenId[1];
	if (cardsChosen[0] === cardsChosen[1]) {
		cards[optionOneId].classList.add('matched');
		cards[optionTwoId].classList.add('matched');
		cardsWon.push(cardsChosen);
