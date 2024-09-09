export class Score {
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
        if (this.pulseSize > this.pulseDelta[0] ||
            this.pulseSize < this.pulseDelta[1]) {
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
        ctx.font = `${this.pulseSize >> 0}px monospace`;
        ctx.fillStyle = `rgba(${this.color}, ${this.glowAlpha})`;
        ctx.fillText(this.score, this.x, this.y);
        ctx.restore();
    }
}
