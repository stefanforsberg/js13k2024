export class Number {
    constructor(state, number) {
        this.state = state;

        this.number = number ?? ((Math.random() * 13 >> 0) + 1)

        this.width = (50 * this.state.scaleFactor >> 0)
        this.height = this.width;
        this.alive = true;
        this.reset();
    }

    reset() {
        this.x = (Math.random() * this.state.width >> 0);
        this.y = Math.random() >= 0.5 ? this.state.height + 100 : -100;
        this.dx = 100;
        this.dy = 100;
    }

    update(deltaTime) {
        this.y += this.dy * deltaTime;
        this.x += this.dx * deltaTime;

        if (this.x > (this.state.width - this.width) && this.dx > 0) {
            this.dx = -1 * this.dx;
        }
        if (this.y > (this.state.height - this.height) && this.dy > 0) {
            this.dy = -1 * this.dy;
        }
        if (this.x < 0 && this.dx < 0) {
            this.dx = -1 * this.dx;
        }
        if (this.y < 0 && this.dy < 0) {
            this.dy = -1 * this.dy;
        }
    }

    draw(ctx, elapsed) {

        if (this.number === 13) {
            ctx.strokeStyle = "#ff6361"
            ctx.fillStyle = "#ff6361"

            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#121212"

        } else {
            ctx.strokeStyle = "#ff6361"
            ctx.fillStyle = "#ff636100"
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#ff6361"
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }

        ctx.fillText(this.number, this.x + this.width / 2, this.y + this.height / 2 + 4);



    }
}