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
    this.score = 0;

    this.randomLines = new RandomLines(this.state);
    this.startField = new StarField(this.state);

    this.state.eventEmitter.on("death", this.death.bind(this));
    this.state.eventEmitter.on("finishedLevel", this.finishedLevel.bind(this));
    this.state.eventEmitter.on("colorBonus", this.colorBonus.bind(this));
    this.state.eventEmitter.on("handBonus", this.handBonus.bind(this));
    this.state.eventEmitter.on("timeBonus", this.timeBonus.bind(this));

    this.state.eventEmitter.on("shopChoice", this.shopShoice.bind(this));

    this.state.sounds.playSong(0);

    this.reset();
  }

  reset() {

    this.log = {
      hands: [],
      shop: []
    }

    this.shopOptions = [
      {
        description: "Numbers move more quickly",
        act: () => {
          this.state.numbersSpeed *= 1.1;
        },
      },
      {
        description: "Numbers bounce one more time",
        act: () => {
          this.state.numbersBounce++;
        },
      },
    ];

    this.prevTime = 0;
    this.items = [];
    this.numberQueue = [];

    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.levelStarted = 0;

    this.randomLines.reset();
    this.startField.reset();

    this.state.canvas.style.opacity = 1;
    this.state.startfieldCanvas.style.opacity = 1;

    this.state.scoreContainer.style.display = "block";
    this.state.hud.style.display = "block";


    this.state.score.innerText = '0'

    this.started = true;
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
    document.querySelector("body").style.cursor = "auto";

    const hands = this.log.hands.map(h => `${h}<br>`).join("")
    const shops = this.log.shop.map(s => `${s}<br>`).join("")

    this.state.gameOverText.innerHTML = `Your score is ${this.score}.<br/>Click to try again.`

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

    const shopItem1 =
      this.shopOptions[Math.floor(Math.random() * this.shopOptions.length)];
    const shopItem2 =
      this.shopOptions[Math.floor(Math.random() * this.shopOptions.length)];
    const shopItem3 =
      this.shopOptions[Math.floor(Math.random() * this.shopOptions.length)];

    this.state.shop.style.display = "grid";
    this.state.shop1.innerText = shopItem1.description;
    this.state.shop2.innerText = shopItem2.description;
    this.state.shop3.innerText = shopItem3.description;

    this.currentShop = {
      one: shopItem1,
      two: shopItem2,
      three: shopItem3,
    };

    document.querySelector("body").style.cursor = "auto";
  }

  shopShoice(choice) {
    this.currentShop[choice].act();

    this.log.shop.push(this.currentShop[choice].description)

    this.started = true;
    this.state.shop.style.display = "none";
  }

  finishedLevel(score, log) {
    this.levelStarted = 0;

    this.log.hands.push(log)

    this.showShop();

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

  setLevel() {
    this.numberIntervalValue = 1000;
    this.numbersMax = 20;

    this.numberInterval = this.numberIntervalValue;

    this.state.gameOver.style.display = "none";
    document.querySelector("body").style.cursor = "none";

    this.collector = new Collector(this.state);
    this.collector.level1();

    this.player = new Player(this.state);

    for (let i = 0; i < 4; i++) {
      this.numberQueue.push(new Number(this.state));
    }
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

      if (this.accumulatedTime > 50) {
        console.log(this.accumulatedTime, this.fixedTimeStep);
      }

      while (this.accumulatedTime >= this.fixedTimeStep) {
        this.startField.update();

        for (const item of this.items) {
          item.update(this.deltaTime);

          if (
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

      this.numberInterval -= this.fixedTimeStep;

      if (this.numberInterval <= 0) {
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

      this.startField.draw(this.state.startfieldCtx);

      this.randomLines.draw(this.state.ctx, elapsed);

      for (const item of this.items) {
        item.draw(this.state.ctx, elapsed);
      }

      this.player.draw(this.state.ctx);
    } else {
      this.prevTime = timestamp;
      this.lastTime = timestamp;
    }

    requestAnimationFrame((ticks) => this.draw(ticks));
  }
}
