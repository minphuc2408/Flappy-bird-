class GameScreen {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.spacePressed = false;
        this.gameOverDisplayed = false;
    }

    drawBlurredBackground(gameCtx, gameCanvas) {
        gameCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    }

    drawStartScreen() {
        const gameCanvas = document.getElementById('gameCanvas');
        const gameCtx = gameCanvas.getContext('2d');

        // Vẽ màn hình bắt đầu
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.drawImage(this.gameInstance.spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);
        gameCtx.fillStyle = 'white';
        gameCtx.font = '30px Arial';
        gameCtx.textAlign = 'center';
        gameCtx.fillText('Press Space to Start', gameCanvas.width / 2, gameCanvas.height / 2);

        // Chỉ yêu cầu khung hình tiếp theo nếu game chưa bắt đầu
        if (!this.gameInstance.isGameStarted) {
            requestAnimationFrame(() => this.drawStartScreen());
        }
    }

    drawGameOverScreen() {
        if (this.gameOverDisplayed) return;

        const gameCanvas = document.getElementById('gameCanvas');
        const gameCtx = gameCanvas.getContext('2d');

        // Dừng khung hình game
        this.gameInstance.isGameStarted = false;
        this.gameOverDisplayed = true;

        // Vẽ mờ nền
        this.drawBlurredBackground(gameCtx, gameCanvas);

        // Tạo container cho màn hình game over
        const gameOverContainer = document.createElement('div');
        gameOverContainer.className = 'game-over-container';

        // Tạo tiêu đề "Game Over"
        const gameOverTitle = document.createElement('div');
        gameOverTitle.className = 'game-over-title';
        gameOverTitle.innerText = 'Game Over';
        gameOverContainer.appendChild(gameOverTitle);

        // Hiển thị điểm số
        const scoreText = document.createElement('div');
        scoreText.className = 'score-text';
        scoreText.innerText = `Score: ${this.gameInstance.score}`;
        gameOverContainer.appendChild(scoreText);

        // Tạo nút "Play Again?"
        const playAgainText = document.createElement('div');
        playAgainText.className = 'play-again-text';
        playAgainText.innerText = 'Play Again?';
        gameOverContainer.appendChild(playAgainText);

        // Tạo container cho các nút YES và NO
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Tạo nút YES
        const yesButton = document.createElement('button');
        yesButton.className = 'restart-btn';
        yesButton.innerText = 'YES';
        yesButton.onclick = () => {
            this.gameInstance.resetGame();
            this.drawStartScreen();
            document.body.removeChild(gameOverContainer);
            this.gameOverDisplayed = false;
            this.spacePressed = false;
        };
        buttonContainer.appendChild(yesButton);

        // Tạo nút NO
        const noButton = document.createElement('button');
        noButton.className = 'restart-btn';
        noButton.innerText = 'NO';
        noButton.onclick = () => {
            this.gameInstance.resetGame();
            document.querySelector('.overlay').classList.remove('hidden');
            document.querySelector('.overlay').classList.add('visible');
            document.body.removeChild(gameOverContainer);
            this.gameOverDisplayed = false;
            this.spacePressed = false;
        };
        buttonContainer.appendChild(noButton);

        // Thêm buttonContainer vào gameOverContainer
        gameOverContainer.appendChild(buttonContainer);

        // Thêm container vào body
        document.body.appendChild(gameOverContainer);
    }
}

export default GameScreen;