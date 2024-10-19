// handleObstacler.js

class ObstacleHandler {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;

    }

    updateObstacles() {
        const deltaTime = this.gameInstance.time.getDeltaTime();

        this.gameInstance.obstacles.forEach((obstacle, index) => {
            obstacle.x -= obstacle.speed * deltaTime;

            if (
                this.gameInstance.spaceShipX + 50 > obstacle.x && this.gameInstance.spaceShipX < obstacle.x + this.gameInstance.obstacleWidth &&
                this.gameInstance.spaceShipY < obstacle.y + this.gameInstance.obstacleWidth && this.gameInstance.spaceShipY + 50 > obstacle.y
            ) {
                let damage = 0;
                switch (this.gameInstance.shieldActive) {
                    case true:
                        switch (obstacle.type) {
                            case 'cosmicDust':
                            case 'neptune':
                            case 'uranus':
                            case 'saturn':
                            case 'mars':
                            case 'mercury':
                            case 'jupiter':
                            case 'venus':
                            case 'ufo':
                            case 'ufochild1':
                            case 'ufochild2':
                                this.gameInstance.obstacles.splice(index, 1);
                                this.gameInstance.shieldActive = false;
                                this.gameInstance.effects.createShieldFragments(this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY + 25);
                                break;
                            case 'blackHole':
                                this.gameInstance.currentHealth = 0;
                                damage = this.gameInstance.maxHealth;
                                break;
                            case 'shield':
                                this.gameInstance.obstacles.splice(index, 1);
                                this.gameInstance.shieldActive = true;
                                break;
                            case 'health':
                                this.gameInstance.shieldActive = true;
                                this.gameInstance.currentHealth = Math.min(this.gameInstance.maxHealth, this.gameInstance.currentHealth + 100);
                                this.gameInstance.obstacles.splice(index, 1);
                                this.gameInstance.displayHealth = this.gameInstance.currentHealth;
                                this.gameInstance.effects.addHealthIndicator(100, this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY);
                                break;
                        }
                        break;
                    case false:
                        switch (obstacle.type) {
                            case 'cosmicDust':
                            case 'neptune':
                            case 'uranus':
                            case 'saturn':
                            case 'mars':
                            case 'mercury':
                            case 'jupiter':
                            case 'venus':
                                damage = 50;
                                this.gameInstance.currentHealth -= damage;
                                this.gameInstance.effects.shakeScreen(500, 5);
                                this.gameInstance.obstacles.splice(index, 1);
                                break;
                            case 'ufo':
                            case 'ufochild1':
                            case 'ufochild2':
                                damage = 100;
                                this.gameInstance.currentHealth -= damage;
                                this.gameInstance.effects.shakeScreen(500, 5);
                                this.gameInstance.obstacles.splice(index, 1);
                                break;
                            case 'blackHole':
                                this.gameInstance.currentHealth = 0;
                                damage = this.gameInstance.maxHealth;
                                break;
                            case 'shield':
                                this.gameInstance.shieldActive = true;
                                this.gameInstance.obstacles.splice(index, 1);
                                break;
                            case 'health':
                                this.gameInstance.currentHealth = Math.min(this.gameInstance.maxHealth, this.gameInstance.currentHealth + 100);
                                this.gameInstance.obstacles.splice(index, 1);
                                this.gameInstance.displayHealth = this.gameInstance.currentHealth;
                                this.gameInstance.effects.addHealthIndicator(100, this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY);
                                break;
                        }
                        break;
                    default:
                        break;
                }

                if (damage > 0) {
                    this.gameInstance.effects.addDamageIndicator(damage, this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY);
                }
            }

            if (obstacle.isColumn && obstacle.x + this.gameInstance.obstacleWidth < this.gameInstance.spaceShipX && !obstacle.passed) {
                this.gameInstance.score++;
                obstacle.passed = true;
            }

            if (obstacle.x + this.gameInstance.obstacleWidth < 0) {
                this.gameInstance.obstacles.splice(index, 1);
            }
        });
    }

    updateMovingObjects(objects, objectType) {
        const deltaTime = this.gameInstance.time.getDeltaTime();

        objects.forEach((object, index) => {
            object.x += object.speed * object.direction * deltaTime;

            
            if (
                this.gameInstance.spaceShipX + 50 > object.x && this.gameInstance.spaceShipX < object.x + this.gameInstance.obstacleWidth &&
                this.gameInstance.spaceShipY < object.y + this.gameInstance.obstacleWidth && this.gameInstance.spaceShipY + 50 > object.y
            ) {
                if (this.gameInstance.shieldActive) {
                    this.gameInstance.shieldActive = false;
                    objects.splice(index, 1);
                    this.gameInstance.effects.createShieldFragments(this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY + 25);
                } else {
                    const damage = 200;
                    this.gameInstance.currentHealth -= damage;
                    this.gameInstance.effects.shakeScreen(500, objectType === 'missile' ? 6 : 5);
                    objects.splice(index, 1);
                    this.gameInstance.effects.addDamageIndicator(damage, this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY);
                }
            }

            if (object.x + this.gameInstance.obstacleWidth < 0 || object.x > gameCanvas.width) {
                objects.splice(index, 1);
            }
        });
    }

    updateAsteroids() {
        this.updateMovingObjects(this.gameInstance.asteroids, 'asteroid');
    }

    updateMissiles() {
        this.updateMovingObjects(this.gameInstance.missiles, 'missile');
    }

    drawMovingObjects(gameCtx, objects, isMissile = false) {
        objects.forEach(object => {
            gameCtx.save(); // Lưu trạng thái hiện tại của canvas
    
            if (isMissile) {
                // Di chuyển điểm gốc của canvas đến vị trí của tên lửa
                gameCtx.translate(object.x + this.gameInstance.obstacleWidth / 2, object.y + this.gameInstance.obstacleWidth / 2);
                // Xoay canvas một góc 45 độ
                gameCtx.rotate(45 * Math.PI / 180);
                // Vẽ tên lửa đã xoay
                gameCtx.drawImage(object.image, -this.gameInstance.obstacleWidth / 2, -this.gameInstance.obstacleWidth / 2, this.gameInstance.obstacleWidth, this.gameInstance.obstacleWidth);
            } else {
                // Vẽ các đối tượng khác mà không xoay
                gameCtx.drawImage(object.image, object.x, object.y, this.gameInstance.obstacleWidth, this.gameInstance.obstacleWidth);
            }
    
            gameCtx.restore(); // Khôi phục trạng thái ban đầu của canvas
        });
    }

    drawObstacles(gameCtx) {
        this.drawMovingObjects(gameCtx, this.gameInstance.obstacles);
    }

    drawAsteroids(gameCtx) {
        this.drawMovingObjects(gameCtx, this.gameInstance.asteroids);
    }

    drawMissiles(gameCtx) {
        this.drawMovingObjects(gameCtx, this.gameInstance.missiles, true);
    }

    createRandomObstacleColumn() {
        const obstaclePositions = [];
        const obstacleCount = 3;
        const minGap = this.gameInstance.obstacleWidth + this.gameInstance.obstacleGap;

        const getRandomYPosition = (obstaclePositions, minGap, canvasHeight) => {
            let obstacleY;
            let isValidPosition = false;
            const maxAttempts = 10;
            let attempts = 0;

            while (!isValidPosition && attempts < maxAttempts) {
                obstacleY = Math.floor(Math.random() * (canvasHeight - minGap));
                isValidPosition = obstaclePositions.every(pos => Math.abs(pos - obstacleY) >= minGap);
                attempts++;
            }

            return isValidPosition ? obstacleY : null;
        };

        for (let i = 0; i < obstacleCount; i++) {
            const obstacleY = getRandomYPosition(obstaclePositions, minGap, gameCanvas.height);
            if (obstacleY !== null) {
                obstaclePositions.push(obstacleY);
            }
        }

        const weightedObstacleTypes = [
            { type: 'cosmicDust', image: this.gameInstance.cosmicDustImage, weight: 6 },
            { type: 'neptune', image: this.gameInstance.neptuneImage, weight: 8 },
            { type: 'uranus', image: this.gameInstance.uranusImage, weight: 8 },
            { type: 'saturn', image: this.gameInstance.saturnImage, weight: 8 },
            { type: 'mars', image: this.gameInstance.marsImage, weight: 8 },
            { type: 'mercury', image: this.gameInstance.mercuryImage, weight: 8 },
            { type: 'jupiter', image: this.gameInstance.jupiterImage, weight: 8 },
            { type: 'ufo', image: this.gameInstance.ufoImage, weight: 8 },
            { type: 'venus', image: this.gameInstance.venusImage, weight: 8 },
            { type: 'ufochild1', image: this.gameInstance.ufochild1Image, weight: 5 },
            { type: 'ufochild2', image: this.gameInstance.ufochild2Image, weight: 5 },
            { type: 'blackHole', image: this.gameInstance.blackHoleImage, weight: 5 },
            { type: 'shield', image: this.gameInstance.shieldImage, weight: 6 },
            { type: 'health', image: this.gameInstance.healthImage, weight: 6 },
        ];

        const getRandomObstacleType = (weightedTypes) => {
            const totalWeight = weightedTypes.reduce((total, item) => total + item.weight, 0);
            const randomWeight = Math.random() * totalWeight;
            let cumulativeWeight = 0;

            for (const item of weightedTypes) {
                cumulativeWeight += item.weight;
                if (randomWeight < cumulativeWeight) {
                    return item;
                }
            }
        };

        for (let i = 0; i < obstacleCount; i++) {
            const randomType = getRandomObstacleType(weightedObstacleTypes);
            this.gameInstance.obstacles.push({
                x: gameCanvas.width,
                y: obstaclePositions[i],
                type: randomType.type,
                image: randomType.image,
                passed: false,
                isColumn: i === 0,
                speed: 288
            });
        }
    }

    createRandomAsteroids(gameTime) {
        let asteroidCount = 0;

        if (gameTime < 5) {
            asteroidCount = 0;
        } else if (gameTime < 10) {
            asteroidCount = 1;
        } else if (gameTime < 15) {
            asteroidCount = 2;
        } else if (gameTime < 20) {
            asteroidCount = 3;
        } else if (gameTime < 25) {
            asteroidCount = 4;
        } else {
            asteroidCount = 4;
        }

        for (let i = 0; i < asteroidCount; i++) {
            this.createRandomAsteroid();
        }
    }

    createRandomAsteroid() {
        let asteroidY;
        let isValidPosition = false;

        while (!isValidPosition) {
            asteroidY = Math.floor(Math.random() * (gameCanvas.height - this.gameInstance.obstacleWidth));
            isValidPosition = true;

            for (let asteroid of this.gameInstance.asteroids) {
                if (Math.abs(asteroidY - asteroid.y) < this.gameInstance.obstacleWidth) {
                    isValidPosition = false;
                    break;
                }
            }
        }

        this.gameInstance.asteroids.push({
            x: gameCanvas.width,
            y: asteroidY,
            speed: 720,
            type: 'asteroid',
            passed: false,
            image: this.gameInstance.asteroidImage,
            direction: -1
        });
    }

    createRandomMissiles(gameTime) {
        if (gameTime - this.gameInstance.lastMissileTime >= 5) {
            const missileCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < missileCount; i++) {
                this.createRandomMissileWithWarning(gameTime);
            }
            this.gameInstance.lastMissileTime = gameTime;
        }
    }

    createRandomMissileWithWarning(gameTime) {
        let missileY;
        let isValidPosition = false;
    
        while (!isValidPosition) {
            missileY = Math.floor(Math.random() * (gameCanvas.height - this.gameInstance.obstacleWidth));
            isValidPosition = true;
    
            for (let missile of this.gameInstance.missiles) {
                if (Math.abs(missileY - missile.y) < this.gameInstance.obstacleWidth) {
                    isValidPosition = false;
                    break;
                }
            }
        }
    
        const warningElement = document.createElement('div');
        warningElement.className = 'missile-warning';
        warningElement.textContent = 'Missile Incoming!';
    
        const canvasRect = gameCanvas.getBoundingClientRect();
        let warningTop = canvasRect.top + missileY + this.gameInstance.obstacleWidth / 2;
        const warningLeft = canvasRect.left + 30;
    
        // Kiểm tra và điều chỉnh vị trí của thông báo mới nếu cần thiết
        const existingWarnings = document.querySelectorAll('.missile-warning');
        for (let existingWarning of existingWarnings) {
            const existingWarningRect = existingWarning.getBoundingClientRect();
            if (Math.abs(warningTop - existingWarningRect.top) < 20) { // Điều chỉnh khoảng cách tối thiểu giữa các thông báo
                warningTop = existingWarningRect.top + 20; // Điều chỉnh vị trí của thông báo mới
            }
        }
    
        warningElement.style.top = `${warningTop}px`;
        warningElement.style.left = `${warningLeft}px`;
    
        document.body.appendChild(warningElement);
    
        setTimeout(() => {
            document.body.removeChild(warningElement);
    
            this.gameInstance.missiles.push({
                x: -this.gameInstance.obstacleWidth,
                y: missileY,
                type: 'missile',
                passed: false,
                image: this.gameInstance.missileImage,
                speed: 720,
                direction: 1
            });
        }, 2000);
    }

    createFireAndIce(type) {
        if (type === 'iceball') {
        const iceball = {
            x: gameCanvas.width, // Xuất phát từ góc dưới phải màn hình
            y: gameCanvas.height,
            speed: 432,
            angle: Math.random() * 45, // Góc 45 độ từ dưới phải lên trên
            image: this.gameInstance.iceballImage,
            width: 50,
            height: 50,
            isFreezing: false,
            freezeStartTime: null
        };
        this.gameInstance.iceballs.push(iceball);
        console.log('Iceball created:', iceball);
        } else if (type === 'fireball') {
            const fireball = {
                x: gameCanvas.width, // Xuất phát từ góc trên phải màn hình
                y: 0,
                speed: 432,
                angle: Math.random() * 45, // Góc ngẫu nhiên từ 0 đến 90 độ
                image: this.gameInstance.fireballImage,
                width: 50,
                height: 50,
                isBurning: false,
                burnStartTime: null
            };
            this.gameInstance.fireballs.push(fireball);
        }
    }

    moveFireAndIce(projectiles, onCollision, type) {
        const deltaTime = this.gameInstance.time.getDeltaTime(); // Lấy thời gian giữa 2 frame

        projectiles.forEach((projectile, index) => {
            // Di chuyển đối tượng theo góc
            projectile.x -= projectile.speed * Math.cos(projectile.angle * Math.PI / 180) * deltaTime;
            if (type === 'fireball') {
                projectile.y += projectile.speed * Math.sin(projectile.angle * Math.PI / 180) * deltaTime;
            } else if (type === 'iceball') {
                projectile.y -= projectile.speed * Math.sin(projectile.angle * Math.PI / 180) * deltaTime;
            }
             
            // Xóa đối tượng khi ra khỏi màn hình
            if (projectile.x + projectile.width < 0 || projectile.y > gameCanvas.height || projectile.y + projectile.height < 0) {
                projectiles.splice(index, 1);
            }

            // Kiểm tra va chạm với tàu vũ trụ
            if (
                this.gameInstance.spaceShipX + 50 > projectile.x && this.gameInstance.spaceShipX < projectile.x + projectile.width &&
                this.gameInstance.spaceShipY < projectile.y + projectile.height && this.gameInstance.spaceShipY + 50 > projectile.y
            ) {
                onCollision(this.gameInstance, projectile);
                projectiles.splice(index, 1); // Xóa đối tượng khỏi mảng
            }
        });
    }

    moveIceballs() {
        this.moveFireAndIce(this.gameInstance.iceballs, (gameInstance, iceball) => {
            const damage = 20; 
            gameInstance.isFreezing = true;
            gameInstance.currentHealth -= damage;
            gameInstance.freezeStartTime = performance.now();
            gameInstance.lastFreezeSecond = 0; // Đặt lại thời gian đóng băng
            gameInstance.effects.addDamageIndicator(damage, gameInstance.spaceShipX + 25, gameInstance.spaceShipY);
        }, 'iceball');
    }

    moveFireballs() {
        this.moveFireAndIce(this.gameInstance.fireballs, (gameInstance, fireball) => {
            const damage = 150;
            gameInstance.isBurning = true;
            gameInstance.currentHealth -= damage; // Giảm 150 máu ngay lập tức khi va chạm với cầu lửa
            gameInstance.burnStartTime = performance.now();
            gameInstance.lastBurnSecond = 0; // Đặt lại thời gian đốt cháy
            gameInstance.effects.addDamageIndicator(damage, gameInstance.spaceShipX + 25, gameInstance.spaceShipY);
        }, 'fireball');
    }
    handleStatusEffect(effectType, effectDuration, damagePerSecond, color) {
        const gameTime = performance.now();
        const effectStartTime = effectType === 'freezing' ? this.gameInstance.freezeStartTime : this.gameInstance.burnStartTime;
        const lastEffectSecond = effectType === 'freezing' ? this.gameInstance.lastFreezeSecond : this.gameInstance.lastBurnSecond;
        const isEffectActive = effectType === 'freezing' ? this.gameInstance.isFreezing : this.gameInstance.isBurning;

        if (isEffectActive) {
            if (gameTime - effectStartTime < effectDuration) {
                if (Math.floor((gameTime - effectStartTime) / 1000) > lastEffectSecond) {
                    this.gameInstance.currentHealth -= damagePerSecond;
                    if (this.gameInstance.currentHealth < 0) {
                        this.gameInstance.currentHealth = 0;
                    }
                    if (effectType === 'freezing') {
                        this.gameInstance.lastFreezeSecond = Math.floor((gameTime - effectStartTime) / 1000);
                    } else {
                        this.gameInstance.lastBurnSecond = Math.floor((gameTime - effectStartTime) / 1000);
                    }

                    this.gameInstance.effects.addDamageIndicator(damagePerSecond, this.gameInstance.spaceShipX + 25, this.gameInstance.spaceShipY);
                }

                const opacity = (effectType === 'freezing' ? 0.5 : 0.8) * (1 - (gameTime - effectStartTime) / effectDuration);
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'source-over';

                const gradientTop = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
                gradientTop.addColorStop(0, `rgba(${color}, ${opacity})`);
                gradientTop.addColorStop(1, `rgba(${color}, 0)`);

                const gradientBottom = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
                gradientBottom.addColorStop(0, `rgba(${color}, ${opacity})`);
                gradientBottom.addColorStop(1, `rgba(${color}, 0)`);

                ctx.fillStyle = gradientTop;
                ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

                ctx.fillStyle = gradientBottom;
                ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

                ctx.restore();

                if (effectType === 'freezing') {
                    this.gameInstance.velocity *= 0.9;
                }
            } else {
                const fadeOutDuration = 500;
                const fadeOutStartTime = effectStartTime + effectDuration;
                const fadeOutProgress = (gameTime - fadeOutStartTime) / fadeOutDuration;

                if (fadeOutProgress < 1) {
                    const opacity = (effectType === 'freezing' ? 0.5 : 0.8) * (1 - fadeOutProgress);
                    const canvas = document.getElementById('gameCanvas');
                    const ctx = canvas.getContext('2d');
                    ctx.save();
                    ctx.globalCompositeOperation = 'source-over';

                    const gradientTop = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
                    gradientTop.addColorStop(0, `rgba(${color}, ${opacity})`);
                    gradientTop.addColorStop(1, `rgba(${color}, 0)`);

                    const gradientBottom = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
                    gradientBottom.addColorStop(0, `rgba(${color}, ${opacity})`);
                    gradientBottom.addColorStop(1, `rgba(${color}, 0)`);

                    ctx.fillStyle = gradientTop;
                    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

                    ctx.fillStyle = gradientBottom;
                    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

                    ctx.restore();
                } else {
                    if (effectType === 'freezing') {
                        this.gameInstance.isFreezing = false;
                        this.gameInstance.velocity /= 0.9;
                    } else {
                        this.gameInstance.isBurning = false;
                    }
                }
            }
        }
    }

    handleFreezingEffect() {
        this.handleStatusEffect('freezing', 2100, 20, '0, 255, 255');
    }

    handleBurningEffect() {
        this.handleStatusEffect('burning', 5100, 50, '255, 102, 102');
    }

    drawProjectiles(gameCtx, projectiles) {
        projectiles.forEach(projectile => {
            // Lưu trạng thái hiện tại của canvas
            gameCtx.save();
            // Di chuyển điểm gốc của canvas đến vị trí của đối tượng
            gameCtx.translate(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2);
            // Xoay canvas theo góc của đối tượng
            gameCtx.rotate((projectile.angle) * Math.PI / 180);
            // Vẽ đối tượng đã xoay
            gameCtx.drawImage(projectile.image, -projectile.width / 2, -projectile.height / 2, projectile.width, projectile.height);
            // Khôi phục trạng thái ban đầu của canvas
            gameCtx.restore();
        });
    }

    drawIceballs(gameCtx) {
        this.drawProjectiles(gameCtx, this.gameInstance.iceballs);
    }

    drawFireballs(gameCtx) {
        this.drawProjectiles(gameCtx, this.gameInstance.fireballs);
    }
}

export default ObstacleHandler;