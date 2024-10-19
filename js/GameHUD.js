import { calculateFPS } from './Time.js';


class GameHUD {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    drawHUD(gameCtx) {
        // Tính toán FPS trước khi vẽ HUD
        const fps = calculateFPS();

        // Cập nhật giá trị hiện tại của thanh máu để tạo hiệu ứng animation
        if (this.gameInstance.displayHealth > this.gameInstance.currentHealth) {
            this.gameInstance.displayHealth -= 5; // Giảm giá trị hiện tại của thanh máu
            if (this.gameInstance.displayHealth < this.gameInstance.currentHealth) {
                this.gameInstance.displayHealth = this.gameInstance.currentHealth; // Đảm bảo không giảm quá giá trị mục tiêu
            }
        }

        // Vẽ thanh máu bo góc
        gameCtx.fillStyle = "#f00"; // Màu đỏ cho thanh máu
        this.drawRoundedRect(gameCtx, 15, 60, (this.gameInstance.displayHealth / this.gameInstance.maxHealth) * 200, 20, 10); // Thanh máu bo góc
        gameCtx.fill();

        // Vẽ viền cho thanh máu bo góc
        gameCtx.strokeStyle = "#000"; // Màu đen cho viền
        this.drawRoundedRect(gameCtx, 15, 60, 200, 20, 10); // Viền cho thanh máu bo góc
        gameCtx.stroke();

        // Vẽ điểm số
        gameCtx.fillStyle = "#fff";
        gameCtx.font = "20px Arial";
        gameCtx.fillText("Score: " + this.gameInstance.score, 55, 25);

        // Vẽ thời gian hiện tại của trò chơi
        const gameTime = this.gameInstance.getCurrentGameTime();

        gameCtx.fillText("Time: " + gameTime.toFixed(2) + "s", 70, 50);

        // Vẽ FPS
        gameCtx.fillText("FPS: " + Math.round(fps), gameCanvas.width - 45, 20);

        if (this.gameInstance.shieldActive) {
            gameCtx.save();
        
            // Tạo radial gradient với màu vàng ở viền ngoài và trong suốt ở tâm
            const gradient = gameCtx.createRadialGradient(
                this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY + 25, 0,  // Tâm trong (vị trí trung tâm, bán kính 0)
                this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY + 25, 50  // Tâm ngoài (vị trí trung tâm, bán kính 50)
            );
        
            // Tạo dải màu từ viền vàng đậm vào trung tâm trong suốt
            gradient.addColorStop(1, 'rgba(255, 255, 224, 1)');   // Vàng đậm ở viền ngoài cùng
            gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)'); // Vàng mờ dần khi đi vào tâm
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');   // Trong suốt hoàn toàn ở tâm
        
            gameCtx.fillStyle = gradient;  // Áp dụng gradient làm màu vẽ
            gameCtx.beginPath();
            gameCtx.arc(this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY + 25, 50, 0, 2 * Math.PI); // Vẽ hình tròn với bán kính 50
            gameCtx.fill();  // Tô hình tròn với dải màu đã tạo
            gameCtx.restore();

            // Tạo hạt lấp lánh ngẫu nhiên xung quanh khiên
            if (Math.random() < 0.1) { // Xác suất tạo hạt lấp lánh
                const sparkle = this.gameInstance.effects.createSparkle(
                    this.gameInstance.spaceShipX + 25 + (Math.random() - 0.5) * 100, // Vị trí x ngẫu nhiên xung quanh khiên
                    this.gameInstance.spaceShipY + 25 + (Math.random() - 0.5) * 100, // Vị trí y ngẫu nhiên xung quanh khiên
                    Math.random() * 2 + 1, // Kích thước ngẫu nhiên của hạt lấp lánh
                    1 // Độ trong suốt ban đầu
                );
                this.gameInstance.sparkles.push(sparkle);
            }

            // Cập nhật và vẽ các hạt lấp lánh
            this.gameInstance.sparkles.forEach((sparkle, index) => {
                this.gameInstance.effects.updateSparkle(sparkle);
                this.gameInstance.effects.drawSparkle(sparkle);
                if (sparkle.opacity <= 0) {
                    this.gameInstance.sparkles.splice(index, 1); // Xóa hạt lấp lánh khi độ trong suốt bằng 0
                }
            });
        }
    }
}

export default GameHUD;