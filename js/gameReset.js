class GameReset {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
    }

    reset() {
        const gameCanvas = document.getElementById('gameCanvas');
        
        // Đặt lại vị trí và vận tốc của tàu
        this.gameInstance.spaceShipX = gameCanvas.width / 3;
        this.gameInstance.spaceShipY = gameCanvas.height / 2;
        this.gameInstance.velocity = 0;

        // Đặt lại trạng thái trò chơi
        this.gameInstance.isGameStarted = false;
        this.gameInstance.isGameOver = false;
        this.gameInstance.playAgainEventAdded = false;
        this.gameInstance.startTime = performance.now(); // Đặt lại thời gian bắt đầu trò chơi
        this.gameInstance.time.reset(); // Đặt lại bộ đếm thời gian

        // Đặt lại điểm số và sức khỏe
        this.gameInstance.score = 0;
        this.gameInstance.currentHealth = this.gameInstance.maxHealth;
        this.gameInstance.displayHealth = this.gameInstance.maxHealth;

        // Đặt lại trạng thái khiên
        this.gameInstance.shieldActive = false;
        this.gameInstance.shieldDuration = 0;

        // Đặt lại trạng thái thiêu đốt
        this.gameInstance.isBurning = false;
        this.gameInstance.burnStartTime = null;
        this.gameInstance.lastBurnSecond = 0;

        // Đặt lại trạng thái đóng băng
        this.gameInstance.isFreezing = false;
        this.gameInstance.freezeStartTime = null;
        this.gameInstance.lastFreezeSecond = 0;

        // Đặt lại các mảng đối tượng
        this.gameInstance.obstacles = [];
        this.gameInstance.asteroids = [];
        this.gameInstance.fireballs = [];
        this.gameInstance.iceballs = [];
        this.gameInstance.missiles = [];

        // Đặt lại thời gian tạo các đối tượng
        this.gameInstance.framesSinceLastObstacle = 0;
        this.gameInstance.lastAsteroidTime = 0;
        this.gameInstance.lastFireballTime = 0;
        this.gameInstance.lastIceballTime = 0;
        this.gameInstance.lastMissileTime = 0;

         // Đặt lại các hiệu ứng nếu tồn tại
         if (this.gameInstance.effects) {
            this.gameInstance.effects.particles = [];
            this.gameInstance.effects.particlesTop = [];
            this.gameInstance.effects.particlesBottom = [];
            this.gameInstance.effects.explosions = [];
            this.gameInstance.effects.damageIndicators = [];
            this.gameInstance.effects.healthIndicators = [];
            this.gameInstance.effects.fragments = [];
        }
    }

}

export default GameReset;