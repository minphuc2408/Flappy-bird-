// GameUpdater.js
import GameDrawer from './GameDrawer.js';
import ObstacleHandler from './GameObstacler.js';
import Effects from './GameEffects.js';
import GameScreen from './GameScreen.js';

class GameUpdater {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.obstacleHandler = new ObstacleHandler(gameInstance);
        this.gameDrawer = new GameDrawer(gameInstance);
        this.gameScreen = new GameScreen(gameInstance);
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            this.gameInstance.effects = new Effects(canvas);
        } else {
            console.error('Canvas element not found');
        }
    }

    update() {
        if (!this.gameInstance.isGameStarted) {
            return;
        }

        if (this.gameInstance.isGameOver) {
            this.gameScreen.drawGameOverScreen(); 
            return;
        }

        const currentTime = performance.now();
        this.gameInstance.time.update(currentTime);
        const deltaTime = this.gameInstance.time.getDeltaTime();

        if (deltaTime === 0) {
            requestAnimationFrame(() => this.update());
            return;
        }

        this.gameInstance.velocity += this.gameInstance.gravity * deltaTime;
        this.gameInstance.spaceShipY += this.gameInstance.velocity * deltaTime;

        if (this.gameInstance.spaceShipY <= 0) {
            this.gameInstance.spaceShipY = 0;
            this.gameInstance.velocity = 0;
        }
        if (this.gameInstance.spaceShipY + this.gameInstance.spaceShipImage.height >= gameCanvas.height) {
            this.gameInstance.isGameOver = true;
            this.gameScreen.drawGameOverScreen(); 
            return;
        }

        this.gameInstance.drawGame();

        this.gameInstance.framesSinceLastObstacle += deltaTime;

        if (this.gameInstance.framesSinceLastObstacle >= this.gameInstance.obstacleInterval) {
            this.obstacleHandler.createRandomObstacleColumn();
            this.gameInstance.framesSinceLastObstacle = 0;
        }

        const gameTime = this.gameInstance.getCurrentGameTime();

        if (gameTime - this.gameInstance.lastAsteroidTime >= 5) {
            this.obstacleHandler.createRandomAsteroids(gameTime);
            this.gameInstance.lastAsteroidTime = gameTime;
        }

        if (gameTime - this.gameInstance.lastMissileTime >= 15) {
            this.obstacleHandler.createRandomMissiles(gameTime);
            this.gameInstance.lastMissileTime = gameTime;
        }

        if (gameTime - this.gameInstance.lastFireballTime >= 25) {
            const fireballCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < fireballCount; i++) {
                this.obstacleHandler.createFireAndIce('fireball');
            }
            this.gameInstance.lastFireballTime = gameTime;
        }

        if (gameTime - this.gameInstance.lastIceballTime >= 25) {
            const iceballCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < iceballCount; i++) {
                this.obstacleHandler.createFireAndIce('iceball');
                console.log(`Iceball ${i + 1} created at time: ${gameTime}`);
            }
            this.gameInstance.lastIceballTime = gameTime;
        }
        
        this.obstacleHandler.updateObstacles();
        this.obstacleHandler.updateAsteroids();
        this.obstacleHandler.updateMissiles();
        
        this.obstacleHandler.moveFireballs();
        this.obstacleHandler.moveIceballs();

        this.obstacleHandler.handleBurningEffect();
        this.obstacleHandler.handleFreezingEffect();

        this.gameInstance.effects.updateShieldFragments();

        if (this.gameInstance.currentHealth <= 0) {
            this.gameInstance.isGameOver = true;
            this.gameScreen.drawGameOverScreen(); // Sử dụng phương thức từ GameScreen
            return;
        }

        requestAnimationFrame(() => this.update());
    }
}

export default GameUpdater;