import { Game } from "./game";
import { EventEmitter } from "./eventEmitter";



const load = () => {



    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const state = {
        canvas,
        ctx,
        body: document.querySelector('body'),
        gameOver: document.getElementById('game-over'),
        collectors: [
            document.getElementById('collected-1'),
            document.getElementById('collected-2'),
            document.getElementById('collected-3'),
            document.getElementById('collected-4'),
            document.getElementById('collected-5'),
            document.getElementById('collected-6'),
            document.getElementById('collected-7')
        ],
        eventEmitter: new EventEmitter()
    }


    const resizeCanvas = () => {
        console.log("resize")
        state.ctx.canvas.width = window.innerWidth;
        state.ctx.canvas.height = window.innerHeight;
        state.width = ctx.canvas.width;
        state.height = ctx.canvas.height;
        state.scaleFactor = Math.min(ctx.canvas.width / 800, ctx.canvas.height / 600);
        state.ctx.font = (40 * state.scaleFactor >> 0) + "px monospace";
        state.ctx.textAlign = 'center'; // Center the text horizontally
        state.ctx.textBaseline = 'middle'; // Center the text vertically
    }

    window.addEventListener('resize', () => resizeCanvas());
    resizeCanvas()





    // const canvas = document.getElementById('myCanvas');
    // const container = document.getElementById('canvas-container');
    // const ctx = canvas.getContext('2d', { willReadFrequently: true });



    // const circle = {
    //     x: canvas.width / 2,
    //     y: canvas.height / 2,
    //     minRadius: 50,
    //     maxRadius: 200,
    //     currentRadius: 50,
    //     grow: true,
    //     duration: 5000 // 5 seconds
    // };

    // let mouseX = 0;
    // let mouseY = 0;

    // let lastTimestamp = 0;

    // function animate(timestamp) {
    //     const elapsedTime = timestamp - lastTimestamp;
    //     lastTimestamp = timestamp;

    //     // Calculate the change in radius per millisecond
    //     const radiusChange = (circle.maxRadius - circle.minRadius) / circle.duration;

    //     // Update the radius
    //     if (circle.grow) {
    //         circle.currentRadius += radiusChange * elapsedTime;
    //         if (circle.currentRadius >= circle.maxRadius) {
    //             circle.currentRadius = circle.maxRadius;
    //             circle.grow = false;
    //         }
    //     } else {
    //         circle.currentRadius -= radiusChange * elapsedTime;
    //         if (circle.currentRadius <= circle.minRadius) {
    //             circle.currentRadius = circle.minRadius;
    //             circle.grow = true;
    //         }
    //     }

    //     // Clear the canvas
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);

    //     // Draw the circle
    //     ctx.beginPath();
    //     ctx.arc(circle.x, circle.y, circle.currentRadius, 0, Math.PI * 2, false);
    //     ctx.fillStyle = 'blue';
    //     ctx.fill();
    //     ctx.closePath();

    //     const [r, g, b] = getPixelColor(mouseX, mouseY);

    //     if (r === 0 && g === 0 && b === 0) console.log("outside")
    //     else console.log("inside")

    //     // Request the next animation frame
    //     requestAnimationFrame(animate);
    // }

    // // Start the animation
    // requestAnimationFrame(animate);

    // // Function to get the color of the pixel under the mouse pointer
    // function getPixelColor(x, y) {
    //     return ctx.getImageData(x, y, 1, 1).data;
    // }

    // // Handle mouse movement
    // canvas.addEventListener('mousemove', function (event) {
    //     const rect = canvas.getBoundingClientRect();
    //     mouseX = event.clientX - rect.left;
    //     mouseY = event.clientY - rect.top;
    // });



    const game = new Game(state);
    game.setLevel();

    requestAnimationFrame((ticks) => game.draw(ticks));


}

load()