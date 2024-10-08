import { Game } from "./game";
import { EventEmitter } from "./eventEmitter";
import Sounds from "./music/sounds";

const load = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const startfieldCanvas = document.getElementById("starField");
  const startfieldCtx = startfieldCanvas.getContext("2d");

  const state = {
    canvas,
    ctx,
    body: document.querySelector("body"),
    gameOver: document.getElementById("game-over"),
    gameOverText: document.getElementById("game-over-text"),
    gameOverStat: document.getElementById("game-over-stat"),
    gameStart: document.getElementById("game-start"),
    gameLoading: document.getElementById("game-loading"),
    scoreContainer: document.getElementById("score-container"),
    hud: document.getElementById("hud"),
    score: document.getElementById("score"),
    shop: document.getElementById("shop"),
    shop1: document.getElementById("shop-1"),
    shop2: document.getElementById("shop-2"),
    shop3: document.getElementById("shop-3"),
    shop4: document.getElementById("shop-4"),
    collectors: [
      document.getElementById("collected-1"),
      document.getElementById("collected-2"),
      document.getElementById("collected-3"),
      document.getElementById("collected-4"),
      document.getElementById("collected-5"),
      document.getElementById("collected-6"),
      document.getElementById("collected-7"),
    ],
    eventEmitter: new EventEmitter(),
    startfieldCanvas,
    startfieldCtx,
    sounds: new Sounds(this),
    reset: () => {
      state.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      state.numbersSpeed = 100;
      state.numbersBounce = 1;
      state.handScores = {
        FOAK: ["FOAK", 100],
        TOAK: ["TOAK", 30],
        TWOPAIR: ["TWO PAIRS", 10],
        PAIR: ["PAIR", 10],
        STRAIGHT: ["STRAIGHT", 75],
        COLOR: 3,
      };
      state.colors = ["255, 61, 109", "253, 140, 44", "60, 252, 140"];
    },
    load: () => {
      const d = localStorage.getItem("sf.itaddsup.data");
      if (d) {
        return JSON.parse(d);
      } else {
        return { score: 0, combo: 0 }
      }
    },
    save: (score, combo) => {
      localStorage.setItem("sf.itaddsup.data", JSON.stringify({ score, combo }));
    }
  };

  state.reset();

  state.shop1.addEventListener("click", (event) => {
    event.stopPropagation();
    state.eventEmitter.emit("shopChoice", "one");
  });

  state.shop2.addEventListener("click", (event) => {
    event.stopPropagation();
    state.eventEmitter.emit("shopChoice", "two");
  });

  state.shop3.addEventListener("click", (event) => {
    event.stopPropagation();
    state.eventEmitter.emit("shopChoice", "three");
  });

  state.shop4.addEventListener("click", (event) => {
    event.stopPropagation();
    state.eventEmitter.emit("shopChoice", "four");
  });

  state.sounds.load(() => {
    state.gameLoading.style.display = "none";

    const d = state.load();

    state.gameStart.querySelector(".instruction").innerHTML = `<h2>Click to start</h2><p>High score: ${d.score}</p><p>Best combo: ${d.combo}</p>`

    state.gameStart.style.display = "block";
  });

  document.querySelector("#game-start").addEventListener("click", (event) => {
    event.stopPropagation();
    const game = new Game(state);
    game.reset();
    state.gameStart.style.display = "none";
    state.game = game;
    game.draw(0);
  });

  document.querySelector("#game-over").addEventListener("click", (event) => {
    event.stopPropagation();
    state.reset();
    state.game.reset();
    state.gameOver.style.display = "none";
  });

  const resizeCanvas = () => {
    state.ctx.canvas.width = window.innerWidth;
    state.ctx.canvas.height = window.innerHeight;
    state.width = ctx.canvas.width;
    state.height = ctx.canvas.height;
    state.scaleFactor = Math.min(
      ctx.canvas.width / 800,
      ctx.canvas.height / 600
    );
    state.ctx.font = ((35 * state.scaleFactor) >> 0) + "px monospace";
    state.ctx.textAlign = "center";
    state.ctx.textBaseline = "middle";

    state.startfieldCtx.canvas.width = window.innerWidth;
    state.startfieldCtx.canvas.height = window.innerHeight;
  };

  window.addEventListener("resize", () => resizeCanvas());
  resizeCanvas();
};

load();
