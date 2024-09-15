(function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    // Player settings
    const player = {
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        speed: 5,
        color: '#00ff00'
    };

    // Bullets and enemies
    const bullets = [];
    const enemies = [];
    const powerUps = [];
    let boss = null;
    let bossActive = false;

    // Controls
    const keys = {};
    const touchControls = { left: false, right: false, fire: false };

    // Game states
    let lastTime = 0;
    let score = 0;

    // Resize the canvas to fill the screen
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        player.x = width / 2 - player.width / 2;
        player.y = height - player.height - 30;
    }

    // Create stars for the background
    const stars = [];
    function createStars() {
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 2 + 0.5
            });
        }
    }

    // Move stars to create animation
    function moveStars() {
        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
        });
    }

    // Draw stars on the canvas
    function drawStars() {
        stars.forEach(star => {
            ctx.fillStyle = 'white';
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    // Player movement and fire controls
    function handleInput() {
        if (keys['ArrowLeft'] || touchControls.left) {
            player.x -= player.speed;
            if (player.x < 0) player.x = 0;
        }
        if (keys['ArrowRight'] || touchControls.right) {
            player.x += player.speed;
            if (player.x + player.width > width) player.x = width - player.width;
        }
        if (keys[' '] || touchControls.fire) {
            fireBullet();
        }
    }

    // Fire bullets
    function fireBullet() {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 7
        });
    }

    // Update bullets
    function updateBullets() {
        bullets.forEach((bullet, i) => {
            bullet.y -= bullet.speed;
            if (bullet.y + bullet.height < 0) bullets.splice(i, 1);
        });
    }

    // Draw bullets
    function drawBullets() {
        bullets.forEach(bullet => {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    // Create enemies
    function createEnemies() {
        if (Math.random() < 0.05) {
            enemies.push({
                x: Math.random() * (width - 30),
                y: 0,
                width: 30,
                height: 30,
                speed: 3,
                color: 'red'
            });
        }
    }

    // Update enemies
    function updateEnemies() {
        enemies.forEach((enemy, i) => {
            enemy.y += enemy.speed;
            if (enemy.y > height) enemies.splice(i, 1);
        });
    }

    // Draw enemies
    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    // Power-ups
    function createPowerUps() {
        if (Math.random() < 0.01) {
            powerUps.push({
                x: Math.random() * (width - 20),
                y: 0,
                width: 20,
                height: 20,
                speed: 2,
                type: 'boost'
            });
        }
    }

    // Update power-ups
    function updatePowerUps() {
        powerUps.forEach((powerUp, i) => {
            powerUp.y += powerUp.speed;
            if (powerUp.y > height) powerUps.splice(i, 1);
        });
    }

    // Draw power-ups
    function drawPowerUps() {
        powerUps.forEach(powerUp => {
            ctx.fillStyle = 'blue';
            ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        });
    }

    // Draw the player
    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Game loop
    function gameLoop(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;

        ctx.clearRect(0, 0, width, height);

        moveStars();
        drawStars();

        handleInput();
        updateBullets();
        drawBullets();
        createEnemies();
        updateEnemies();
        drawEnemies();
        createPowerUps();
        updatePowerUps();
        drawPowerUps();
        drawPlayer();

        requestAnimationFrame(gameLoop);
    }

    // Keydown and keyup event listeners
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Resize event listener
    window.addEventListener('resize', resizeCanvas);

    // Touch controls (for mobile)
    canvas.addEventListener('touchstart', (e) => {
        const touchX = e.touches[0].clientX;
        touchControls.fire = true;
        if (touchX < width / 2) touchControls.left = true;
        else touchControls.right = true;
    });
    canvas.addEventListener('touchend', () => {
        touchControls.left = false;
        touchControls.right = false;
        touchControls.fire = false;
    });

    // Initialize game
    resizeCanvas();
    createStars();
    gameLoop();
})();
