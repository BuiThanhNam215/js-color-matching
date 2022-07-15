import { GAME_STATUS, PAIRS_COUNT, GAME_TIME } from './constants.js'
import {
  getColorElementList,
  getColorListElement,
  getPlayAgainButton,
  getColorBackground,
  getInActiveColorList,
} from './selectors.js'
import {
  getRandomColorPairs,
  setTimerText,
  showPlayAgainButton,
  hidePlayAgainButton,
  createTimer,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  const fullSecond = `0${second}`.slice(-2)
  setTimerText(fullSecond)
}

function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED
  showPlayAgainButton()
  setTimerText('Game Over 🥲')
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || isClicked || shouldBlockClick) return

  selections.push(liElement)
  liElement.classList.add('active')
  if (selections.length < 2) return

  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  const colorBackground = getColorBackground()

  if (isMatch) {
    const isWin = getInActiveColorList().length === 0
    colorBackground.style.backgroundColor = secondColor
    if (isWin) {
      timer.clear()
      showPlayAgainButton()
      setTimerText('YOU WIN 🏆')
      gameStatus = GAME_STATUS.FINISHED
    }
    selections = []
    return
  }

  gameStatus = GAME_STATUS.BLOCKING

  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function initColor() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)

  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('.overlay')

    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

function attachEventForColorList() {
  const ulElement = getColorListElement()

  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleColorClick(event.target)
  })
}

function resetGame() {
  gameStatus = GAME_STATUS.PLAYING
  selections = []
  const colorElementList = getColorElementList()

  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }
  hidePlayAgainButton()
  setTimerText('')
  initColor()
  startTimer()
}

function attachEventForPlayAgainButton() {
  const playAginButton = getPlayAgainButton()

  if (!playAginButton) return
  playAginButton.addEventListener('click', resetGame)
}

function startTimer() {
  timer.start()
}

;(() => {
  initColor()
  attachEventForColorList()
  attachEventForPlayAgainButton()
  startTimer()
})()
