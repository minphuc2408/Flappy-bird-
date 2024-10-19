class Time {
    /**
     * Khởi tạo đối tượng Time.
     * @param {number} maxFps - Số khung hình tối đa mỗi giây.
     */
    constructor(maxFps = 165) {
        if (maxFps <= 0) {
            console.warn("maxFps must be greater than 0. Setting to default value (60).");
            maxFps = 60; // Hoặc giá trị an toàn khác
        }
        this.previousTime = performance.now(); // Khởi tạo với giá trị hiện tại
        this.deltaTime = 0;
        this.running = false; // Trạng thái chạy của bộ đếm thời gian
        this.maxFps = maxFps;
        this.minFrameTime = 1000 / this.maxFps; // Thời gian tối thiểu cho mỗi khung hình
    }

    /**
     * Bắt đầu bộ đếm thời gian.
     */
    start() {
        this.previousTime = performance.now();
        this.running = true;
    }

    /**
     * Dừng bộ đếm thời gian.
     */
    stop() {
        this.running = false;
    }

    /**
     * Đặt lại bộ đếm thời gian.
     */
    reset() {
        this.previousTime = performance.now();
        this.deltaTime = 0;
    }

    /**
     * Đặt số khung hình tối đa mỗi giây.
     * @param {number} maxFps - Số khung hình tối đa mỗi giây.
     */
    setMaxFps(maxFps) {
        if (maxFps <= 0) {
            console.warn("maxFps must be greater than 0. Setting to default value (60).");
            maxFps = 60; // Hoặc giá trị an toàn khác
        }
        this.maxFps = maxFps;
        this.minFrameTime = 1000 / this.maxFps; // Cập nhật thời gian tối thiểu cho mỗi khung hình
    }

    /**
     * Cập nhật bộ đếm thời gian.
     * @param {number} currentTime - Thời gian hiện tại.
     */
    update(currentTime) {
        if (!this.running) return;
        
        // Tính deltaTime
        const elapsedTime = currentTime - this.previousTime;
        if (elapsedTime >= this.minFrameTime) {
            this.deltaTime = elapsedTime / 1000; // Chuyển đổi từ milliseconds sang seconds
            this.previousTime = currentTime;
        } else {
            this.deltaTime = 0;
        }
    }

    /**
     * Lấy giá trị deltaTime.
     * @returns {number} - Giá trị deltaTime.
     */
    getDeltaTime() {
        return this.deltaTime;
    }

    /**
     * Kiểm tra xem bộ đếm thời gian có đang chạy hay không.
     * @returns {boolean} - Trạng thái chạy của bộ đếm thời gian.
     */
    isRunning() {
        return this.running;
    }

    /**
     * Lấy giá trị maxFps hiện tại.
     * @returns {number} - Giá trị maxFps.
     */
    getMaxFps() {
        return this.maxFps;
    }
}

let lastFrameTime = performance.now();
let fps = 0;
const smoothingFactor = 0.9; // Hệ số làm mượt giá trị FPS

export function calculateFPS() {
    const now = performance.now();
    const deltaTime = now - lastFrameTime;

    // Giới hạn giá trị deltaTime tối thiểu để tránh giá trị FPS quá lớn
    const minDeltaTime = 1; // 1ms
    const limitedDeltaTime = Math.max(deltaTime, minDeltaTime);

    // Tính toán FPS (1000ms / deltaTime) và làm mượt giá trị FPS
    const currentFPS = 1000 / limitedDeltaTime;
    fps = smoothingFactor * fps + (1 - smoothingFactor) * currentFPS;

    lastFrameTime = now;
    return fps;
}

export default Time;

