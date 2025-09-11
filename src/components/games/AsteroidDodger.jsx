import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAudio } from "../audio/AudioSystem";

const AsteroidDodger = ({ onClose }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  const { playSound } = useAudio();

  // Game state
  const [gameState, setGameState] = useState("menu"); // 'menu', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("asteroidDodgerHighScore") || "0");
  });
  const [difficulty, setDifficulty] = useState("inner"); // 'inner', 'outer'
  const [showFact, setShowFact] = useState(null);

  // Game objects
  const gameObjects = useRef({
    player: {
      x: 0,
      y: 0,
      width: 30,
      height: 20,
      speed: 5,
      shield: false,
      shieldTime: 0,
    },
    asteroids: [],
    powerUps: [],
    particles: [],
  });

  // Asteroid facts
  const asteroidFacts = [
    {
      title: "Asteroid Belt Location",
      fact: "Most asteroids orbit between Mars and Jupiter, 2.2 to 3.2 AU from the Sun.",
      source: "NASA JPL",
    },
    {
      title: "Asteroid Composition",
      fact: "Asteroids are made of rock, metal, and ice - leftover building blocks from our solar system's formation.",
      source: "ESA",
    },
    {
      title: "Largest Asteroid",
      fact: "Ceres is the largest asteroid, so big it's classified as a dwarf planet at 940 km diameter.",
      source: "NASA",
    },
    {
      title: "Asteroid Speed",
      fact: "Asteroids orbit the Sun at speeds of 15-25 km/s, much faster than any spacecraft we've built.",
      source: "NASA JPL",
    },
    {
      title: "Near-Earth Asteroids",
      fact: "Over 27,000 near-Earth asteroids have been discovered, with new ones found every week.",
      source: "NASA CNEOS",
    },
    {
      title: "Asteroid Mining",
      fact: "A single metallic asteroid could contain more platinum than has ever been mined on Earth.",
      source: "NASA",
    },
  ];

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const player = gameObjects.current.player;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 20;
    player.shield = false;
    player.shieldTime = 0;

    gameObjects.current.asteroids = [];
    gameObjects.current.powerUps = [];
    gameObjects.current.particles = [];
    setScore(0);
    setShowFact(null);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (gameState === "playing") {
          setGameState("paused");
        } else if (gameState === "paused") {
          setGameState("playing");
        }
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Handle touch controls
  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || gameState !== "playing") return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      const player = gameObjects.current.player;
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;

      // Move towards touch position
      if (touchX < playerCenterX) keysRef.current["ArrowLeft"] = true;
      if (touchX > playerCenterX) keysRef.current["ArrowRight"] = true;
      if (touchY < playerCenterY) keysRef.current["ArrowUp"] = true;
      if (touchY > playerCenterY) keysRef.current["ArrowDown"] = true;
    },
    [gameState]
  );

  const handleTouchEnd = useCallback(() => {
    keysRef.current["ArrowLeft"] = false;
    keysRef.current["ArrowRight"] = false;
    keysRef.current["ArrowUp"] = false;
    keysRef.current["ArrowDown"] = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  // Spawn asteroid
  const spawnAsteroid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = Math.random() * 30 + 20;
    const speed =
      difficulty === "inner" ? Math.random() * 3 + 2 : Math.random() * 5 + 3;

    gameObjects.current.asteroids.push({
      x: Math.random() * (canvas.width - size),
      y: -size,
      width: size,
      height: size,
      speed: speed,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    });
  }, [difficulty]);

  // Spawn power-up
  const spawnPowerUp = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (Math.random() < 0.3) {
      // 30% chance
      const type = Math.random() < 0.5 ? "shield" : "slowmo";
      gameObjects.current.powerUps.push({
        x: Math.random() * (canvas.width - 20),
        y: -20,
        width: 20,
        height: 20,
        speed: 2,
        type: type,
      });
    }
  }, []);

  // Create particle effect
  const createParticles = useCallback((x, y, color = "#ffaa00") => {
    for (let i = 0; i < 8; i++) {
      gameObjects.current.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 30,
        maxLife: 30,
        color: color,
      });
    }
  }, []);

  // Check collision
  const checkCollision = useCallback((rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }, []);

  // Update game logic
  const updateGame = useCallback(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const player = gameObjects.current.player;

    // Update player position
    if (
      keysRef.current["ArrowLeft"] ||
      keysRef.current["a"] ||
      keysRef.current["A"]
    ) {
      player.x = Math.max(0, player.x - player.speed);
    }
    if (
      keysRef.current["ArrowRight"] ||
      keysRef.current["d"] ||
      keysRef.current["D"]
    ) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }
    if (
      keysRef.current["ArrowUp"] ||
      keysRef.current["w"] ||
      keysRef.current["W"]
    ) {
      player.y = Math.max(0, player.y - player.speed);
    }
    if (
      keysRef.current["ArrowDown"] ||
      keysRef.current["s"] ||
      keysRef.current["S"]
    ) {
      player.y = Math.min(
        canvas.height - player.height,
        player.y + player.speed
      );
    }

    // Update shield
    if (player.shield) {
      player.shieldTime--;
      if (player.shieldTime <= 0) {
        player.shield = false;
      }
    }

    // Update asteroids
    gameObjects.current.asteroids.forEach((asteroid, index) => {
      asteroid.y += asteroid.speed;
      asteroid.rotation += asteroid.rotationSpeed;

      // Remove asteroids that are off screen
      if (asteroid.y > canvas.height) {
        gameObjects.current.asteroids.splice(index, 1);
        setScore((prev) => prev + 10);
      }

      // Check collision with player
      if (checkCollision(player, asteroid)) {
        if (player.shield) {
          // Destroy asteroid if player has shield
          gameObjects.current.asteroids.splice(index, 1);
          createParticles(
            asteroid.x + asteroid.width / 2,
            asteroid.y + asteroid.height / 2,
            "#00ff00"
          );
          playSound("ui_click");
        } else {
          // Game over
          setGameState("gameOver");
          playSound("quiz_wrong");

          // Show random asteroid fact
          const randomFact =
            asteroidFacts[Math.floor(Math.random() * asteroidFacts.length)];
          setShowFact(randomFact);

          // Update high score
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("asteroidDodgerHighScore", score.toString());
          }
        }
      }
    });

    // Update power-ups
    gameObjects.current.powerUps.forEach((powerUp, index) => {
      powerUp.y += powerUp.speed;

      // Remove power-ups that are off screen
      if (powerUp.y > canvas.height) {
        gameObjects.current.powerUps.splice(index, 1);
      }

      // Check collision with player
      if (checkCollision(player, powerUp)) {
        gameObjects.current.powerUps.splice(index, 1);
        createParticles(
          powerUp.x + powerUp.width / 2,
          powerUp.y + powerUp.height / 2,
          "#00ffff"
        );
        playSound("quiz_correct");

        if (powerUp.type === "shield") {
          player.shield = true;
          player.shieldTime = 300; // 5 seconds at 60fps
        } else if (powerUp.type === "slowmo") {
          // Slow down all asteroids temporarily
          gameObjects.current.asteroids.forEach((asteroid) => {
            asteroid.speed *= 0.5;
          });
          setTimeout(() => {
            gameObjects.current.asteroids.forEach((asteroid) => {
              asteroid.speed *= 2;
            });
          }, 3000);
        }
      }
    });

    // Update particles
    gameObjects.current.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      if (particle.life <= 0) {
        gameObjects.current.particles.splice(index, 1);
      }
    });

    // Spawn new asteroids
    if (Math.random() < (difficulty === "inner" ? 0.02 : 0.04)) {
      spawnAsteroid();
    }

    // Spawn power-ups occasionally
    if (Math.random() < 0.005) {
      spawnPowerUp();
    }
  }, [
    gameState,
    checkCollision,
    createParticles,
    spawnAsteroid,
    spawnPowerUp,
    playSound,
    score,
    highScore,
    difficulty,
  ]);

  // Render game
  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas with space background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a0a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 73) % canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }

    if (gameState === "playing" || gameState === "paused") {
      const player = gameObjects.current.player;

      // Draw player (spacecraft)
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

      // Draw shield if active
      if (player.shield) {
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, player.width / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw spacecraft
      ctx.fillStyle = "#00aaff";
      ctx.beginPath();
      ctx.moveTo(0, -player.height / 2);
      ctx.lineTo(-player.width / 2, player.height / 2);
      ctx.lineTo(0, player.height / 4);
      ctx.lineTo(player.width / 2, player.height / 2);
      ctx.closePath();
      ctx.fill();

      // Engine glow
      ctx.fillStyle = "#ffaa00";
      ctx.beginPath();
      ctx.moveTo(-5, player.height / 2);
      ctx.lineTo(0, player.height / 2 + 10);
      ctx.lineTo(5, player.height / 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Draw asteroids
      gameObjects.current.asteroids.forEach((asteroid) => {
        ctx.save();
        ctx.translate(
          asteroid.x + asteroid.width / 2,
          asteroid.y + asteroid.height / 2
        );
        ctx.rotate(asteroid.rotation);

        ctx.fillStyle = "#8B4513";
        ctx.strokeStyle = "#654321";
        ctx.lineWidth = 2;

        // Draw irregular asteroid shape
        ctx.beginPath();
        const sides = 8;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const radius =
            (asteroid.width / 2) * (0.8 + Math.sin(angle * 3) * 0.2);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });

      // Draw power-ups
      gameObjects.current.powerUps.forEach((powerUp) => {
        ctx.save();
        ctx.translate(
          powerUp.x + powerUp.width / 2,
          powerUp.y + powerUp.height / 2
        );

        if (powerUp.type === "shield") {
          ctx.fillStyle = "#00ff00";
          ctx.strokeStyle = "#00aa00";
        } else {
          ctx.fillStyle = "#00ffff";
          ctx.strokeStyle = "#00aaaa";
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, powerUp.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw symbol
        ctx.fillStyle = "#ffffff";
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillText(powerUp.type === "shield" ? "🛡️" : "⏰", 0, 2);

        ctx.restore();
      });

      // Draw particles
      gameObjects.current.particles.forEach((particle) => {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle =
          particle.color +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fillRect(particle.x, particle.y, 2, 2);
      });

      // Draw UI with much smaller text
      ctx.fillStyle = "#ffffff";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${score}`, 10, 18);
      ctx.fillText(`High Score: ${highScore}`, 10, 32);
      ctx.font = "10px Arial";
      ctx.fillText(
        `Difficulty: ${
          difficulty === "inner" ? "Inner Solar System" : "Outer Solar System"
        }`,
        10,
        46
      );

      if (player.shield) {
        ctx.fillStyle = "#00ff00";
        ctx.font = "10px Arial";
        ctx.fillText(`Shield: ${Math.ceil(player.shieldTime / 60)}s`, 10, 60);
      }

      if (gameState === "paused") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        ctx.font = "14px Arial";
        ctx.fillText(
          "Press SPACE to continue",
          canvas.width / 2,
          canvas.height / 2 + 35
        );
      }
    }
  }, [gameState, score, highScore, difficulty]);

  // Game loop
  useEffect(() => {
    // Cancel any existing game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    const gameLoop = () => {
      updateGame();
      renderGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState === "paused") {
      // Still render when paused, but don't update
      renderGame();
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, updateGame, renderGame]);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth - 10;
      const containerHeight = window.innerHeight - 80;

      // Make canvas cover almost the entire screen
      const baseWidth = Math.min(2400, containerWidth);
      const baseHeight = Math.min(1600, containerHeight);

      // Maintain aspect ratio but prioritize screen coverage
      const aspectRatio = 16 / 10;
      let width = baseWidth;
      let height = width / aspectRatio;

      if (height > baseHeight) {
        height = baseHeight;
        width = height * aspectRatio;
      }

      // Ensure minimum size for playability
      width = Math.max(width, 800);
      height = Math.max(height, 500);

      // Set canvas resolution (this affects sharpness)
      canvas.width = width;
      canvas.height = height;

      // Set CSS size to match exactly (prevents stretching/blurriness)
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startGame = () => {
    initGame();
    setGameState("playing");
    playSound("travel_start");
  };

  const restartGame = () => {
    // Cancel any existing game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    // Reset all state immediately
    setShowFact(null);
    setScore(0);
    setGameState("menu"); // Go back to menu first

    // Clear all game objects immediately
    gameObjects.current.asteroids = [];
    gameObjects.current.powerUps = [];
    gameObjects.current.particles = [];

    // Reset player
    const canvas = canvasRef.current;
    if (canvas) {
      const player = gameObjects.current.player;
      player.x = canvas.width / 2 - player.width / 2;
      player.y = canvas.height - player.height - 20;
      player.shield = false;
      player.shieldTime = 0;
    }

    // Small delay then start new game
    setTimeout(() => {
      initGame();
      setGameState("playing");
      playSound("travel_start");
    }, 100);
  };

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 bg-black z-40 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b border-blue-500/30">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          🚀 Asteroid Dodger
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-3xl md:text-4xl font-bold leading-none hover:bg-red-600/20 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-colors"
        >
          ×
        </button>
      </div>

      {/* Game Content */}
      <div className="flex-1 bg-slate-900/95 backdrop-blur-sm overflow-auto">
        <div className="p-4 md:p-6 h-full flex flex-col">
          {gameState === "menu" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
                <div className="space-y-4">
                  <h3 className="text-lg md:text-xl text-white font-bold">
                    Navigate through the asteroid field!
                  </h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Use arrow keys, WASD, or touch/tap to move your spacecraft.
                    Avoid asteroids and collect power-ups!
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-base md:text-lg text-white font-bold">
                    Choose Difficulty:
                  </h4>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                    <button
                      onClick={() => setDifficulty("inner")}
                      className={`px-6 md:px-8 py-4 md:py-6 rounded-lg transition-colors text-left ${
                        difficulty === "inner"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      <div className="text-sm md:text-base font-bold">
                        Inner Solar System
                      </div>
                      <div className="text-xs opacity-75">
                        Fewer, slower asteroids
                      </div>
                    </button>
                    <button
                      onClick={() => setDifficulty("outer")}
                      className={`px-6 md:px-8 py-4 md:py-6 rounded-lg transition-colors text-left ${
                        difficulty === "outer"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      <div className="text-sm md:text-base font-bold">
                        Outer Solar System
                      </div>
                      <div className="text-xs opacity-75">
                        More, faster asteroids
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs md:text-sm text-gray-400">
                  <p>🛡️ Shield Power-up: Protects you from one asteroid hit</p>
                  <p>⏰ Slow-Mo Power-up: Slows down asteroids temporarily</p>
                  <p>Press SPACE to pause during gameplay</p>
                </div>

                <button
                  onClick={startGame}
                  className="px-6 md:px-8 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base md:text-lg font-bold transition-colors"
                >
                  🚀 Start Game
                </button>

                {highScore > 0 && (
                  <p className="text-yellow-400 text-sm md:text-base font-bold">
                    🏆 High Score: {highScore}
                  </p>
                )}
              </div>
            </div>
          )}

          {(gameState === "playing" || gameState === "paused") && (
            <div className="flex-1 flex flex-col items-center justify-center p-1">
              <canvas
                ref={canvasRef}
                className="border border-slate-600 rounded-lg shadow-2xl max-w-full max-h-full"
              />
              <div className="mt-1 text-center text-gray-300">
                <p className="text-xs">
                  Use Arrow Keys, WASD, or Touch to move • Press SPACE to pause
                </p>
              </div>
            </div>
          )}

          {gameState === "gameOver" && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-6 md:space-y-8 max-w-2xl mx-auto px-4">
                <h3 className="text-xl md:text-2xl text-red-400 font-bold">
                  Game Over!
                </h3>
                <p className="text-lg md:text-xl text-white font-bold">
                  Final Score: {score}
                </p>

                {score === highScore && score > 0 && (
                  <p className="text-yellow-400 text-base md:text-lg font-bold">
                    🎉 New High Score!
                  </p>
                )}

                {showFact && (
                  <div className="bg-blue-900/50 rounded-lg p-4 md:p-6 max-w-lg mx-auto">
                    <h4 className="text-lg md:text-xl font-bold text-blue-300 mb-3">
                      {showFact.title}
                    </h4>
                    <p className="text-gray-300 mb-3 text-sm md:text-base">
                      {showFact.fact}
                    </p>
                    <p className="text-sm text-gray-400">
                      Source: {showFact.source}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={restartGame}
                    className="px-6 md:px-8 py-3 md:py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-base md:text-lg font-bold"
                  >
                    🚀 Play Again
                  </button>
                  <button
                    onClick={() => {
                      // Cancel any existing game loop
                      if (gameLoopRef.current) {
                        cancelAnimationFrame(gameLoopRef.current);
                        gameLoopRef.current = null;
                      }
                      setGameState("menu");
                      setShowFact(null);
                    }}
                    className="px-6 md:px-8 py-3 md:py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-base md:text-lg font-bold"
                  >
                    📋 Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsteroidDodger;
