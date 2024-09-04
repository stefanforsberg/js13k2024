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
    this.lives = 1;
    this.currentCollected = 0;
    this.discarding = false;
    this.discardLeftValue = 2000;
    this.discardLeft = this.discardLeftValue;

    this.state.body.addEventListener("mousemove", (event) => {
      this.x = event.clientX;
      this.y = event.clientY;
    });

    this.state.body.addEventListener("click", (event) => {
      if (this.discarding) {
        this.discarding = false;
      } else if (!this.discarding && this.discardLeft > 0) {
        this.discarding = true;
      }
    });

    this.state.eventEmitter.on("playerNewSum", this.collected.bind(this));
    this.state.eventEmitter.on("thirteen", this.thirteen.bind(this));
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
    }

    if (this.discardLeft < 0) {
      this.discarding = false;
      this.discardLeft = this.discardLeftValue;
    }
  }

  thirteen() {
    this.lives--;

    if (this.lives === 0) {
      this.state.eventEmitter.emit("death");
    }
  }

  collected(sum) {
    this.currentCollected = sum;
  }

  draw(ctx, elapsed) {
    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.fillStyle = "#ffffff";

    // ctx.shadowColor = "#ffffff"
    // ctx.shadowBlur = 15;
    // ctx.shadowOffsetX = 0;
    // ctx.shadowOffsetY = 0;

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

    if (this.discarding) {
      ctx.beginPath();
      ctx.fillStyle = "#80e8ff45";

      const discardHeight =
        this.height * (this.discardLeft / this.discardLeftValue);

      ctx.fillRect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        discardHeight
      );

      ctx.closePath();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = ((20 * this.state.scaleFactor) >> 0) + "px monospace";
    ctx.fillText(this.currentCollected, 0, 1);

    ctx.restore();

    // const alphaDiff = 1 / this.previousPositions.length;
    // let alpha = 1;

    // for (let i = this.previousPositions.length - 1; i >= 0; i--) {
    //   const pp = this.previousPositions[i];
    //   alpha -= alphaDiff;

    //   ctx.beginPath();
    //   ctx.strokeStyle = `rgba(255, 211, 128, ${Math.max(0.1, alpha)})`;
    //   ctx.rect(
    //     pp[0] - this.width / 2,
    //     pp[1] - this.height / 2,
    //     this.width,
    //     this.height
    //   );
    //   ctx.stroke();
    // }

    // this.previousPositions.push([this.x, this.y]);
  }
}
