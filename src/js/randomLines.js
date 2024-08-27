export class RandomLines {
    constructor(state) {
        this.state = state;

        this.lines = []

        this.state.eventEmitter.on('playerCollectedNumber', this.collected.bind(this));
        this.elapsed = 0;
        this.lineWidth = 0;

    }

    collected(item) {

        const [x, y] = item.getCenter();

        const angleIncrement = (2 * Math.PI) / item.number;

        const alpha = 0.45;

        const startAngle = Math.random();

        for (let i = 0; i < item.number; i++) {

            const angle = startAngle + i * angleIncrement;
            const endX = x + Math.max(this.state.width, this.state.height) * Math.cos(angle);
            const endY = y + Math.max(this.state.width, this.state.height) * Math.sin(angle);


            this.lines.push([x, y, endX, endY, alpha, item.color])


        }

        // this.lines.push([x, y, Math.random() * this.state.width, 0, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, 0, Math.random() * this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, Math.random() * this.state.width, this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, this.state.width, Math.random() * this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])

        // ;
    }

    draw(ctx, elapsed) {

        if (this.lines.length === 0) return;

        ctx.save();

        ctx.lineWidth = 1;

        for (const l of this.lines) {

            ctx.strokeStyle = `RGBA(${l[5]}, ${l[4]})`

            ctx.beginPath();

            ctx.moveTo(l[0], l[1]);



            ctx.lineTo(l[2], l[3]);

            ctx.stroke();

            l[4] -= 0.003
        }


        ctx.restore();

        this.lines = this.lines.filter(x => x[4] > 0)



    }
}