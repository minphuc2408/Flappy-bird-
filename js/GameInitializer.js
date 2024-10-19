import Game from './game.js';
import GameReset from './gameReset.js';

class GameInitializer {
    constructor() {
        this.game = new Game();
        this.gameReset = new GameReset(this.game); // Tạo instance của GameReset
    }

    loadImagesAndStartGame() {
        // Đảm bảo tất cả hình ảnh được tải trước khi bắt đầu trò chơi
        const images = [
            this.game.spaceShipImage,
            this.game.spaceBackground,
            this.game.fireballImage,
            this.game.iceballImage,
            this.game.asteroidImage,
            this.game.blackHoleImage,
            this.game.cosmicDustImage,
            this.game.neptuneImage,
            this.game.uranusImage,
            this.game.saturnImage,
            this.game.marsImage,
            this.game.mercuryImage,
            this.game.jupiterImage,
            this.game.venusImage,
            this.game.ufoImage,
            this.game.ufochild1Image,
            this.game.ufochild2Image,
            this.game.missileImage,
            this.game.healthImage,
            this.game.shieldImage
        ];

        let loadedImages = 0;

        // Tải hình ảnh và kiểm tra
        images.forEach((img) => {
            const image = new Image(); // Tạo đối tượng hình ảnh
            image.src = img.src; // Đặt nguồn cho hình ảnh

            image.onload = () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    this.game.resetGame(); // Gọi phương thức resetGame từ instance của Game
                }
            };
        });
    }

    start() {
        this.loadImagesAndStartGame();
    }
}

export default GameInitializer;