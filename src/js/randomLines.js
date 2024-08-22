export class RandomLines {
    constructor(state) {
        this.state = state;

        this.lines = []

        this.state.eventEmitter.on('playerCollectedNumber', this.collected.bind(this));

    }

    collected(item) {

        console.log(item)

        const [x, y] = item.getCenter();


        for (let i = 0; i < item.number; i++) {
            let r = Math.random();


            if (r < 0.25) this.lines.push([x, y, Math.random() * this.state.width, 0, Math.random() / 2, item.color])
            else if (r >= 0.25 && r < 0.5) this.lines.push([x, y, 0, Math.random() * this.state.height, Math.random() / 2, item.color])
            else if (r >= 0.5 && r < 0.75) this.lines.push([x, y, Math.random() * this.state.width, this.state.height, Math.random() / 2, item.color])
            else this.lines.push([x, y, this.state.width, Math.random() * this.state.height, Math.random() / 2, item.color])


        }

        // this.lines.push([x, y, Math.random() * this.state.width, 0, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, 0, Math.random() * this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, Math.random() * this.state.width, this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, this.state.width, Math.random() * this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])

        // ;
    }

    draw(ctx, elapsed) {

        ctx.save();


        for (const l of this.lines) {

            ctx.strokeStyle = `RGBA(${l[5]}, ${l[4]})`

            ctx.beginPath();

            ctx.moveTo(l[0], l[1]);

            ctx.lineWidth = 1

            ctx.lineTo(l[2], l[3]);

            ctx.stroke();

            l[4] -= 0.003
        }

        this.lines = this.lines.filter(x => x[4] > 0)

        ctx.restore();


    }
}