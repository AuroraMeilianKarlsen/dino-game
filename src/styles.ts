export const styles = {
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#f7f7f7',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '900px',
    width: '100%',
    position: 'relative' as const,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    position: 'absolute' as const,
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#535353',
    lineHeight: 1,
    padding: '5px 10px',
  },
  modalHeader: {
    textAlign: 'center' as const,
  },
  title: {
    color: '#535353',
    marginBottom: '10px',
    fontSize: '32px',
  },
  score: {
    fontSize: '20px',
    color: '#535353',
    marginBottom: '15px',
  },
  canvas: {
    border: '2px solid #535353',
    background: '#fff',
    display: 'block',
    margin: '0 auto',
    maxWidth: '100%',
    borderRadius: '8px',
  },
  instructions: {
    color: '#535353',
    marginTop: '15px',
    fontSize: '14px',
  },
  credit: {
    color: '#999',
    fontSize: '11px',
    marginTop: '20px',
  },
};

export const cssStyles = `
.dino-game-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.dino-game-content {
  background-color: #f7f7f7;
  border-radius: 12px;
  padding: 30px;
  max-width: 900px;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dino-game-close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #535353;
  line-height: 1;
  padding: 5px 10px;
}

.dino-game-close-button:hover {
  color: #333;
}

.dino-game-header {
  text-align: center;
}

.dino-game-title {
  color: #535353;
  margin-bottom: 10px;
  font-size: 32px;
}

.dino-game-score {
  font-size: 20px;
  color: #535353;
  margin-bottom: 15px;
}

.dino-game-canvas {
  border: 2px solid #535353;
  background: #fff;
  display: block;
  margin: 0 auto;
  max-width: 100%;
  border-radius: 8px;
}

.dino-game-instructions {
  color: #535353;
  margin-top: 15px;
  font-size: 14px;
}

.dino-game-credit {
  color: #999;
  font-size: 11px;
  margin-top: 20px;
}
`;

