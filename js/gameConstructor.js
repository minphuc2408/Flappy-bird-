import Time from './Time.js'; // Import class Time

class GameContructor {
    constructor (gameInstance) {
        // Vị trí và chuyển động của tàu
        gameInstance.spaceShipeX = gameCanvas.width / 3;
        gameInstance.spaceShipY = gameCanvas.height / 2;
        gameInstance.spaceShipWidth = 50;
        gameInstance.spaceShipHeight = 50;
        gameInstance.spaceShipOriginX = gameInstance.spaceShipWidth / 2;
        gameInstance.spaceShipOriginY = gameInstance.spaceShipHeight / 2;
        gameInstance.gravity = 980; 
        gameInstance.lift = -400; 
        gameInstance.velocity = 0;

        // Điểm số và trạng thái trò chơi
        gameInstance.score = 0; // Điểm số
        gameInstance.isGameStarted = false; // Trạng thái của game, mặc định là chưa bắt đầu
        gameInstance.isGameOver = false; // Trạng thái game over
        gameInstance.playAgainEventAdded = false; // Trạng thái sự kiện "Play Again" chưa được thêm
        gameInstance.spacePressed = false; // Trạng thái phím Space

        // Chướng ngại vật và vật phẩm
        gameInstance.obstacles = [];
        gameInstance.asteroids = []; // Mảng chứa các thiên thạch độc lập
        gameInstance.fireballs = []; // Mảng cầu lửa
        gameInstance.iceballs = []; // Mảng cầu băng
        gameInstance.missiles = [];
        gameInstance.obstacleWidth = 50;
        gameInstance.obstacleGap = 120;
        gameInstance.obstacleInterval = 1; // Khoảng cách giữa các cột chướng ngại vật
        gameInstance.framesSinceLastObstacle = 0; // Số khung hình kể từ khi vật cản cuối cùng được tạo
        gameInstance.lastAsteroidTime = 0; // Thời gian lần cuối thiên thạch được tạo
        gameInstance.lastFireballTime = 0; // Thời gian cuối cùng tạo cầu lửa
        gameInstance.lastIceballTime = 0; // Thời gian cuối cùng tạo cầu lửa
        gameInstance.lastMissileTime = 0;

        // Hiệu ứng và trạng thái liên quan
        gameInstance.sparkles = [];
        gameInstance.isBurning = false; // Trạng thái đang bị thiêu
        gameInstance.burnStartTime = null; // Thời gian bắt đầu bị thiêu
        gameInstance.lastBurnSecond = 0; // Giây cuối cùng bị thiêu
        gameInstance.isFreezing = false; // Trạng thái đang bị đóng băng
        gameInstance.freezeStartTime = null; // Thời gian bắt đầu bị đóng băng
        gameInstance.lastFreezeSecond = 0; // Giây cuối cùng bị đóng băng

        // Trạng thái khiên
        gameInstance.shieldActive = false;
        gameInstance.shieldDuration = 0;

        // Thời gian và khung hình
        gameInstance.time = new Time(); // Khởi tạo đối tượng Time
        gameInstance.startTime = performance.now(); // Thời gian bắt đầu trò chơi

        // Máu và sức khỏe
        gameInstance.maxHealth = 1000; // Máu tối đa
        gameInstance.currentHealth = gameInstance.maxHealth; // Máu hiện tại
        gameInstance.displayHealth = gameInstance.currentHealth; // Khởi tạo giá trị hiện tại của thanh máu

        // Hình ảnh cho tàu và chướng ngại vật
        gameInstance.spaceShipImage = new Image();
        gameInstance.spaceShipImage.src = './assets/img/spaceship1.png'; // Đường dẫn đến hình ảnh tàu vũ trụ
        
        gameInstance.ufoImage = new Image();
        gameInstance.ufoImage.src = './assets/img/ufo.png'; // Đường dẫn đến hình ảnh tàu vũ trụ
        
        gameInstance.ufochild1Image = new Image();
        gameInstance.ufochild1Image.src = './assets/img/ufo-child-1.png'; // Đường dẫn đến hình ảnh tàu vũ trụ
        
        gameInstance.ufochild2Image = new Image();
        gameInstance.ufochild2Image.src = './assets/img/ufo-child-2.png'; // Đường dẫn đến hình ảnh tàu vũ trụ
        
        gameInstance.spaceBackground = new Image();
        gameInstance.spaceBackground.src = './assets/img/bg-1.png'; // Hình nền không gian
        
        gameInstance.fireballImage = new Image();
        gameInstance.fireballImage.src = './assets/img/fireball.png'; // Hình ảnh cầu lửa
        
        gameInstance.iceballImage = new Image();
        gameInstance.iceballImage.src = './assets/img/iceball.png'; // Hình ảnh cầu băng
        
        gameInstance.asteroidImage = new Image();
        gameInstance.asteroidImage.src = './assets/img/asteroid.png'; // Hình ảnh thiên thạch
        
        gameInstance.missileImage = new Image();
        gameInstance.missileImage.src = './assets/img/missile.png'; // Hình ảnh tên lửa

        gameInstance.blackHoleImage = new Image();
        gameInstance.blackHoleImage.src = './assets/img/black-hole.png'; // Hình ảnh lỗ đen

        gameInstance.cosmicDustImage = new Image();
        gameInstance.cosmicDustImage.src = './assets/img/cosmic-dust.png'; // Hình ảnh bụi vũ trụ

        gameInstance.neptuneImage = new Image();
        gameInstance.neptuneImage.src = './assets/img/neptune.png'; // Hình ảnh sao Hải Vương

        gameInstance.uranusImage = new Image();
        gameInstance.uranusImage.src = './assets/img/uranus.png'; // Hình ảnh sao Thiên Vương

        gameInstance.saturnImage = new Image();
        gameInstance.saturnImage.src = './assets/img/saturn.png'; // Hình ảnh sao Thổ

        gameInstance.marsImage = new Image();
        gameInstance.marsImage.src = './assets/img/mars.png'; // Hình ảnh sao Hỏa

        gameInstance.mercuryImage = new Image();
        gameInstance.mercuryImage.src = './assets/img/mercury.png'; // Hình ảnh sao Thủy

        gameInstance.jupiterImage = new Image();
        gameInstance.jupiterImage.src = './assets/img/jupiter.png'; // Hình ảnh sao Mộc

        gameInstance.venusImage = new Image();
        gameInstance.venusImage.src = './assets/img/venus.png'; // Hình ảnh sao Kim

        gameInstance.healthImage = new Image();
        gameInstance.healthImage.src = './assets/img/health.png'; // Hình ảnh vật phẩm máu

        gameInstance.shieldImage = new Image();
        gameInstance.shieldImage.src = './assets/img/shield.png'; // Hình ảnh vật phẩm khiên
    }
}

export default GameContructor; // Export class GameConstructor 