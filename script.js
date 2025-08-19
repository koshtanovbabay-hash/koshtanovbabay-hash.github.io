document.addEventListener('DOMContentLoaded', () => {
    const gameItems = document.querySelectorAll('.game-item');
    const siteContainer = document.querySelector('.site-container');
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    let gameActive = false;
    let crashHappened = false;

    // Загрузка изображений
    const playerImage = new Image();
    playerImage.src = 'player.png';
    const bossImage = new Image();
    bossImage.src = 'boss.png';

    // Скрываем canvas по умолчанию
    gameCanvas.style.display = 'none';

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
        
        let player = {
            x: gameCanvas.width / 2,
            y: gameCanvas.height - 50,
            width: 40, // Изменил размер
            height: 40, // Изменил размер
            speed: 5
        };

        let enemies = [];
        let bullets = [];
        let score = 0;
        let level = 1;
        let boss = null;
        let isBossLevel = false;

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
            ctx.drawImage(playerImage, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
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
                y: -100,
                width: 100, // Изменил размер
                height: 100, // Изменил размер
                speed: 1,
                isCrashing: false
            };
        }

        function updateBoss() {
            if (!boss) return;
            if (boss.y < gameCanvas.height / 4) {
                boss.y += 0.5;
            } else {
                if (!boss.isCrashing) {
                    boss.isCrashing = true;
                    setTimeout(crashSite, 2000);
                }
            }
            ctx.drawImage(bossImage, boss.x - boss.width / 2, boss.y - boss.height / 2, boss.width, boss.height);
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
            bullets.forEach((bullet, bIndex) => {
                enemies.forEach((enemy, eIndex) => {
                    if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < bullet.size + enemy.size) {
                        bullets.splice(bIndex, 1);
                        enemies.splice(eIndex, 1);
                        score += 10;
                    }
                });
            });

            enemies.forEach(enemy => {
                const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                if (distance < player.width / 2 + enemy.size) { // Используем ширину/2 для радиуса
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
            window.location.reload();
        }

        function crashSite() {
            if (crashHappened) return;
            crashHappened = true;
            gameActive = false;
            gameCanvas.classList.add('crash-effect');
            siteContainer.classList.add('crash-effect');
            setTimeout(() => {
                alert("Сайт сломался, нажмите ОК, чтобы перезагрузить.");
                window.location.reload();
            }, 1000);
        }

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
            player.x = Math.max(player.width / 2, Math.min(gameCanvas.width - player.width / 2, player.x));
        }

        gameCanvas.addEventListener('click', () => {
            shoot();
        });

        setInterval(handleMovement, 1000 / 60);

        spawnEnemies();
        gameLoop();
    }
});