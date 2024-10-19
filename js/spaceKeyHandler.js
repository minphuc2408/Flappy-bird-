class SpaceKeyHandler {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.initEventListeners();
    }

    initEventListeners() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        const overlay = document.getElementById('overlay');
        const tutorial = document.querySelector('.tutorial');
        if (event.code === 'Space' && !this.gameInstance.spacePressed) {
            if (overlay && !overlay.classList.contains('hidden')) {
                // Nếu overlay đang hiển thị, ngăn chặn hành động mặc định của phím Space
                event.preventDefault();
                return;
            }
            if (tutorial && !tutorial.classList.contains('hidden')) {
                // Nếu tutorial đang hiển thị, ngăn chặn hành động mặc định của phím Space
                event.preventDefault();
                return;
            }
            if (this.gameInstance.isGameOver || this.gameInstance.gameScreen.gameOverDisplayed) {
                // Nếu game over, ngăn chặn hành động mặc định của phím Space
                event.preventDefault();
                return;
            }
            if (!this.gameInstance.isGameStarted) {
                this.gameInstance.spacePressed = true;
                this.gameInstance.startGame();
            } else if (this.gameInstance.isGameStarted && !this.gameInstance.isGameOver) {
                this.gameInstance.spacePressed = true; // Đảm bảo spacePressed được đặt thành true khi chơi
                this.gameInstance.spaceShipFlap();
            }
        }
    }

    handleKeyUp(event) {
        if (event.code === 'Space') {
            this.gameInstance.spacePressed = false;
        }
    }
}

export default SpaceKeyHandler;