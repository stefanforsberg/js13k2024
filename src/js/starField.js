export class StarField {
  stars = [];
  numStars = 200;
  shootingStars = [];

  constructor(state) {
    this.state = state;
  }

  reset() {
    this.stars = [];
    this.shootingStars = [];

    // Initialize stars
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push(this.createStar());
    }
  }

  createStar() {
    return {
      x: Math.random() * this.state.width,
      y: Math.random() * this.state.height,
      radius: 0.5 + Math.random() * 3,
      alpha: Math.random(),
      vx: 0.1 * ((Math.random() - 0.5) * 0.5),
      vy: 0.1 * ((Math.random() - 0.5) * 0.5),
      rx: Math.random() > 0.5 ? 1 : -1,
    };
  }

  update() {
    this.stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      star.alpha += (Math.random() - 0.5) * 0.01;
      if (star.alpha < 0) star.alpha = 0;
      if (star.alpha > 1) star.alpha = 1;

      star.radius += star.rx * 0.005;

      if (star.radius < 0.5 || star.radius > 5) star.rx *= -1;
    });

    if (this.shootingStars.length === 0) {
      const start = this.stars[Math.floor(Math.random() * this.stars.length)];
      const end = this.stars[Math.floor(Math.random() * this.stars.length)];

      const duration = 10;
      const fps = 60;

      const totalTimeInUpdates = duration * fps;
      const deltaX = (end.x - start.x) / totalTimeInUpdates;
      const deltaY = (end.y - start.y) / totalTimeInUpdates;

      this.shootingStars.push(start.x);
      this.shootingStars.push(start.y);
      this.shootingStars.push(end.x);
      this.shootingStars.push(end.y);
      this.shootingStars.push(deltaX);
      this.shootingStars.push(deltaY);
    } else {
      if (this.shootingStars.length > 0) {
        this.shootingStars[0] += this.shootingStars[4];
        this.shootingStars[1] += this.shootingStars[5];

        const dx = this.shootingStars[0] - this.shootingStars[2];
        const dy = this.shootingStars[1] - this.shootingStars[3];

        if (Math.sqrt(dx + dy) < 2) {
          this.shootingStars = [];
        }
      }
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    this.stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.3, star.alpha)})`;
      ctx.fill();
    });

    if (this.shootingStars.length > 0) {
      ctx.beginPath();
      ctx.arc(this.shootingStars[0], this.shootingStars[1], 3, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD64477";
      ctx.fill();
    }
  }
}
