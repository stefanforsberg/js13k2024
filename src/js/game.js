import { Player } from "./player";
import { Number } from "./numbers";
import { RandomLines } from "./randomLines";

class Collector {
    constructor(state) {
        this.state = state;
        this.index = 0;
        this.collected = []

        this.state.eventEmitter.on('playerCollectedNumber', this.addItem.bind(this));


    }

    getOperator(odds = [0.5, 1, 1.5]) {
        const r = Math.random();
        console.log(r)
        if (r < odds[0]) return "+";
        else if (r >= odds[0] && r < odds[1]) return "-";
        else if (r >= odds[1] && r < odds[2]) return "*";
        else if (r >= odds[2]) return "/";
    }

    level1() {
        this.index = 0;
        this.collected = []

        this.operator1 = this.getOperator();
        this.operator2 = this.getOperator();
        this.sum = 13;

        this.state.collectors[0].innerText = ""
        this.state.collectors[1].innerText = this.operator1
        this.state.collectors[2].innerText = ""
        this.state.collectors[3].innerText = this.operator2
        this.state.collectors[4].innerText = ""
        this.state.collectors[5].innerText = "<"
        this.state.collectors[6].innerText = this.sum
    }

    addItem(number) {
        console.log(this)
        console.log(number, this.index, this.state.collectors[this.index])
        this.collected.push(parseInt(number))
        this.state.collectors[this.index].innerText = number
        this.index += 2;

        let sum = this.collected[0];

        for (let c = 1; c < this.collected.length; c++) {
            switch (this[`operator${c}`]) {
                case "+":
                    sum += this.collected[c];
                    break;
                case "-":
                    sum -= this.collected[c];
                    break;
                case "*":
                    sum *= this.collected[c];
                    break;
                case "/":
                    sum = Math.floor(sum / this.collected[c]);
                    break;
            }
        }

        if (this.collected.length === 3) {
            this.level1()
            this.state.eventEmitter.emit("playerNewSum", 0)
        } else {
            this.state.eventEmitter.emit("playerNewSum", sum)
        }


    }
}

export class Game {

    started = false;
    prevTime = 0;
    items = [];

    lastTime = 0;
    fixedTimeStep = 1000 / 60;
    accumulatedTime = 0;
    deltaTime = this.fixedTimeStep / 1000

    constructor(state) {
        this.state = state;
        this.mouseX = 0;
        this.mouseY = 0;
        this.score = 0;

        this.randomLines = new RandomLines(this.state)
    }

    setLevel() {

        document.querySelector("body").style.cursor = "none"

        this.collector = new Collector(this.state);
        this.collector.level1();

        this.player = new Player(this.state);


        setInterval(() => {
            this.items.push(new Number(this.state))
        }, 1500)

        // this.state.ctx.scale(0.5, 0.5);
    }

    areRectanglesColliding(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    draw(timestamp) {

        let elapsed = timestamp - this.prevTime;
        this.prevTime = timestamp;

        let elapsedTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.accumulatedTime += elapsedTime;

        while (this.accumulatedTime >= this.fixedTimeStep) {

            for (const item of this.items) {
                item.update(this.deltaTime)

                if (item.alive && this.areRectanglesColliding(item, this.player.getCollisionRect())) {
                    item.alive = false;
                    this.score += item.number

                    this.state.eventEmitter.emit("playerCollectedNumber", item.number, item.x + item.width / 2, item.y + item.height / 2)
                    // const sum = this.collector.addItem(item.number)
                    // this.player.collected(sum)
                }
            }

            this.player.update(this.state.ctx);

            this.items = this.items.filter(x => x.alive)

            this.accumulatedTime -= this.fixedTimeStep;
        }

        this.state.ctx.clearRect(0, 0, this.state.width, this.state.height)

        this.randomLines.draw(this.state.ctx)

        for (const item of this.items) {
            item.draw(this.state.ctx, elapsed,)
        }

        this.player.draw(this.state.ctx);

        requestAnimationFrame((ticks) => this.draw(ticks));;
    }


}
