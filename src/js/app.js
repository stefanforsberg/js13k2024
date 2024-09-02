import { Game } from "./game";
import { EventEmitter } from "./eventEmitter";
import Sounds from "./music/sounds";



const load = () => {



    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const startfieldCanvas = document.getElementById('starField');
    const startfieldCtx = startfieldCanvas.getContext('2d');

    const state = {
        canvas,
        ctx,
        body: document.querySelector('body'),
        gameOver: document.getElementById('game-over'),
        score: document.getElementById('score'),
        collectors: [
            document.getElementById('collected-1'),
            document.getElementById('collected-2'),
            document.getElementById('collected-3'),
            document.getElementById('collected-4'),
            document.getElementById('collected-5'),
            document.getElementById('collected-6'),
            document.getElementById('collected-7')
        ],
        eventEmitter: new EventEmitter(),
        startfieldCanvas,
        startfieldCtx,
        sounds: new Sounds(this)
    }

    state.sounds.load(() => {
        console.log("loaded!");
        state.sounds.playSong(0)
    })


    const resizeCanvas = () => {
        console.log("resize")
        state.ctx.canvas.width = window.innerWidth;
        state.ctx.canvas.height = window.innerHeight;
        state.width = ctx.canvas.width;
        state.height = ctx.canvas.height;
        state.scaleFactor = Math.min(ctx.canvas.width / 800, ctx.canvas.height / 600);
        state.ctx.font = (35 * state.scaleFactor >> 0) + "px monospace";
        state.ctx.textAlign = 'center';
        state.ctx.textBaseline = 'middle';

        state.startfieldCtx.canvas.width = window.innerWidth;
        state.startfieldCtx.canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => resizeCanvas());
    resizeCanvas()


    const game = new Game(state);
    game.setLevel();

    requestAnimationFrame((ticks) => game.draw(ticks));


}

load()