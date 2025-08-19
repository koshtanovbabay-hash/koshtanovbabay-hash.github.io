document.addEventListener('DOMContentLoaded', () => {
    const gameItems = document.querySelectorAll('.game-item');
    const siteContainer = document.querySelector('.site-container');
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    let gameActive = false;
    let crashHappened = false;

    gameItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                startGame();
            }
        });
    });

    function startGame() {
        if (gameActive) return;
        gameActive = true;
        siteContainer.style.display = 'none';
        gameCanvas.style.display = 'block';
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
        
        // Game State
        let player = {
            x: gameCanvas.width / 2,
            y: gameCanvas.height - 50,
            radius: 20,
            color: 'red',
            speed: 5
        };

        let enemies = [];
        let bullets = [];
        let score = 0;
        let level = 1;
        let boss = null;
        let isBossLevel = false;

        // Game Loop
        function gameLoop() {
            if (!gameActive) return;
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            drawPlayer();
            updateBullets();
            updateEnemies();
            updateBoss();

            drawScore();
            drawLevel();
            
            checkCollisions();

            if (enemies.length === 0 && !isBossLevel) {
                levelUp();
            }
            
            requestAnimationFrame(gameLoop);
        }

        function drawPlayer() {
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
            ctx.fillStyle = player.color;
            ctx.fill();
            ctx.closePath();
        }

        function spawnEnemies() {
            if (isBossLevel) return;
            enemies = [];
            for (let i = 0; i < 5 + (level * 2); i++) {
                enemies.push({
                    x: Math.random() * gameCanvas.width,
                    y: Math.random() * (gameCanvas.height / 2),
                    size: 15,
                    color: 'purple',
                    speed: 1 + level * 0.5
                });
            }
        }

        function updateEnemies() {
            if (isBossLevel) return;
            enemies.forEach(enemy => {
                enemy.y += enemy.speed;
                ctx.beginPath();
                ctx.moveTo(enemy.x, enemy.y - enemy.size);
                ctx.lineTo(enemy.x - enemy.size, enemy.y + enemy.size);
                ctx.lineTo(enemy.x + enemy.size, enemy.y + enemy.size);
                ctx.closePath();
                ctx.fillStyle = enemy.color;
                ctx.fill();
            });
            enemies = enemies.filter(enemy => enemy.y < gameCanvas.height + enemy.size);
        }

        function spawnBoss() {
            isBossLevel = true;
            boss = {
                x: gameCanvas.width / 2,
                y: -100, // Start off-screen
                radius: 50,
                color: 'yellow',
                speed: 1,
                isCrashing: false
            };
        }

        function updateBoss() {
            if (!boss) return;

            // Boss slowly moves down
            if (boss.y < gameCanvas.height / 4) {
                boss.y += 0.5;
            } else {
                // Once on screen, trigger crash
                if (!boss.isCrashing) {
                    boss.isCrashing = true;
                    setTimeout(crashSite, 2000); // 2-second delay
                }
            }

            ctx.beginPath();
            ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
            ctx.fillStyle = boss.color;
            ctx.fill();
            ctx.closePath();
        }

        function shoot() {
            bullets.push({
                x: player.x,
                y: player.y,
                size: 5,
                color: 'red',
                speed: -10
            });
        }

        function updateBullets() {
            bullets.forEach(bullet => {
                bullet.y += bullet.speed;
                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
                ctx.fillStyle = bullet.color;
                ctx.fill();
                ctx.closePath();
            });
            bullets = bullets.filter(bullet => bullet.y > 0);
        }

        function checkCollisions() {
            // Bullet-enemy collision
            bullets.forEach((bullet, bIndex) => {
                enemies.forEach((enemy, eIndex) => {
                    if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < bullet.size + enemy.size) {
                        bullets.splice(bIndex, 1);
                        enemies.splice(eIndex, 1);
                        score += 10;
                    }
                });
            });

            // Player-enemy collision
            enemies.forEach(enemy => {
                if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < player.radius + enemy.size) {
                    endGame();
                }
            });
        }

        function drawScore() {
            ctx.fillStyle = 'white';
            ctx.font = '20px Roboto Mono';
            ctx.fillText(`Счет: ${score}`, 10, 30);
        }

        function drawLevel() {
            ctx.fillStyle = 'white';
            ctx.font = '20px Roboto Mono';
            ctx.fillText(`Уровень: ${level}`, gameCanvas.width - 150, 30);
        }

        function levelUp() {
            level++;
            if (level <= 6) {
                spawnEnemies();
            } else if (level === 7) {
                spawnBoss();
            }
        }

        function endGame() {
            gameActive = false;
            alert(`Игра окончена! Ваш счёт: ${score}`);
            window.location.reload(); // Reload to return to start page
        }

        function crashSite() {
            if (crashHappened) return;
            crashHappened = true;
            gameActive = false;
            gameCanvas.classList.add('crash-effect');
            siteContainer.style.display = 'block';
            siteContainer.classList.add('crash-effect');
            setTimeout(() => {
                alert("Сайт сломался, нажмите ОК, чтобы перезагрузить.");
                window.location.reload();
            }, 1000);
        }

        // Controls
        let keys = {};
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });
        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        function handleMovement() {
            if (keys['ArrowLeft'] || keys['a']) {
                player.x -= player.speed;
            }
            if (keys['ArrowRight'] || keys['d']) {
                player.x += player.speed;
            }
            player.x = Math.max(player.radius, Math.min(gameCanvas.width - player.radius, player.x));
        }

        gameCanvas.addEventListener('click', (e) => {
            shoot();
        });

        // Main Update Loop for controls
        setInterval(handleMovement, 1000 / 60);

        // Initial setup
        spawnEnemies();
        gameLoop();
    }
});