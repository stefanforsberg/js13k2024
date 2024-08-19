export class RandomLines {
    constructor(state) {
        this.state = state;

        this.lines = []

        this.state.eventEmitter.on('playerCollectedNumber', this.collected.bind(this));

        this.colors = [
            "0, 63, 92",
            "44, 72, 117",
            "138, 80, 143",
            "188, 80, 144",
            "255, 99, 97",
        ]
    }

    collected(sum, x, y) {

        let dx = -1 + 2 * Math.random();
        let dy = -1 + 2 * Math.random();

        for (let i = 0; i < sum; i++) {
            let r = Math.random();


            if (r < 0.25) this.lines.push([x, y, Math.random() * this.state.width, 0, Math.random(), this.colors[(Math.random() * this.colors.length) >> 0], dx, dy])
            else if (r >= 0.25 && r < 0.5) this.lines.push([x, y, 0, Math.random() * this.state.height, Math.random(), this.colors[(Math.random() * this.colors.length) >> 0], dx, dy])
            else if (r >= 0.5 && r < 0.75) this.lines.push([x, y, Math.random() * this.state.width, this.state.height, Math.random(), this.colors[(Math.random() * this.colors.length) >> 0], dx, dy])
            else this.lines.push([x, y, this.state.width, Math.random() * this.state.height, Math.random(), this.colors[(Math.random() * this.colors.length) >> 0], dx, dy])


        }

        console.log("collected", sum)

        // this.lines.push([x, y, Math.random() * this.state.width, 0, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, 0, Math.random() * this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, Math.random() * this.state.width, this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])
        // this.lines.push([x, y, this.state.width, Math.random() * this.state.height, 1, this.colors[(Math.random() * this.colors.length) >> 0]])

        // ;

        console.log("drawing")
    }

    draw(ctx, elapsed) {

        ctx.save();


        for (const l of this.lines) {

            ctx.strokeStyle = `RGBA(${l[5]}, ${l[4]})`

            ctx.beginPath();

            ctx.moveTo(l[0], l[1]);

            ctx.lineWidth = 3

            ctx.lineTo(l[2], l[3]);

            ctx.stroke();

            l[0] += l[6]
            l[1] += l[7]

            l[4] -= 0.003
        }

        this.lines = this.lines.filter(x => x[4] > 0)

        ctx.restore();


    }
}