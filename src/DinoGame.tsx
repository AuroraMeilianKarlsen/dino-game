'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DinoGameEngine } from './DinoGameEngine';
import { styles } from './styles';
import type { DinoGameProps } from './types';

export function DinoGame({ isOpen, onClose, assetPath = '/dino' }: DinoGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DinoGameEngine | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new DinoGameEngine(canvas, {
      assetPath,
      onScoreChange: setScore,
      onGameOver: (finalScore) => {
        setGameOver(true);
        setScore(finalScore);
      },
    });

    engineRef.current = engine;
    engine.start();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (e.repeat) return;

        if (!engine.isRunning()) {
          engine.reset();
          setGameOver(false);
          setGameStarted(true);
        } else {
          engine.jump();
        }
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        engine.duck();
      }
      if (e.code === 'Escape') {
        onClose();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        engine.stopDuck();
      }
    };

    const handleClick = () => {
      if (!engine.isRunning()) {
        engine.reset();
        setGameOver(false);
        setGameStarted(true);
      } else {
        engine.jump();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
      engine.stop();
    };
  }, [isOpen, onClose, assetPath]);

  useEffect(() => {
    if (!isOpen) {
      setScore(0);
      setGameOver(false);
      setGameStarted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dino-game-title"
    >
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={styles.closeButton}
          aria-label="Close game"
        >
          ×
        </button>

        <div style={styles.modalHeader}>
          <h2 id="dino-game-title" style={styles.title}>
            Dino Game
          </h2>
          <div style={styles.score}>
            Score: <strong>{score}</strong>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            style={styles.canvas}
            aria-label="Dino game canvas"
          />

          <div style={styles.instructions}>
            {!gameStarted && 'Press SPACE to start'}
            {gameOver && 'GAME OVER - Press SPACE to try again'}
            {gameStarted && !gameOver && 'SPACE or ⬆ Arrow: Jump | ⬇ Arrow: Duck | ESC: Close'}
          </div>
          <div style={styles.credit}>
            Inspired by the Google Chrome Dinosaur Game
          </div>
        </div>
      </div>
    </div>
  );
}

export default DinoGame;

