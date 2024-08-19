export class Player {
    constructor(state) {
        this.state = state;
        this.x = 0;
        this.y = 0;
        this.rot = 0;
        this.width = 40 * this.state.scaleFactor >> 0;
        this.height = 40 * this.state.scaleFactor >> 0;
        this.previousPositions = [];
        this.rot = 0;
        this.color;
        this.currentCollected = 0;

        this.state.body.addEventListener('mousemove', (event) => {
            this.x = event.clientX;
            this.y = event.clientY;
        });

        this.state.canvas.addEventListener('click', (event) => {
            console.log("click")
        });

        this.state.eventEmitter.on('playerNewSum', this.collected.bind(this));
    }

    getCollisionRect() {
        return { x: this.x - this.width / 2, y: this.y - this.height / 2, width: this.width, height: this.height }
    }

    update() {

    }

    collected(sum) {
        console.log("collected", sum)
        this.currentCollected = sum
    }

    draw(ctx, elapsed) {

        if (this.previousPositions.length > 20) {
            this.previousPositions.shift();
        }


        ctx.save();
        ctx.beginPath();

        ctx.translate(this.x, this.y)
        // ctx.rotate(this.rot * Math.PI / 180);
        // this.rot = this.rot + 1 % 360;



        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.shadowColor = '#ff8531';        // Color of the glow
        ctx.shadowBlur = 5;            // Blur level of the shadow to create the glow
        ctx.shadowOffsetX = 0;          // Horizontal offset of the shadow
        ctx.shadowOffsetY = 0;

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff8531"
        ctx.fillStyle = "#ff8531"

        ctx.stroke()

        ctx.closePath();

        ctx.font = (20 * this.state.scaleFactor >> 0) + "px monospace";
        ctx.fillText(this.currentCollected, 0, 1);

        ctx.restore();



        const alphaDiff = 1 / this.previousPositions.length;
        let alpha = 1;

        for (let i = this.previousPositions.length - 1; i >= 0; i--) {
            const pp = this.previousPositions[i]
            alpha -= alphaDiff

            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 133, 49, ${Math.max(0.1, alpha)})`
            ctx.rect(pp[0] - this.width / 2, pp[1] - this.height / 2, this.width, this.height);
            ctx.stroke()

        }




        this.previousPositions.push([this.x, this.y])

    }
}