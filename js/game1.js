import GameConstructor from './gameConstructor.js';
import SpaceKeyHandler from './spaceKeyHandler.js';
import GameReset from './gameReset.js';
import GameUpdater from './GameUpdater.js';
import GameDrawer from './GameDrawer.js';
import GameHUD from './GameHUD.js';
import GameScreen from './GameScreen.js'; 
import HandposeHandler from './HandposeHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) {
        const gameCtx = gameCanvas.getContext('2d');
        const video = document.getElementById('video');

        gameCanvas.width = 1080;
        gameCanvas.height = 720;


        class Game {
            constructor() {
                new GameConstructor(this); // Sử dụng class GameConstructor để khởi tạo các thuộc tính và sự kiện
                new SpaceKeyHandler(this); // Khởi tạo SpaceKeyHandler để quản lý sự kiện phím Space
                this.gameScreen = new GameScreen(this); // Sử dụng class GameScreen để vẽ màn hình bắt đầu và game over
                this.gameHUD = new GameHUD(this); // Sử dụng class GameHUD để vẽ HUD
                this.handposeHandler = new HandposeHandler(this); // Gán instance của HandposeHandler cho thuộc tính của classthis.handposeHandler = new HandposeHandler(this);

                this.gameScreen.drawStartScreen();
            }

            startGame() {
                this.isGameStarted = true;
                this.isGameOver = false; // Đặt lại trạng thái game over
                this.startTime = performance.now(); // Đặt thời gian bắt đầu game chính xác tại thời điểm nhấn Space
                this.time.start(); // Bắt đầu bộ đếm thời gian
            
                // Đặt thời gian khởi tạo ban đầu cho các sự kiện thiên thạch, cầu lửa, cầu băng
                this.lastAsteroidTime = 0;
                this.lastFireballTime = 0;
                this.lastIceballTime = 0;
                this.lastMissileTime = 0;
            
                this.updateGame(); // Bắt đầu vòng lặp cập nhật game
            }
        

            resetGame() {
                const gameReset = new GameReset(this);
                gameReset.reset();
                this.gameScreen.drawStartScreen(); 
            }

            spaceShipFlap() {
                this.velocity = this.lift;
            }

            updateGame() {
                const gameUpdater = new GameUpdater(this);
                gameUpdater.update();
            }

            drawGame() {
                const gameDrawer = new GameDrawer(this);
                gameDrawer.draw();
            }

            getCurrentGameTime() {
                if (!this.isGameStarted) {
                    return 0; // Nếu game chưa bắt đầu, trả về 0
                }
                return (performance.now() - this.startTime) / 1000; // Thời gian hiện tại của trò chơi tính bằng giây
            }
        }

        // Bắt đầu chương trình
        function main() {
            const game = new Game();

            // Đảm bảo tất cả hình ảnh được tải trước khi bắt đầu trò chơi
            const images = [
                game.spaceShipImage,
                game.spaceBackground,
                game.fireballImage,
                game.iceballImage,
                game.asteroidImage,
                game.blackHoleImage,
                game.cosmicDustImage,
                game.neptuneImage,
                game.uranusImage,
                game.saturnImage,
                game.marsImage,
                game.mercuryImage,
                game.jupiterImage,
                game.venusImage,
                game.ufoImage,
                game.ufochild1Image,
                game.ufochild2Image,
                game.missileImage,
                game.healthImage,
                game.shieldImage
            ];

            let loadedImages = 0;

            // Tải hình ảnh và kiểm tra
            images.forEach((img) => {
                const image = new Image(); // Tạo đối tượng hình ảnh
                image.src = img.src; // Đặt nguồn cho hình ảnh

                image.onload = () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        game.resetGame();
                    }
                };

                image.onerror = () => {
                    console.error(`Lỗi tải hình ảnh: ${img.src}`); // Thông báo lỗi nếu hình ảnh không tải được
                };
            });
        }

        main();
    } else {
        console.error('Canvas element not found');
    }
});