const APP = document.getElementById('app');

const images = [
  './assets/images/butterfly.png',
  './assets/images/dolphin.png',
  './assets/images/elephant.png',
  './assets/images/hippo.png',
  './assets/images/panda.png',
  './assets/images/turtle.png',
];


let firstCard = null;
let secondCard = null;

let steps = 0;
let openCards = 0;

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getWinnerTable() {
  return JSON.parse(window.localStorage.getItem('winnerTable')) || [];
}

function setWinnerTable(winnerTable) {
  window.localStorage.setItem('winnerTable', JSON.stringify(winnerTable));
}

function renderWinner() {
  setTimeout(() => {
    const winnerTable = getWinnerTable();
    const name = prompt('Game over. Enter your name.');
    const currentWinner = { name, steps };
    winnerTable.push(currentWinner);

    APP.insertAdjacentHTML('afterend', `
    <div class="winner-table-wrapper">
      <div class="winner-table">
        <h3>Records table</h3>
        <p>You completed the game in ${steps} moves</p>
        <div class="table">
          ${winnerTable
      .sort((a, b) => a.steps - b.steps)
      .slice(0, 10)
      .map(
        winner => {
          const activeClass = currentWinner === winner ? 'table__row--active' : '';
          return `<div class="table__row ${activeClass}"><b>${winner.name}</b>: ${winner.steps}</div>`;
        }).join('')}    
      </div>
    </div>    
  `);

    const btnNewGame = document.createElement('button');
    btnNewGame.classList.add('btn');
    btnNewGame.innerText = 'New game';
    btnNewGame.addEventListener('click', () => window.location.reload());
    const winnerTableWrapper = document.querySelector('.winner-table-wrapper');
    winnerTableWrapper.insertAdjacentElement('beforeend', btnNewGame);

    setWinnerTable(winnerTable);
  });

}

function flip() {

  if (firstCard === this) {
    return;
  }

  if (firstCard && secondCard) {
    return;
  }
  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
  }

  this.classList.add('memory-card--flip');

  if (secondCard) {
    steps += 1;
    if (firstCard.dataset.js === secondCard.dataset.js) {
      firstCard.removeEventListener('click', flip);
      secondCard.removeEventListener('click', flip);
      openCards += 1;
      if (openCards >= images.length) {
        renderWinner();
      }
    } else {


      unFlip.call(firstCard);
      unFlip.call(secondCard);

    }
    setTimeout(() => {
      firstCard = null;
      secondCard = null;
    }, 500);
  }

}

function unFlip() {
  setTimeout(() => {
    this.classList.remove('memory-card--flip');
  }, 500)

}

const renderCard = (image) => {
  const card = document.createElement('div');
  card.addEventListener('click', flip);
  card.classList.add('memory-card');
  card.dataset.js = image;
  card.innerHTML = `
    <img class="front-face" src="${image}" alt="">
    <div class="back-face"></div>
  `;
  return card;

};

const doubleImage = images.flatMap(i => [i, i]);

shuffle(doubleImage);

doubleImage.map(renderCard).forEach(el => APP.appendChild(el));


