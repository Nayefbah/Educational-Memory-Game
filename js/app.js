const gameBoard = document.getElementById('game-board')
const StartButton = document.getElementById('Start-button')
const playerTextInput = document.getElementById('player-text')
const messageEl = document.querySelector('#message')
const gameTypeWord = document.getElementById('word-option')
const gameTypeSentence = document.getElementById('sentence-option')

let cardsArray = []
let textArray = []
let matchedCards = []
let gameActive = true
let currentCardIndex = 0
let lg = 0
let msglg = 0
let er = 0
let err = 'Your Errors  '

const createBoard = () => {
  const shuffledCards = shuffle(cardsArray)
  shuffledCards.forEach((card, index) => {
    const cardElement = document.createElement('div')
    cardElement.classList.add('card')
    cardElement.setAttribute('data-id', index)
    cardElement.innerHTML = card
    if (gameTypeSentence.checked === true) {
      cardElement.style.width = '250px'
      cardElement.style.fontSize = '30px'
      gameBoard.style.gridTemplateColumns =
        'repeat(auto-fit, minmax(250px, 1fr))'
    } else {
      cardElement.style.width = '100px'
      cardElement.style.fontSize = '75px'
      gameBoard.style.gridTemplateColumns =
        'repeat(auto-fit, minmax(100px, 1fr))'
    }

    gameBoard.appendChild(cardElement)
  })

  setTimeout(hideCards, 3000)
}

const hideCards = () => {
  const cards = document.querySelectorAll('.card')
  cards.forEach((card) => {
    card.innerHTML = ''
    card.addEventListener('click', flipCard)
  })
}

const flipCard = (event) => {
  const selectedCard = event.target
  const cardId = selectedCard.getAttribute('data-id')

  if (!selectedCard.classList.contains('flipped') && gameActive) {
    const expectedValue = textArray[currentCardIndex]

    selectedCard.classList.add('flipped')
    selectedCard.innerHTML = cardsArray[cardId]

    if (er < lg) {
      if (cardsArray[cardId] === expectedValue) {
        matchedCards.push(cardsArray[cardId])

        currentCardIndex++

        if (matchedCards.length === cardsArray.length) {
          gameActive = false
          document.getElementById('message').style.color = 'green'
          messageEl.innerText = 'Great Job'
          messageEl.removeAttribute('hidden')

          setTimeout(() => {
            location.reload()
          }, 3000)
        }
      } else {
        selectedCard.style.backgroundColor = '#E2565B'
        setTimeout(() => {
          selectedCard.innerHTML = ''
          selectedCard.classList.remove('flipped')
          selectedCard.style.backgroundColor = ''
          msglg -= 1
          messageEl.innerText = `You Have ${msglg} attempts`
          messageEl.removeAttribute('hidden')
          er += 1

          if (er >= lg) {
            messageEl.innerText = 'Game Over'
            messageEl.removeAttribute('hidden')
            setTimeout(() => {
              location.reload()
            }, 2000)
          }
        }, 1000)
      }
    }
  }
}

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const resetGame = () => {
  matchedCards = []
  currentCardIndex = 0
  er = 0
  lg = Math.round(cardsArray.length / 2)
  msglg = lg
  messageEl.innerText = `You Have ${msglg} attempts`
  messageEl.removeAttribute('hidden')
  gameActive = true
  gameBoard.innerHTML = ''

  createBoard()
}

StartButton.addEventListener('click', () => {
  const userInput = playerTextInput.value.trim()

  if (userInput && gameTypeWord.checked === true) {
    let input = userInput.replace(/\s/g, '')
    cardsArray = input.split('')
    textArray = input.split('')
    if (textArray.length <= 27) {
      resetGame()
    } else {
      messageEl.innerText = 'please enter less then 28 characters '
      messageEl.removeAttribute('hidden')
    }
  } else if (userInput && gameTypeSentence.checked === true) {
    cardsArray = userInput.split(' ')
    textArray = userInput.split(' ')
    if (textArray.length <= 12) {
      resetGame()
    } else {
      messageEl.innerText = 'please enter less then 13 words '
      messageEl.removeAttribute('hidden')
    }
  } else {
    messageEl.innerText = 'Enter Some Words to begin'
    messageEl.removeAttribute('hidden')
  }
})
