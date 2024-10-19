class HandposeHandler {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.previousHandY = null;
        this.previousHandX = null;
        this.handMoveThreshold = 10;
        this.handFlapTimeout = 500;
        this.handHeightThreshold = 100;
        this.handWidthThreshold = 100;
        this.frameBuffer = [];
        this.spacePressed = false;

        this.setupHandpose();
    }

    async setupHandpose() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.play();

        this.handposeModel = await handpose.load();
        console.log('Handpose model loaded');

        this.detectHand();
    }

    async detectHand() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('handCanvas');
        
        // Kiểm tra xem canvas có tồn tại không
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        const ctx = canvas.getContext('2d');

        const predictions = await this.handposeModel.estimateHands(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ

        // Vẽ hình ảnh từ video lên canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Kiểm tra trạng thái của overlay và tutorial
        const overlayVisible = !document.querySelector('.overlay').classList.contains('hidden');
        const tutorialVisible = document.querySelector('.tutorial').classList.contains('visible');

        if (overlayVisible || tutorialVisible) {
            requestAnimationFrame(() => this.detectHand());  // Tiếp tục phát hiện tay
            return; // Không xử lý cử chỉ tay nếu overlay hoặc tutorial đang hiển thị
        }

        // Chỉ xử lý cử chỉ tay trong màn hình chờ game và khi chơi game
        if (!this.gameInstance.isGameOver) {
            if (predictions.length > 0) {
                const hand = predictions[0];
                const indexTip = hand.annotations.indexFinger[3];
                const thumbTip = hand.annotations.thumb[3];
                const handY = hand.annotations.indexFinger[3][1];
                const handX = hand.annotations.indexFinger[3][0];

                const distance = Math.sqrt(
                    Math.pow(indexTip[0] - thumbTip[0], 2) +
                    Math.pow(indexTip[1] - thumbTip[1], 2)
                );

                // Kiểm tra ngưỡng chiều cao và chiều rộng để loại bỏ các cử chỉ ngoài phạm vi
                if (handY >= this.handHeightThreshold && handY <= canvas.height - this.handHeightThreshold &&
                    handX >= this.handWidthThreshold && handX <= canvas.width - this.handWidthThreshold) {
                    
                    // Kiểm tra cử chỉ chụm tay
                    if (distance < 50 && !this.spacePressed) {
                        console.log('Hand gesture detected, starting game or flapping.');
                        this.spacePressed = true;
                        if (!this.gameInstance.isGameStarted) {
                            console.log('Starting game.');
                            this.gameInstance.spacePressed = true;
                            this.gameInstance.startGame();
                        } else if (this.gameInstance.isGameStarted && !this.gameInstance.isGameOver) {
                            console.log('Flapping spaceship.');
                            this.gameInstance.spacePressed = true;
                            this.gameInstance.spaceShipFlap();
                        }
                    } else if (distance >= 50) {
                        this.spacePressed = false;
                        this.gameInstance.spacePressed = false;
                    }

                    // Lưu trữ các khung hình trước đó để xem xét nhiều khung hình liên tiếp
                    this.frameBuffer.push({ handX, handY });
                    if (this.frameBuffer.length > 3) this.frameBuffer.shift(); // Chỉ lưu tối đa 3 khung hình

                    if (this.initialHandY === null) {
                        this.initialHandY = handY;
                    }

                    const handPositionChangeY = Math.abs(this.initialHandY - handY);
                    const handPositionChangeX = Math.abs(this.previousHandX - handX);

                    // Tính tốc độ chuyển động
                    const speedY = this.previousHandY ? Math.abs(this.previousHandY - handY) : 0;
                    const speedX = this.previousHandX ? Math.abs(this.previousHandX - handX) : 0;

                    this.previousHandY = handY;
                    this.previousHandX = handX;
                }

                // Tính toán tỷ lệ giữa kích thước video và kích thước canvas
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const scaleX = canvasWidth / videoWidth;
                const scaleY = canvasHeight / videoHeight;

                // Vẽ các điểm mốc và đường nối giữa các điểm mốc
                const connections = [
                    [0, 1], [1, 2], [2, 3], [3, 4], // Ngón cái
                    [0, 5], [5, 6], [6, 7], [7, 8], // Ngón trỏ
                    [5, 9], [9, 10], [10, 11], [11, 12], // Ngón giữa
                    [9, 13], [13, 14], [14, 15], [15, 16], // Ngón áp út
                    [13, 17], [17, 18], [18, 19], [19, 20], // Ngón út
                    [0, 17] // Lòng bàn tay
                ];

                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                connections.forEach(connection => {
                    const [startIdx, endIdx] = connection;
                    const start = hand.landmarks[startIdx];
                    const end = hand.landmarks[endIdx];
                    ctx.beginPath();
                    ctx.moveTo(start[0] * scaleX, start[1] * scaleY);
                    ctx.lineTo(end[0] * scaleX, end[1] * scaleY);
                    ctx.stroke();
                });

                ctx.fillStyle = 'red';
                hand.landmarks.forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point[0] * scaleX, point[1] * scaleY, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        }

        requestAnimationFrame(() => this.detectHand());  // Tiếp tục phát hiện tay
    }

    reset() {
        this.previousHandY = null;
        this.previousHandX = null;
        this.frameBuffer = [];
        this.spacePressed = false;
    }
}

export default HandposeHandler;