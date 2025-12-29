/**
 * Dino Game - Vanilla JavaScript Version
 * A Chrome Dino Game clone
 *
 * @author Aurora Meilian Karlsen
 * @license MIT
 */

class DinoGameVanilla {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assetPath = options.assetPath || '/dino';
    this.onScoreChange = options.onScoreChange || (() => {});
    this.onGameOver = options.onGameOver || (() => {});
    this.onGameStart = options.onGameStart || (() => {});

    this.animationFrameId = 0;
    this.gameRunning = false;
    this.localScore = 0;
    this.spaceKeyPressed = false;
    this.imagesLoaded = false;
    this.animationFrame = 0;

    // Dino images
    this.dinoStartImage = null;
    this.høyreBenOppImage = null;
    this.venstreBenOppImage = null;
    this.duckHøyreOppImage = null;
    this.duckVenstreOppImage = null;

    // Obstacle images
    this.birdImage = null;
    this.cactusBigImage = null;
    this.cactusRoundImage = null;
    this.cactusSmallImage = null;
    this.cactusBigAndSmallImage = null;

    // Game state
    this.dino = {
      x: 50,
      y: 150,
      width: 50,
      height: 50,
      velocityY: 0,
      jumping: false,
      ducking: false,
      gravity: 0.6,
      jumpPower: -12,
    };

    this.obstacles = [];
    this.obstacleTimer = 0;
    this.ground = { y: 200, speed: 5 };

    // Duck dimensions
    this.duckWidth = 60;
    this.duckHeight = 25;

    // Bind methods
    this.gameLoop = this.gameLoop.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  loadImages() {
    const imagesToLoad = [
      { key: 'dinoStart', file: 'DinoStart.png' },
      { key: 'høyreBenOpp', file: 'DinoRightUp.png' },
      { key: 'venstreBenOpp', file: 'DinoLeftUp.png' },
      { key: 'duckHøyreOpp', file: 'DinoDuckRightUp.png' },
      { key: 'duckVenstreOpp', file: 'DinoDuckLeftUp.png' },
      { key: 'bird', file: 'bird.png' },
      { key: 'cactusBig', file: 'cactusBig.png' },
      { key: 'cactusRound', file: 'cactusRound.png' },
      { key: 'cactusSmall', file: 'cactusSmall.png' },
      { key: 'cactusBigAndSmall', file: 'cactiBigAndSmall.png' },
    ];

    let loadedCount = 0;

    imagesToLoad.forEach(({ key, file }) => {
      const img = new Image();
      img.src = `${this.assetPath}/${file}`;

      img.onload = () => {
        this.setImage(key, img);
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          this.imagesLoaded = true;
        }
      };

      img.onerror = () => {
        console.error(`Failed to load ${file}`);
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          this.imagesLoaded = true;
        }
      };
    });
  }

  setImage(key, img) {
    switch (key) {
      case 'dinoStart':
        this.dinoStartImage = img;
        break;
      case 'høyreBenOpp':
        this.høyreBenOppImage = img;
        break;
      case 'venstreBenOpp':
        this.venstreBenOppImage = img;
        break;
      case 'duckHøyreOpp':
        this.duckHøyreOppImage = img;
        break;
      case 'duckVenstreOpp':
        this.duckVenstreOppImage = img;
        break;
      case 'bird':
        this.birdImage = img;
        break;
      case 'cactusBig':
        this.cactusBigImage = img;
        break;
      case 'cactusRound':
        this.cactusRoundImage = img;
        break;
      case 'cactusSmall':
        this.cactusSmallImage = img;
        break;
      case 'cactusBigAndSmall':
        this.cactusBigAndSmallImage = img;
        break;
    }
  }

  drawDino() {
    let imageToDraw = null;
    let drawY = this.dino.y;
    let drawWidth = this.dino.width;
    let drawHeight = this.dino.height;

    if (!this.imagesLoaded) {
      this.ctx.fillStyle = '#FF8DA1';
      this.ctx.fillRect(
        this.dino.x,
        this.dino.y,
        this.dino.width,
        this.dino.height
      );
      return;
    }

    if (!this.gameRunning) {
      imageToDraw = this.dinoStartImage;
    } else if (this.dino.ducking) {
      this.animationFrame++;
      imageToDraw =
        this.animationFrame % 14 < 7
          ? this.duckHøyreOppImage
          : this.duckVenstreOppImage;
      drawWidth = this.duckWidth;
      drawHeight = this.duckHeight;
      drawY = this.ground.y - this.duckHeight;
    } else if (this.dino.jumping) {
      imageToDraw = this.høyreBenOppImage;
    } else {
      this.animationFrame++;
      imageToDraw =
        this.animationFrame % 14 < 7
          ? this.høyreBenOppImage
          : this.venstreBenOppImage;
    }

    if (imageToDraw) {
      this.ctx.drawImage(
        imageToDraw,
        this.dino.x,
        drawY,
        drawWidth,
        drawHeight
      );
    } else {
      this.ctx.fillStyle = '#FF8DA1';
      this.ctx.fillRect(this.dino.x, drawY, drawWidth, drawHeight);
    }
  }

  drawObstacle(obstacle) {
    if (obstacle.type === 'cactus') {
      let cactusImage = null;

      switch (obstacle.cactusVariant) {
        case 'big':
          cactusImage = this.cactusBigImage;
          break;
        case 'round':
          cactusImage = this.cactusRoundImage;
          break;
        case 'small':
          cactusImage = this.cactusSmallImage;
          break;
        case 'bigAndSmall':
          cactusImage = this.cactusBigAndSmallImage;
          break;
      }

      if (cactusImage) {
        this.ctx.drawImage(
          cactusImage,
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
      } else {
        this.ctx.fillStyle = '#535353';
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
      }
    } else {
      if (this.birdImage) {
        this.ctx.drawImage(
          this.birdImage,
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
      } else {
        this.ctx.fillStyle = '#535353';
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 15);
        this.ctx.fillRect(
          obstacle.x + 5,
          obstacle.y + 15,
          obstacle.width - 10,
          10
        );
      }
    }
  }

  drawGround() {
    this.ctx.strokeStyle = '#535353';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.ground.y);
    this.ctx.lineTo(this.canvas.width, this.ground.y);
    this.ctx.stroke();
  }

  createObstacle() {
    const type = Math.random() > 0.7 ? 'bird' : 'cactus';
    let width = 35;
    let height = 25;
    let cactusVariant;

    if (type === 'cactus') {
      const variants = ['big', 'round', 'small', 'bigAndSmall'];
      cactusVariant = variants[Math.floor(Math.random() * variants.length)];

      switch (cactusVariant) {
        case 'big':
          width = 40;
          height = 60;
          break;
        case 'round':
          width = 35;
          height = 45;
          break;
        case 'small':
          width = 28;
          height = 42;
          break;
        case 'bigAndSmall':
          width = 45;
          height = 60;
          break;
      }
    } else {
      width = 35;
      height = 25;
    }

    const obstacle = {
      x: this.canvas.width,
      width,
      height,
      type,
      y: type === 'cactus' ? this.ground.y - height : this.ground.y - 70,
      cactusVariant,
    };

    this.obstacles.push(obstacle);
  }

  updateDino() {
    if (this.dino.jumping) {
      this.dino.velocityY += this.dino.gravity;
      this.dino.y += this.dino.velocityY;

      const groundY = 150;
      if (this.dino.y >= groundY) {
        this.dino.y = groundY;
        this.dino.velocityY = 0;
        this.dino.jumping = false;
        this.spaceKeyPressed = false;
      }
    }
  }

  updateObstacles() {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].x -= this.ground.speed;

      if (this.obstacles[i].x + this.obstacles[i].width < 0) {
        this.obstacles.splice(i, 1);
        this.localScore += 10;
        this.onScoreChange(this.localScore);
      }
    }

    this.obstacleTimer++;
    if (this.obstacleTimer > 100) {
      this.createObstacle();
      this.obstacleTimer = 0;
    }
  }

  checkCollision() {
    for (const obstacle of this.obstacles) {
      const dinoHeight = this.dino.ducking ? this.duckHeight : this.dino.height;
      const dinoWidth = this.dino.ducking ? this.duckWidth : this.dino.width;
      const dinoY = this.dino.ducking
        ? this.ground.y - this.duckHeight
        : this.dino.y;

      if (
        this.dino.x < obstacle.x + obstacle.width &&
        this.dino.x + dinoWidth > obstacle.x &&
        dinoY < obstacle.y + obstacle.height &&
        dinoY + dinoHeight > obstacle.y
      ) {
        return true;
      }
    }
    return false;
  }

  jump() {
    if (
      !this.dino.jumping &&
      !this.dino.ducking &&
      this.gameRunning &&
      !this.spaceKeyPressed
    ) {
      this.spaceKeyPressed = true;
      this.dino.jumping = true;
      this.dino.velocityY = this.dino.jumpPower;
    }
  }

  duck() {
    if (!this.dino.jumping && this.gameRunning) {
      this.dino.ducking = true;
    }
  }

  stopDuck() {
    this.dino.ducking = false;
  }

  reset() {
    this.dino.y = 150;
    this.dino.velocityY = 0;
    this.dino.jumping = false;
    this.dino.ducking = false;
    this.spaceKeyPressed = false;
    this.obstacles = [];
    this.obstacleTimer = 0;
    this.localScore = 0;
    this.animationFrame = 0;
    this.onScoreChange(0);
    this.gameRunning = true;
    this.onGameStart();
  }

  gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGround();
    this.drawDino();

    if (this.gameRunning) {
      this.updateDino();
      this.updateObstacles();

      for (const obstacle of this.obstacles) {
        this.drawObstacle(obstacle);
      }

      if (this.checkCollision()) {
        this.gameRunning = false;
        this.onGameOver(this.localScore);
      }
    } else {
      for (const obstacle of this.obstacles) {
        this.drawObstacle(obstacle);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  handleKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      if (e.repeat) return;

      if (!this.gameRunning) {
        this.reset();
      } else {
        this.jump();
      }
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      this.duck();
    }
  }

  handleKeyUp(e) {
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      this.stopDuck();
    }
  }

  handleClick() {
    if (!this.gameRunning) {
      this.reset();
    } else {
      this.jump();
    }
  }

  init() {
    this.loadImages();

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('click', this.handleClick);

    this.gameLoop();
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('click', this.handleClick);
  }

  isRunning() {
    return this.gameRunning;
  }

  getScore() {
    return this.localScore;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DinoGameVanilla;
}

// Export for ES modules
if (typeof window !== 'undefined') {
  window.DinoGameVanilla = DinoGameVanilla;
}
