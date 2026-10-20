
let currentScore = 0
let timeLeft = 10
let gameTimer = null
let scoreBarTimer = null
let scoreBarValue = 10
let blackTilePositions = []


const coverPage = document.getElementById("coverPage")
const countdownScreen = document.getElementById("countdownScreen")
const countdownNumber = document.getElementById("countdownNumber")
const gameScreen = document.getElementById("gameScreen")
const gameBoard = document.getElementById("gameBoard")
const highScore = document.getElementById("highScore")
const currentScoreEl = document.getElementById("currentScore")
const timerEl = document.getElementById("timer")
const scoreBar = document.getElementById("scoreBar")
const scoreBarValueEl = document.getElementById("scoreBarValue")
const gameOverScreen = document.getElementById("gameOverScreen")
const gameOverMessage = document.getElementById("gameOverMessage")


const storedHighScore = localStorage.getItem("highScore") ?? 0
highScore.textContent = storedHighScore


coverPage.addEventListener("click", function() {
    coverPage.classList.add("hidden")
    countdownScreen.classList.remove("hidden")
    startCountdown()
})


function startCountdown() {
    let count = 3
    countdownNumber.textContent = count
    
    const countdownInterval = setInterval(() => {
        count--
        if (count > 0) {
            countdownNumber.textContent = count
            countdownNumber.style.animation = "none"
            setTimeout(() => {
                countdownNumber.style.animation = "countdownPulse 1s ease-in-out"
            }, 10)
        } else {
            clearInterval(countdownInterval)
            countdownScreen.classList.add("hidden")
            gameScreen.classList.remove("hidden")
            initGame()
        }
    }, 1000)
}


function initGame() {
    
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div")
        tile.classList.add("tile")
        tile.dataset.index = i
        gameBoard.append(tile)
    }
    
    
    gameBoard.addEventListener("click", handleTileClick)
    
    
    placeBlackTiles(3)
    
    
    startGameTimer()
    
    
    startScoreBar()
}


function placeBlackTiles(count) {
    const tiles = document.querySelectorAll(".tile")
    const availablePositions = []
    
    
    tiles.forEach((tile, index) => {
        if (!tile.classList.contains("black")) {
            availablePositions.push(index)
        }
    })
    
    
    for (let i = 0; i < count && availablePositions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availablePositions.length)
        const position = availablePositions[randomIndex]
        tiles[position].classList.add("black")
        blackTilePositions.push(position)
        availablePositions.splice(randomIndex, 1)
    }
}


function handleTileClick(e) {
    const tile = e.target
    
    if (tile.classList.contains("tile") && tile.classList.contains("black")) {
        
        const points = scoreBarValue
        currentScore += points
        currentScoreEl.textContent = currentScore
        
       
        const pointEl = document.createElement("div")
        pointEl.classList.add("tile-point")
        pointEl.textContent = "+" + points
        tile.append(pointEl)
        
        
        tile.classList.remove("black")
        tile.classList.add("green")
        
        
        const index = parseInt(tile.dataset.index)
        blackTilePositions = blackTilePositions.filter(pos => pos !== index)
        
        
        setTimeout(() => {
            tile.classList.remove("green")
            pointEl.remove()
        }, 500)
        
        
        placeBlackTiles(1)
        
        
        resetScoreBar()
    }
}


function startGameTimer() {
    gameTimer = setInterval(() => {
        timeLeft--
        timerEl.textContent = timeLeft
        
        if (timeLeft <= 0) {
            endGame()
        }
    }, 1000)
}


function startScoreBar() {
    scoreBarValue = 10
    scoreBarValueEl.textContent = scoreBarValue
    scoreBar.style.width = "100%"
    
    scoreBarTimer = setInterval(() => {
        scoreBarValue--
        if (scoreBarValue < 0) scoreBarValue = 0
        
        scoreBarValueEl.textContent = scoreBarValue
        scoreBar.style.width = (scoreBarValue * 10) + "%"
        
        if (scoreBarValue <= 0) {
            clearInterval(scoreBarTimer)
        }
    }, 100)
}


function resetScoreBar() {
    clearInterval(scoreBarTimer)
    startScoreBar()
}

function endGame() {
    clearInterval(gameTimer)
    clearInterval(scoreBarTimer)
    
    gameScreen.classList.add("hidden")
    gameOverScreen.classList.remove("hidden")
    
    const storedHighScore = parseInt(localStorage.getItem("highScore") ?? 0)
    
    if (currentScore > storedHighScore) {
        
        localStorage.setItem("highScore", currentScore)
        gameOverMessage.textContent = "New High Score!"
        
        
        playConfetti()
    } else {
        
        gameOverMessage.textContent = "Time is up!"
    }
}


function playConfetti() {
    const duration = 3000
    const animationEnd = Date.now() + duration
    
    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()
        
        if (timeLeft <= 0) {
            clearInterval(interval)
            return
        }
        
        confetti({
            particleCount: 50,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            }
        })
    }, 250)
}