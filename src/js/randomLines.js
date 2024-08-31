export class RandomLines {
  constructor(state) {
    this.state = state;

    this.lines = [];

    this.state.eventEmitter.on(
      "playerCollectedNumber",
      this.collected.bind(this)
    );
    this.elapsed = 0;
    this.lineWidth = 0;
  }

  collected(item) {
    const [x, y] = item.getCenter();

    const lines = [];

    const numberOfLines = Math.max(2, item.number);

    const angleIncrement = (2 * Math.PI) / numberOfLines;

    const alpha = 0.45;

    const startAngle = Math.random();

    for (let i = 0; i < numberOfLines; i++) {
      const angle = startAngle + i * angleIncrement;
      const endX =
        Math.max(this.state.width, this.state.height) * Math.cos(angle);
      const endY =
        Math.max(this.state.width, this.state.height) * Math.sin(angle);

      lines.push([
        x,
        y,
        endX,
        endY,
        alpha,
        item.color,
        1,
        Math.random(),
        Math.random() > 0.5 ? 1 : -1,
      ]);
    }

    this.lines.push(lines);
  }

  draw(ctx, elapsed) {
    if (this.lines.length === 0) return;

    for (const lines of this.lines) {
      ctx.save();
      ctx.translate(lines[0][0], lines[0][1]);
      ctx.rotate(lines[0][7]);

      ctx.shadowColor = "white";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 10;

      for (const l of lines) {
        ctx.strokeStyle = `RGBA(${l[5]}, ${l[4]})`;

        ctx.lineWidth = l[6];

        ctx.beginPath();

        ctx.moveTo(0, 0);

        ctx.lineTo(l[2], l[3]);

        ctx.stroke();

        l[4] -= 0.006;
        l[6] += 0.1;
        l[7] += 0.002 * l[8];
      }

      ctx.restore();
    }

    this.lines = this.lines.filter((x) => x[0][4] > 0);
  }
}
