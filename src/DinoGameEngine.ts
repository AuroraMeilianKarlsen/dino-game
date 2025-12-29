import type { Dino, Obstacle, Ground, DinoGameOptions } from './types';

export class DinoGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assetPath: string;
  private onScoreChange?: (score: number) => void;
  private onGameOver?: (score: number) => void;

  private animationFrameId: number = 0;
  private gameRunning: boolean = false;
  private localScore: number = 0;
  private spaceKeyPressed: boolean = false;
  private imagesLoaded: boolean = false;
  private animationFrame: number = 0;

  // Dino images
  private dinoStartImage: HTMLImageElement | null = null;
  private høyreBenOppImage: HTMLImageElement | null = null;
  private venstreBenOppImage: HTMLImageElement | null = null;
  private duckHøyreOppImage: HTMLImageElement | null = null;
  private duckVenstreOppImage: HTMLImageElement | null = null;

  // Obstacle images
  private birdImage: HTMLImageElement | null = null;
  private cactusBigImage: HTMLImageElement | null = null;
  private cactusRoundImage: HTMLImageElement | null = null;
  private cactusSmallImage: HTMLImageElement | null = null;
  private cactusBigAndSmallImage: HTMLImageElement | null = null;

  // Game state
  private dino: Dino;
  private obstacles: Obstacle[] = [];
  private obstacleTimer: number = 0;
  private ground: Ground = { y: 200, speed: 5 };

  // Duck dimensions
  private readonly duckWidth = 60;
  private readonly duckHeight = 25;

  constructor(canvas: HTMLCanvasElement, options: DinoGameOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    this.assetPath = options.assetPath || '/dino';
    this.onScoreChange = options.onScoreChange;
    this.onGameOver = options.onGameOver;

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

    this.loadImages();
  }

  private loadImages(): void {
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

  private setImage(key: string, img: HTMLImageElement): void {
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

  private drawDino(): void {
    let imageToDraw: HTMLImageElement | null = null;
    let drawY = this.dino.y;
    let drawWidth = this.dino.width;
    let drawHeight = this.dino.height;

    if (!this.imagesLoaded) {
      this.ctx.fillStyle = '#FF8DA1';
      this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);
      return;
    }

    if (!this.gameRunning) {
      imageToDraw = this.dinoStartImage;
    } else if (this.dino.ducking) {
      this.animationFrame++;
      imageToDraw = this.animationFrame % 14 < 7 ? this.duckHøyreOppImage : this.duckVenstreOppImage;
      drawWidth = this.duckWidth;
      drawHeight = this.duckHeight;
      drawY = this.ground.y - this.duckHeight;
    } else if (this.dino.jumping) {
      imageToDraw = this.høyreBenOppImage;
    } else {
      this.animationFrame++;
      imageToDraw = this.animationFrame % 14 < 7 ? this.høyreBenOppImage : this.venstreBenOppImage;
    }

    if (imageToDraw) {
      this.ctx.drawImage(imageToDraw, this.dino.x, drawY, drawWidth, drawHeight);
    } else {
      this.ctx.fillStyle = '#FF8DA1';
      this.ctx.fillRect(this.dino.x, drawY, drawWidth, drawHeight);
    }
  }

  private drawObstacle(obstacle: Obstacle): void {
    if (obstacle.type === 'cactus') {
      let cactusImage: HTMLImageElement | null = null;

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
        this.ctx.drawImage(cactusImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      } else {
        this.ctx.fillStyle = '#535353';
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    } else {
      if (this.birdImage) {
        this.ctx.drawImage(this.birdImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      } else {
        this.ctx.fillStyle = '#535353';
        this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 15);
        this.ctx.fillRect(obstacle.x + 5, obstacle.y + 15, obstacle.width - 10, 10);
      }
    }
  }

  private drawGround(): void {
    this.ctx.strokeStyle = '#535353';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.ground.y);
    this.ctx.lineTo(this.canvas.width, this.ground.y);
    this.ctx.stroke();
  }

  private createObstacle(): void {
    const type: 'cactus' | 'bird' = Math.random() > 0.7 ? 'bird' : 'cactus';
    let width = 35;
    let height = 25;
    let cactusVariant: 'big' | 'round' | 'small' | 'bigAndSmall' | undefined;

    if (type === 'cactus') {
      const variants: ('big' | 'round' | 'small' | 'bigAndSmall')[] = ['big', 'round', 'small', 'bigAndSmall'];
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

    const obstacle: Obstacle = {
      x: this.canvas.width,
      width,
      height,
      type,
      y: type === 'cactus' ? this.ground.y - height : this.ground.y - 70,
      cactusVariant,
    };

    this.obstacles.push(obstacle);
  }

  private updateDino(): void {
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

  private updateObstacles(): void {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].x -= this.ground.speed;

      if (this.obstacles[i].x + this.obstacles[i].width < 0) {
        this.obstacles.splice(i, 1);
        this.localScore += 10;
        this.onScoreChange?.(this.localScore);
      }
    }

    this.obstacleTimer++;
    if (this.obstacleTimer > 100) {
      this.createObstacle();
      this.obstacleTimer = 0;
    }
  }

  private checkCollision(): boolean {
    for (const obstacle of this.obstacles) {
      const dinoHeight = this.dino.ducking ? this.duckHeight : this.dino.height;
      const dinoWidth = this.dino.ducking ? this.duckWidth : this.dino.width;
      const dinoY = this.dino.ducking ? this.ground.y - this.duckHeight : this.dino.y;

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

  public jump(): void {
    if (!this.dino.jumping && !this.dino.ducking && this.gameRunning && !this.spaceKeyPressed) {
      this.spaceKeyPressed = true;
      this.dino.jumping = true;
      this.dino.velocityY = this.dino.jumpPower;
    }
  }

  public duck(): void {
    if (!this.dino.jumping && this.gameRunning) {
      this.dino.ducking = true;
    }
  }

  public stopDuck(): void {
    this.dino.ducking = false;
  }

  public reset(): void {
    this.dino.y = 150;
    this.dino.velocityY = 0;
    this.dino.jumping = false;
    this.dino.ducking = false;
    this.spaceKeyPressed = false;
    this.obstacles = [];
    this.obstacleTimer = 0;
    this.localScore = 0;
    this.animationFrame = 0;
    this.onScoreChange?.(0);
    this.gameRunning = true;
  }

  private gameLoop = (): void => {
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
        this.onGameOver?.(this.localScore);
      }
    } else {
      for (const obstacle of this.obstacles) {
        this.drawObstacle(obstacle);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  public start(): void {
    this.gameLoop();
  }

  public stop(): void {
    cancelAnimationFrame(this.animationFrameId);
  }

  public isRunning(): boolean {
    return this.gameRunning;
  }

  public getScore(): number {
    return this.localScore;
  }
}

