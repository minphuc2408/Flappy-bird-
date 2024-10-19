import ObstacleHandler from './GameObstacler.js';
import GameHUD from './GameHUD.js';

class GameDrawer {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.obstacleHandler = new ObstacleHandler(gameInstance);
        this.gameHUD = new GameHUD(gameInstance);
    }

    draw() {
        const ctx = gameCanvas.getContext('2d');

        // Vẽ nền không gian
        ctx.drawImage(this.gameInstance.spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);

        // Lưu trạng thái hiện tại của canvas
        ctx.save();

        // Di chuyển điểm gốc của canvas đến vị trí của tàu vũ trụ
        ctx.translate(this.gameInstance.spaceShipX + this.gameInstance.spaceShipOriginX, this.gameInstance.spaceShipY + this.gameInstance.spaceShipOriginY);
        
        // Xoay canvas 45 độ (pi/4 radians)
        ctx.rotate(Math.PI / 4);

        // Vẽ tàu vũ trụ đã xoay
        ctx.drawImage(this.gameInstance.spaceShipImage, -this.gameInstance.spaceShipOriginX, -this.gameInstance.spaceShipOriginY, this.gameInstance.spaceShipWidth, this.gameInstance.spaceShipHeight);

        // Khôi phục trạng thái ban đầu của canvas
        ctx.restore();

        // Vẽ các chướng ngại vật
        this.obstacleHandler.drawObstacles(ctx);
        this.obstacleHandler.drawAsteroids(ctx);
        this.obstacleHandler.drawMissiles(ctx);
        this.obstacleHandler.drawFireballs(ctx);
        this.obstacleHandler.drawIceballs(ctx);

        // Thêm hạt khói nếu máu ít hơn 50%
        if (this.gameInstance.currentHealth <= this.gameInstance.maxHealth / 2) {
            this.gameInstance.effects.addSmokeParticle(this.gameInstance.spaceShipX, this.gameInstance.spaceShipY + 25);
        }

        // Thêm hiệu ứng lửa nếu máu dưới 30%
        if (this.gameInstance.currentHealth <= this.gameInstance.maxHealth * 0.4) {
            this.gameInstance.effects.addFireParticleTop(this.gameInstance.spaceShipX + 35, this.gameInstance.spaceShipY + 10);
            this.gameInstance.effects.addFireParticleBottom(this.gameInstance.spaceShipX + 35, this.gameInstance.spaceShipY + 40);
            if (this.gameInstance.currentHealth <= this.gameInstance.maxHealth * 0.3) {
                this.gameInstance.effects.addFireParticleLeft(this.gameInstance.spaceShipX + 15, this.gameInstance.spaceShipY + 25);
                this.gameInstance.effects.addFireParticleRight(this.gameInstance.spaceShipX + 45, this.gameInstance.spaceShipY + 25);
            }
        }

        this.gameInstance.effects.updateAndDrawSmokeParticles();
        this.gameInstance.effects.updateAndDrawFireParticles();
        this.gameInstance.effects.drawDamageIndicators();
        this.gameInstance.effects.drawHealthIndicators();
        this.gameInstance.effects.drawShieldFragments();

        // Vẽ HUD (Health, Score, Time, Shield)
        this.gameHUD.drawHUD(ctx); // Sử dụng phương thức từ GameHUD
    }
}

export default GameDrawer;