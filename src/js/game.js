import { Player } from "./player";
import { Number } from "./numbers";
import { RandomLines } from "./randomLines";
import { StarField } from "./starField";
import { Score } from "./score";
import { Collector } from "./collector";

export class Game {
  started = true;
  prevTime = 0;
  items = [];
  numberQueue = [];

  lastTime = 0;
  fixedTimeStep = 1000 / 60;
  accumulatedTime = 0;
  deltaTime = this.fixedTimeStep / 1000;
  levelStarted = 0;

  constructor(state) {
    this.state = state;
    this.mouseX = 0;
    this.mouseY = 0;

    this.randomLines = new RandomLines(this.state);
    this.starField = new StarField(this.state);

    this.collector = new Collector(this.state);
    this.player = new Player(this.state);

    this.state.eventEmitter.on("death", this.death.bind(this));
    this.state.eventEmitter.on("finishedLevel", this.finishedLevel.bind(this));
    this.state.eventEmitter.on("colorBonus", this.colorBonus.bind(this));
    this.state.eventEmitter.on("handBonus", this.handBonus.bind(this));
    this.state.eventEmitter.on("timeBonus", this.timeBonus.bind(this));
    this.state.eventEmitter.on("thirteen", this.thirteen.bind(this));


    this.state.eventEmitter.on("shopChoice", this.shopChoice.bind(this));



    this.reset();
  }

  reset() {

    this.score = 0;

    this.screenShake = false;

    this.isPlayerCollidable = 0;

    this.levelsCompleted = 0;

    this.bestRoundCombo = 0;

    this.state.gameOver.style.display = "none";
    document.querySelector("body").style.cursor = "none";

    this.collector.level1(this.levelsCompleted);

    this.player.reset();

    this.state.sounds.playSong(0, 1);
    this.state.sounds.playSong(3);



    this.numberIntervalValue = 1500;
    this.numbersMax = 20;

    this.numberInterval = this.numberIntervalValue;

    this.log = {
      hands: [],
      shop: []
    }

    this.shopOptions = {}

    this.shopOptions.misc = [
      {
        description: "Numbers bounce one more time",
        act: () => {
          this.state.numbersBounce++;
        },
      },
      {
        description: "Numbers more likely to be pink",
        act: () => {
          this.state.colors.push("255, 61, 109");
        },
      },
      {
        description: "Numbers more likely to be orange",
        act: () => {
          this.state.colors.push("253, 140, 44");
        },
      },
      {
        description: "Numbers more likely to be green",
        act: () => {
          this.state.colors.push("60, 252, 140");
        },
      }
    ]

    this.shopOptions.numbers = [
      {
        description: "Numbers more likely to be even",
        act: () => {
          this.state.numbers.push(2);
          this.state.numbers.push(4);
          this.state.numbers.push(6);
          this.state.numbers.push(8);
          this.state.numbers.push(10);
          this.state.numbers.push(12);
        },
      },
      {
        description: "Numbers more likely to be odd",
        act: () => {
          this.state.numbers.push(1);
          this.state.numbers.push(3);
          this.state.numbers.push(5);
          this.state.numbers.push(7);
          this.state.numbers.push(9);
          this.state.numbers.push(11);
          this.state.numbers.push(13);
        },
      }
    ];

    for (let i = 1; i <= 12; i++) {
      this.shopOptions.numbers.push({
        description: "Number more likely to be " + i,
        act: () => {
          this.state.numbers.push(i);
        },
      })
    }

    for (let i = 1; i <= 12; i++) {
      this.shopOptions.numbers.push({
        description: "Number less likely to be " + i,
        act: () => {
          const index = this.state.numbers.findIndex(x => x === i)
          if (index > -1) {
            this.state.numbers.splice(index, 1);
          }
        },
      })
    }

    this.shopOptions.hands = [
      {
        description: "Increase multiplier of pair",
        act: () => {
          this.state.handScores.PAIR[1] *= 1.1;
        },
      },
      {
        description: "Increase multiplier of two pairs",
        act: () => {
          this.state.handScores.TWOPAIR[1] *= 1.1;
        },
      },
      {
        description: "Increase multiplier of straight",
        act: () => {
          this.state.handScores.STRAIGHT[1] *= 1.1;
        },
      },
      {
        description: "Increase multiplier of three of a kind",
        act: () => {
          this.state.handScores.TOAK[1] *= 1.1;
        },
      },
      {
        description: "Increase multiplier of four of a kind",
        act: () => {
          this.state.handScores.FOAK[1] *= 1.1;
        },
      },
      {
        description: "Increase multiplier of same color hand",
        act: () => {
          this.state.handScores.COLOR *= 1.5;
        },
      },
    ]

    this.shopOptions.mixed = [
      {
        description: "Number more likely to be 13",
        act: () => {
          this.state.numbers.push(13);
        },
      },
      {
        description: "Gain 1 life and number more likely to be 13",
        act: () => {
          this.state.numbers.push(13);
          this.player.lives = Math.min(this.player.lives + 1, 4)
        },
      }
    ]

    this.prevTime = 0;
    this.items = [];
    this.numberQueue = [];

    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.levelStarted = 0;

    this.randomLines.reset();
    this.starField.reset();

    this.state.canvas.style.opacity = 1;
    this.state.startfieldCanvas.style.opacity = 1;

    this.state.scoreContainer.style.display = "block";
    this.state.hud.style.display = "block";


    this.state.score.innerText = '0'

    for (let i = 0; i < 10; i++) {
      this.numberQueue.push(new Number(this.state));
    }

    this.started = true;
  }

  thirteen() {
    this.screenShake = true;

    setTimeout(() => { this.screenShake = false }, 300);
  }

  colorBonus() {
    this.items.push(
      new Score(
        this.state,
        "🎨",
        this.player.x,
        this.player.y,
        -0.5,
        0,
        0.4,
        "255, 99, 97"
      )
    );
  }

  handBonus(hand) {
    this.items.push(
      new Score(
        this.state,
        hand,
        this.player.x,
        this.player.y,
        0,
        1,
        0.6,
        "255, 211, 128"
      )
    );
  }

  timeBonus() {
    this.items.push(
      new Score(
        this.state,
        "⏱️",
        this.player.x,
        this.player.y,
        0.5,
        0,
        0.4,
        "255, 211, 128"
      )
    );
  }

  death() {

    this.state.sounds.stopSong(0);
    this.state.sounds.sfx(2);

    document.querySelector("body").style.cursor = "auto";

    const hands = this.log.hands.map(h => `${h}<br>`).join("")
    const shops = this.log.shop.map(s => `${s}<br>`).join("")

    let gameOverText = '';

    let loadedScore = this.state.load();

    if (this.score > loadedScore.score) {
      gameOverText += `<p>Your score is ${this.score}, this is a new record!<p>`
      loadedScore.score = this.score;
    } else {
      gameOverText += `<p>Your score is ${this.score}, not quite as high as ${loadedScore.score}.</p>`
    }

    if (this.bestRoundCombo > loadedScore.combo) {
      gameOverText += `<p>Your best combo is ${this.bestRoundCombo}, this is a new record!<p>`
      loadedScore.combo = this.bestRoundCombo;
    } else {
      gameOverText += `<p>Your best combo is ${this.bestRoundCombo}, not quite as high as ${loadedScore.combo}.</p>`
    }

    this.state.save(loadedScore.score, loadedScore.combo);

    this.state.gameOverText.innerHTML = gameOverText + "<br/>Click to try again.";

    this.state.gameOverStat.innerHTML = `<div>${hands}</div><div>${shops}</div>`;

    this.state.gameOver.style.display = "block";

    this.state.scoreContainer.style.display = "none";
    this.state.hud.style.display = "none";

    this.state.canvas.style.opacity = 0.1;
    this.state.startfieldCanvas.style.opacity = 0.1;

    this.started = false;
  }

  showShop() {
    this.started = false;

    this.state.sounds.fade(3, 0);

    const shopItem1 =
      this.shopOptions.misc[Math.floor(Math.random() * this.shopOptions.misc.length)];
    const shopItem2 =
      this.shopOptions.numbers[Math.floor(Math.random() * this.shopOptions.numbers.length)];
    const shopItem3 =
      this.shopOptions.hands[Math.floor(Math.random() * this.shopOptions.hands.length)];
    const shopItem4 =
      this.shopOptions.mixed[Math.floor(Math.random() * this.shopOptions.mixed.length)];

    this.state.shop.style.display = "grid";
    this.state.shop1.innerText = shopItem1.description;
    this.state.shop2.innerText = shopItem2.description;
    this.state.shop3.innerText = shopItem3.description;
    this.state.shop4.innerText = shopItem4.description;

    this.currentShop = {
      one: shopItem1,
      two: shopItem2,
      three: shopItem3,
      four: shopItem4
    };

    document.querySelector("body").style.cursor = "auto";
  }

  shopChoice(choice) {

    this.currentShop[choice].act();

    this.log.shop.push(this.currentShop[choice].description)

    this.state.sounds.fade(0, 3);

    this.started = true;
    this.state.shop.style.display = "none";

    this.isPlayerCollidable = 300;
  }

  finishedLevel(score, log) {

    if (score === 0) {

      for (const n of this.items.filter(x => x.type === "number")) {
        n.punishment();

        setTimeout(() => {
          n.repent();
        }, 6000)
      }

      return;
    }

    this.bestRoundCombo = Math.max(this.bestRoundCombo, score);

    this.levelStarted = 0;

    this.log.hands.push(log)

    this.levelsCompleted++;

    if (this.levelsCompleted % 3 === 0) {

      this.numberIntervalValue = Math.max(100, this.numberIntervalValue - 15);
      this.numbersMax++;
      this.state.numbersSpeed *= 1.05;
      this.numberQueue.push(new Number(this.state));

      this.showShop();
    }

    this.score += score;
    this.state.score.innerText = `${this.score}`;

    this.items.push(
      new Score(
        this.state,
        score,
        this.player.x,
        this.player.y,
        0,
        -0.5,
        1,
        "255,255,255"
      )
    );
  }

  areRectanglesColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  draw(timestamp) {

    if (this.started) {
      let elapsed = timestamp - this.prevTime;

      this.levelStarted += elapsed;

      this.prevTime = timestamp;

      let elapsedTime = timestamp - this.lastTime;
      this.lastTime = timestamp;
      this.accumulatedTime += elapsedTime;

      if (this.isPlayerCollidable > 0) {
        this.isPlayerCollidable = Math.max(0, this.isPlayerCollidable - elapsedTime);
      }

      while (this.accumulatedTime >= this.fixedTimeStep) {
        this.starField.update();

        for (const item of this.items) {
          item.update(this.deltaTime);

          if (
            this.isPlayerCollidable === 0 &&
            item.alive &&
            item.type === "number" &&
            this.areRectanglesColliding(item, this.player.getCollisionRect())
          ) {
            item.alive = false;

            this.numberQueue.push(new Number(this.state));

            if (!this.player.discarding) {
              this.state.eventEmitter.emit(
                "playerCollectedNumber",
                item,
                this.levelStarted
              );
            }
          }
        }

        this.player.update(this.deltaTime);

        this.items = this.items.filter((x) => x.alive);

        this.accumulatedTime -= this.fixedTimeStep;
      }




      if (this.numberInterval > 0) {
        if (this.numberQueue.length > 0) {
          this.numberInterval -= elapsedTime;
        }
      }
      else if (this.numberInterval <= 0) {
        if (this.numberQueue.length > 0) {
          if (
            this.items.filter((x) => x.type && x.type === "number").length <
            this.numbersMax
          ) {
            const nextNumber = this.numberQueue.pop();
            nextNumber.reset();
            this.items.push(nextNumber);
            this.numberInterval = this.numberIntervalValue;
          }
        }
      }

      this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);

      this.state.ctx.save();

      if (this.screenShake) {
        this.state.ctx.translate(-20 + 40 * Math.random(), -20 + 40 * Math.random());
      }

      this.starField.draw(this.state.startfieldCtx);

      this.randomLines.draw(this.state.ctx, elapsed);

      for (const item of this.items) {
        item.draw(this.state.ctx, elapsed);
      }

      this.player.draw(this.state.ctx);

      this.state.ctx.restore();
    } else {
      this.prevTime = timestamp;
      this.lastTime = timestamp;
    }

    requestAnimationFrame((ticks) => this.draw(ticks));
  }
}
