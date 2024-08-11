const levels = [
    { maxProduct: 50, balloonPairs: 10, instruction: 'התאם בין בלון עם תרגיל לבלון עם תוצאה. כל התאמה נכונה תזכה אתכם בנקודה, כל התאמה שגויה תוריד לכם נקודה' },
    { maxProduct: 100, balloonPairs: 10, instruction: 'התאם בין בלון עם תרגיל לבלון עם תוצאה. כל התאמה נכונה תזכה אתכם בנקודה, כל התאמה שגויה תוריד לכם נקודה' }
];

let currentLevel = 0;
let score = 0;
let selectedBalloons = [];
let timer;
let startTime;
let playerName = '';

const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const balloonsContainer = document.getElementById('balloons-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const nextLevelButton = document.getElementById('next-level');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalTimeElement = document.getElementById('final-time');
const instructionsElement = document.getElementById('instructions');
const congratsMessageElement = document.getElementById('congrats-message');
const backgroundMusic = document.getElementById('background-music');

function startGame() {
    playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert('אנא הכנס את שמך');
        return;
    }

    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    gameOverElement.style.display = 'none';
    
    initializeGame();
}

function initializeGame() {
    currentLevel = 0;
    score = 0;
    updateScore();
    startTime = new Date();
    updateTimer();
    nextLevel();
    backgroundMusic.play().catch(error => console.log("אוטופליי נחסם:", error));
}

function nextLevel() {
    if (currentLevel >= levels.length) {
        endGame();
        return;
    }
    
    const level = levels[currentLevel];
    instructionsElement.textContent = level.instruction;
    const pairs = generatePairs(level.maxProduct, level.balloonPairs);
    shuffleArray(pairs);
    renderBalloons(pairs);
    nextLevelButton.style.display = 'none';
    selectedBalloons = [];
    currentLevel++;
}

function generatePairs(maxProduct, pairs) {
    const pairsArray = [];
    while (pairsArray.length < pairs) {
        const num1 = Math.floor(Math.random() * 9) + 2;  // Ensure the first number is never 1
        const num2 = Math.floor(Math.random() * (maxProduct / num1)) + 1;
        if (num1 * num2 <= maxProduct && !pairsArray.some(pair => pair.num1 === num1 && pair.num2 === num2)) {
            pairsArray.push({num1, num2, product: num1 * num2});
        }
    }
    return pairsArray.flatMap(pair => [{text: `${pair.num1} * ${pair.num2}`, value: pair.product}, {text: pair.product.toString(), value: pair.product}]);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderBalloons(pairs) {
    balloonsContainer.innerHTML = '';
    const colors = ['#FFD700', '#00CED1', '#32CD32', '#FF69B4'];
    pairs.forEach((pair, index) => {
        const balloonContainer = document.createElement('div');
        balloonContainer.className = 'balloon-container';
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = pair.text;
        balloon.style.backgroundColor = colors[index % colors.length];
        balloon.onclick = () => selectBalloon(balloon, pair.value);
        balloonContainer.appendChild(balloon);
        balloonsContainer.appendChild(balloonContainer);
    });
}

function selectBalloon(balloon, value) {
    if (selectedBalloons.length < 2) {
        balloon.classList.add('selected');
        selectedBalloons.push({ balloon, value });
        if (selectedBalloons.length === 2) {
            checkSelection();
        }
    }
}

function checkSelection() {
    const [first, second] = selectedBalloons;
    if (first.value === second.value) {
        score++;
        updateScore();
        first.balloon.parentNode.remove();
        second.balloon.parentNode.remove();
    } else {
        score--;
        updateScore();
        first.balloon.classList.remove('selected');
        second.balloon.classList.remove('selected');
    }
    selectedBalloons = [];
    if (!balloonsContainer.firstChild) {
        nextLevelButton.style.display = 'block';
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    timerElement.textContent = elapsedTime;
    if (currentLevel < levels.length) {
        timer = requestAnimationFrame(updateTimer);
    }
}

function endGame() {
    balloonsContainer.style.display = 'none';
    nextLevelButton.style.display = 'none';
    instructionsElement.textContent = '';
    gameOverElement.style.display = 'block';
    congratsMessageElement.textContent = `${playerName}, כל הכבוד!`;
    finalScoreElement.textContent = score;
    finalTimeElement.textContent = timerElement.textContent;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function restartGame() {
    gameOverElement.style.display = 'none';
    balloonsContainer.style.display = 'flex';
    balloonsContainer.style.flexWrap = 'wrap';
    balloonsContainer.style.justifyContent = 'center';
    initializeGame();
}

balloonsContainer.style.display = 'flex';
balloonsContainer.style.flexWrap = 'wrap';
balloonsContainer.style.justifyContent = 'center';
