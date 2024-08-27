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

        const lines = Math.max(2, item.number);


        const angleIncrement = (2 * Math.PI) / lines;

        const alpha = 0.45;

        const startAngle = Math.random();


        for (let i = 0; i < lines; i++) {

            const angle = startAngle + i * angleIncrement;
            const endX = x + Math.max(this.state.width, this.state.height) * Math.cos(angle);
            const endY = y + Math.max(this.state.width, this.state.height) * Math.sin(angle);


            this.lines.push([x, y, endX, endY, alpha, item.color, 1])


        }
    }

    draw(ctx, elapsed) {

        if (this.lines.length === 0) return;

        ctx.save();

        ctx.shadowColor = "white"; // string

        // Horizontal distance of the shadow, in relation to the text.
        ctx.shadowOffsetX = 0; // integer

        // Vertical distance of the shadow, in relation to the text.
        ctx.shadowOffsetY = 0; // integer

        // Blurring effect to the shadow, the larger the value, the greater the blur.
        ctx.shadowBlur = 10; // integer


        for (const l of this.lines) {

            ctx.strokeStyle = `RGBA(${l[5]}, ${l[4]})`

            ctx.lineWidth = l[6];


            ctx.beginPath();

            ctx.moveTo(l[0], l[1]);



            ctx.lineTo(l[2], l[3]);

            ctx.stroke();

            l[4] -= 0.003
            l[6] += 0.1;
        }


        ctx.restore();

        this.lines = this.lines.filter(x => x[4] > 0)



    }
}