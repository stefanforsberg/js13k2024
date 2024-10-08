export class Player {
  constructor(state) {
    this.state = state;
    this.x = 0;
    this.y = 0;
    this.rot = 0;
    this.width = (40 * this.state.scaleFactor) >> 0;
    this.height = (40 * this.state.scaleFactor) >> 0;
    this.rot = 0;
    this.color;


    this.state.body.addEventListener("mousemove", (event) => {
      this.x = event.clientX;
      this.y = event.clientY;
    });

    this.state.body.addEventListener("click", (event) => {
      if (!state.game || !state.game.started) return;

      if (this.discarding) {
        this.discarding = false;
      } else {
        this.discarding = true;
      }
    });

    this.state.eventEmitter.on("playerNewSum", this.collected.bind(this));
    this.state.eventEmitter.on("thirteen", this.thirteen.bind(this));

  }

  reset() {
    this.lives = 4;
    this.currentCollected = 0;
    this.discarding = false;
    this.discardLeftValue = 3000;
    this.discardLeft = this.discardLeftValue;
  }

  getCollisionRect() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  update(elapsed) {
    if (this.discarding) {
      this.discardLeft -= elapsed * 1000;

      if (this.discardLeft < 0) {
        this.discarding = false;
        this.discardLeft = 0;
      }
    } else {
      if (this.discardLeft < this.discardLeftValue) {
        this.discardLeft += elapsed * 100;
        this.discardLeft = Math.min(this.discardLeft, this.discardLeftValue)
      }
    }
  }

  thirteen() {
    this.lives--;

    if (this.lives === 0) {
      this.state.eventEmitter.emit("death");
    }

    this.currentCollected = 0;
  }

  collected(sum) {
    this.currentCollected = sum;
  }

  draw(ctx, elapsed) {
    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.fillStyle = "#ffffff";

    ctx.lineWidth = 3;
    ctx.strokeStyle = this.discarding ? "#80e8ff" : "#FFD644";

    ctx.stroke();

    ctx.closePath();

    const w2 = this.width / 2;

    ctx.fillStyle = "#7fffd6";

    if (this.lives > 0) {
      ctx.beginPath();
      ctx.arc(-w2, -w2, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
    if (this.lives > 1) {
      ctx.beginPath();
      ctx.arc(w2, -w2, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
    if (this.lives > 2) {
      ctx.beginPath();
      ctx.arc(-w2, w2, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
    if (this.lives > 3) {
      ctx.beginPath();
      ctx.arc(w2, w2, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }


    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = "#80e8ffbb";
    ctx.strokeStyle = "#80e8ff";

    ctx.fillRect(
      -this.width / 2,
      10 + this.height / 2,
      this.width * (this.discardLeft / this.discardLeftValue),
      10
    );

    ctx.strokeRect(-this.width / 2, 10 + this.height / 2, this.width, 10);

    ctx.fillStyle = "#ffffff";
    ctx.font = ((20 * this.state.scaleFactor) >> 0) + "px monospace";
    ctx.fillText(this.currentCollected, 0, 1);

    ctx.restore();
  }
}
