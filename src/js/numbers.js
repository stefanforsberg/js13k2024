export class Number {
  constructor(state, number) {
    this.state = state;

    this.number = number ?? ((Math.random() * 13) >> 0) + 1;

    this.width = (50 * this.state.scaleFactor) >> 0;
    this.height = this.width;

    this.baseSpeed = 150;

    this.type = "number";

    this.colors = ["138, 80, 143", "255, 99, 97", "255, 133, 49"];
    this.reset();
  }

  reset() {
    const r = Math.random();

    if (r < 0.25) {
      this.x = (Math.random() * this.state.width) >> 0;
      this.y = -this.baseSpeed;
      this.dx = r < 0.12 ? this.baseSpeed : -this.baseSpeed;
      this.dy = this.baseSpeed;
    } else if (r < 0.5) {
      this.x = (Math.random() * this.state.width) >> 0;
      this.y = this.state.height + this.baseSpeed;
      this.dx = r < 0.37 ? this.baseSpeed : -this.baseSpeed;
      this.dy = -this.baseSpeed;
    } else if (r < 0.75) {
      this.x = this.state.width + this.baseSpeed;
      this.y = (Math.random() * this.state.height) >> 0;
      this.dx = -this.baseSpeed;
      this.dy = r < 0.63 ? this.baseSpeed : -this.baseSpeed;
    } else {
      this.x = -this.baseSpeed;
      this.y = (Math.random() * this.state.height) >> 0;
      this.dx = this.baseSpeed;
      this.dy = r < 0.88 ? this.baseSpeed : -this.baseSpeed;
    }

    this.alive = true;
    this.bounces = 4;

    this.number = ((Math.random() * 13) >> 0) + 1;

    this.color = this.colors[(Math.random() * this.colors.length) >> 0];
  }

  getCenter() {
    return [this.x + this.width / 2, this.y + this.height / 2];
  }

  update(deltaTime) {
    this.y += this.dy * deltaTime;
    this.x += this.dx * deltaTime;

    if (
      this.x > this.state.width - this.width &&
      this.dx > 0 &&
      this.bounces > 0
    ) {
      this.bounces--;
      this.dx = -1 * this.dx;
    }
    if (
      this.y > this.state.height - this.height &&
      this.dy > 0 &&
      this.bounces > 0
    ) {
      this.bounces--;
      this.dy = -1 * this.dy;
    }
    if (this.x < 0 && this.dx < 0 && this.bounces > 0) {
      this.bounces--;
      this.dx = -1 * this.dx;
    }
    if (this.y < 0 && this.dy < 0 && this.bounces > 0) {
      this.bounces--;
      this.dy = -1 * this.dy;
    }

    if (
      this.x < -150 ||
      this.y < -150 ||
      this.x > this.state.width + 150 ||
      this.y > this.state.height + 150
    ) {
      this.reset();
    }
  }

  draw(ctx, elapsed) {
    // if (this.number === 13) {
    //     ctx.strokeStyle = "#ff6361"
    //     ctx.fillStyle = "#ff6361"

    //     ctx.fillRect(this.x, this.y, this.width, this.height);
    //     ctx.fillStyle = "#121212"

    // } else {

    ctx.beginPath();
    ctx.strokeStyle = `rgba(${this.color})`;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    if (this.bounces > 0) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color})`;

      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (this.bounces > 1) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color})`;

      ctx.arc(this.x + this.width, this.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (this.bounces > 2) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color})`;

      ctx.arc(this.x, this.y + this.height, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (this.bounces > 3) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.color})`;

      ctx.arc(this.x + this.width, this.y + this.height, 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color})`;

    ctx.fillText(
      this.number,
      this.x + this.width / 2,
      this.y + this.height / 2 + 4
    );
  }
}
