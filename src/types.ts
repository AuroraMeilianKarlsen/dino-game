export interface DinoGameProps {
  isOpen: boolean;
  onClose: () => void;
  assetPath?: string;
}

export interface Dino {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  jumping: boolean;
  ducking: boolean;
  gravity: number;
  jumpPower: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird';
  cactusVariant?: 'big' | 'round' | 'small' | 'bigAndSmall';
}

export interface Ground {
  y: number;
  speed: number;
}

export interface DinoGameOptions {
  assetPath?: string;
  onScoreChange?: (score: number) => void;
  onGameOver?: (score: number) => void;
}

