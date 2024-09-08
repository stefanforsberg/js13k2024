import { Player } from "./player";
import { Number } from "./numbers";
import { RandomLines } from "./randomLines";
import { StarField } from "./starField";

class Collector {
  constructor(state) {
    this.state = state;
    this.index = 0;
    this.collected = [];

    this.types = {
      "+++": {
        display: () => {
          this.state.collectors[1].innerText = "+";
          this.state.collectors[1].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[3].innerText = "+";
          this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[5].innerText = "+";
          this.state.collectors[5].style.backgroundColor = "var(--main-yellow)";
        },
        sum: () => {
          return this.collected.slice(0, 4).reduce((p, c) => p + c.number, 0);
        },
        addItem: (item) => {
          this.collected.push(item);
          this.flashNumber(item, this.index);
          this.index += 2;
        },
      },
      "++-": {
        display: () => {
          this.state.collectors[1].innerText = "+";
          this.state.collectors[1].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[3].innerText = "+";
          this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[5].innerText = "-";
          this.state.collectors[5].style.backgroundColor = "var(--main-yellow)";
        },
        sum: () => {
          return this.collected
            .slice(0, 4)
            .reduce((p, c, i) => p + c.number * (i === 3 ? -1 : 1), 0);
        },
        addItem: (item) => {
          this.collected.push(item);
          this.flashNumber(item, this.index);

          this.index += 2;
        },
      },
      ">": {
        display: () => {
          this.state.collectors[1].innerText = "";
          this.state.collectors[1].style.backgroundColor = "var(--main-black)";
          this.state.collectors[3].innerText = ">";
          this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[5].innerText = "";
          this.state.collectors[5].style.backgroundColor = "var(--main-black)";
        },
        sum: () => {
          if (this.collected.length < 4) return 0;

          const a = parseInt(
            `${this.collected[0].number}${this.collected[1].number}`
          );
          const b = parseInt(
            `${this.collected[2].number}${this.collected[3].number}`
          );

          return a > b ? a - b : 0;
        },
        addItem: (item) => {
          this.collected.push(item);
          this.flashNumber(item, this.index);

          this.index += 2;
        },
      },
      "<": {
        display: () => {
          this.state.collectors[1].innerText = "";
          this.state.collectors[1].style.backgroundColor = "var(--main-black)";
          this.state.collectors[3].innerText = "<";
          this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[5].innerText = "";
          this.state.collectors[5].style.backgroundColor = "var(--main-black)";
        },
        sum: () => {
          if (this.collected.length < 4) return 0;

          const a = parseInt(
            `${this.collected[0].number}${this.collected[1].number}`
          );
          const b = parseInt(
            `${this.collected[2].number}${this.collected[3].number}`
          );

          return a < b ? b - a : 0;
        },
        addItem: (item) => {
          this.collected.push(item);
          this.flashNumber(item, this.index);

          this.index += 2;
        },
      },
      ">>>": {
        display: () => {
          this.state.collectors[1].innerText = ">";
          this.state.collectors[1].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[3].innerText = ">";
          this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
          this.state.collectors[5].innerText = ">";
          this.state.collectors[5].style.backgroundColor = "var(--main-yellow)";
        },
        sum: () => {
          if (this.collected.length < 4) return 0;

          if (
            this.collected[0].number > this.collected[1].number &&
            this.collected[1].number > this.collected[2].number &&
            this.collected[2].number > this.collected[3].number
          ) {
            return this.collected[0].number * this.collected[1].number;
          }

          return 0;
        },
        addItem: (item) => {
          this.collected.push(item);
          this.flashNumber(item, this.index);

          this.index += 2;
        },
      },
    };

    this.typeKeys = Object.keys(this.types);

    this.state.eventEmitter.on(
      "playerCollectedNumber",
      this.addItem.bind(this)
    );
  }

  flashNumber(item, index) {
    this.state.collectors[index].innerText = item.number;
    this.state.collectors[index].style.color = "var(--main-black)";

    this.state.collectors[index].style.transition =
      "background-color 0.3s ease";
    this.state.collectors[index].style.backgroundColor = `rgb(${item.color})`;
  }

  level1() {
    this.index = 0;
    this.collected = [];

    this.currentType =
      this.typeKeys[Math.floor(Math.random() * this.typeKeys.length)];

    for (const collector of this.state.collectors) {
      collector.innerText = "";
      collector.style.border = `solid 1px var(--score-border-color)`;
      collector.style.backgroundColor = "var(--main-light)";
    }

    this.types[this.currentType].display();
  }

  getHand(cards) {
    cards.sort((a, b) => a - b);

    const isStraight = (cards) => {
      return cards[3] - cards[0] === 3 && new Set(cards).size === 4;
    };

    if (isStraight(cards)) {
      return this.state.handScores.STRAIGHT;
    }

    const freq = {};
    for (const card of cards) {
      freq[card] = (freq[card] || 0) + 1;
    }

    const frequencies = Object.values(freq).sort((a, b) => b - a);

    if (frequencies[0] === 4) {
      return this.state.handScores.FOAK;
    } else if (frequencies[0] === 3) {
      return this.state.handScores.TOAK;
    } else if (frequencies[0] === 2 && frequencies[1] === 2) {
      return this.state.handScores.TWOPAIR;
    } else if (frequencies[0] === 2) {
      return this.state.handScores.PAIR;
    } else {
      return ["", 1];
    }
  }

  addItem(item, elapsed) {
    this.types[this.currentType].addItem(item);

    let sum = this.types[this.currentType].sum();

    if (item.number === 13 || sum === 13) {
      this.state.eventEmitter.emit("thirteen");

      this.level1();
    }

    if (this.collected.length === 4) {
      const colors = new Set(this.collected.map((x) => x.color));

      const hand = this.getHand(this.collected.map((x) => x.number));

      if (hand[1] > 1) {
        this.state.eventEmitter.emit("handBonus", hand[0]);
      }

      sum = sum * hand[1];

      if (colors.size === 1) {
        sum = sum * this.state.handScores.COLOR;
        this.state.eventEmitter.emit("colorBonus");
      }

      let timeBonus = 1;

      if (elapsed < 7000) {
        timeBonus = 2;
      } else if (elapsed < 15000) {
        timeBonus = 1.5;
      }

      if (timeBonus > 1) {
        sum = sum * timeBonus;
        this.state.eventEmitter.emit("timeBonus");
      }

      sum = sum >> 0;

      this.level1();
      this.state.eventEmitter.emit("finishedLevel", sum);
      this.state.eventEmitter.emit("playerNewSum", 0);
    } else {
      this.state.eventEmitter.emit("playerNewSum", sum);
    }
  }
}

class Score {
  constructor(state, score, x, y, dx, dy, baseScale, color) {
    this.state = state;
    this.color = color;
    this.pulseSize = (100 * baseScale * (this.state.scaleFactor / 2)) >> 0;
    this.pulseDelta = [
      (this.pulseSize + this.pulseSize * 0.1) >> 0,
      (this.pulseSize - this.pulseSize * 0.1) >> 0,
    ];

    this.glowAlpha = 1;
    this.glowDirection = -0.05;
    this.score = score;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.alive = true;
    this.pulseDirection = 0.5;
    this.elapsed = 0;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    this.pulseSize += this.pulseDirection;
    if (
      this.pulseSize > this.pulseDelta[0] ||
      this.pulseSize < this.pulseDelta[1]
    ) {
      this.pulseDirection *= -1;
    }

    if (this.fade) {
      this.glowAlpha -= 0.05;

      if (this.glowAlpha <= 0) {
        this.alive = false;
      }

      return;
    }

    this.glowAlpha += this.glowDirection;

    if (this.glowAlpha <= 0.5 || this.glowAlpha >= 1) {
      this.glowDirection *= -1;
    }
  }

  draw(ctx, elapsed) {
    this.elapsed += elapsed;

    if (this.elapsed > 750 && !this.fade) {
      this.fade = true;
    }

    ctx.save();
    ctx.font = `${this.pulseSize >> 0}px Arial`;
    ctx.fillStyle = `rgba(${this.color}, ${this.glowAlpha})`;
    ctx.fillText(this.score, this.x, this.y);
    ctx.restore();
  }
}

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
    this.state.gameOverText.innerHTML = `Your score is ${this.score}.<br/>Click to try again.`;

    this.state.gameOver.style.display = "block";

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
    this.started = true;
    this.state.shop.style.display = "none";
  }

  finishedLevel(score) {
    this.levelStarted = 0;

    this.showShop();

    this.score += score;
    this.state.score.innerText = `${this.score} (${score})`;

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
