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

    getOperator(odds = [0.75, 1, 1.5]) {
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
        this.operator3 = this.getOperator();

        this.state.collectors[0].innerText = ""
        this.state.collectors[0].style.border = `solid 1px var(--score-border-color)`
        this.state.collectors[1].innerText = this.operator1
        this.state.collectors[2].innerText = ""
        this.state.collectors[2].style.border = `solid 1px var(--score-border-color)`
        this.state.collectors[3].innerText = this.operator2
        this.state.collectors[4].innerText = ""
        this.state.collectors[4].style.border = `solid 1px var(--score-border-color)`
        this.state.collectors[5].innerText = this.operator3
        this.state.collectors[6].innerText = ""
        this.state.collectors[6].style.border = `solid 1px var(--score-border-color)`

    }

    getHand(cards) {
        cards.sort((a, b) => a - b);

        const isStraight = (cards) => {
            return cards[3] - cards[0] === 3 && new Set(cards).size === 4;
        };

        if (isStraight(cards)) {
            return 75;
        }

        const freq = {};
        for (const card of cards) {
            freq[card] = (freq[card] || 0) + 1;
        }

        const frequencies = Object.values(freq).sort((a, b) => b - a);

        if (frequencies[0] === 4) {
            return 100;
        } else if (frequencies[0] === 3) {
            return 30;
        } else if (frequencies[0] === 2 && frequencies[1] === 2) {
            return 10;
        } else if (frequencies[0] === 2) {
            return 5;
        } else {
            return 1;
        }
    }

    addItem(item) {
        this.collected.push(item)
        this.state.collectors[this.index].innerText = item.number
        this.state.collectors[this.index].style.color = `rgb(${item.color})`
        this.state.collectors[this.index].style.border = `solid 1px rgb(${item.color})`
        this.index += 2;

        let sum = this.collected[0].number;

        for (let c = 1; c < this.collected.length; c++) {
            switch (this[`operator${c}`]) {
                case "+":
                    sum += this.collected[c].number;
                    break;
                case "-":
                    sum -= this.collected[c].number;
                    break;
                case "*":
                    sum *= this.collected[c].number;
                    break;
                case "/":
                    sum = Math.floor(sum / this.collected[c].number);
                    break;
            }
        }

        if (item.number === 13 || sum === 13) {
            console.log("death!")

            this.state.eventEmitter.emit("death")
            return;
        }

        if (this.collected.length === 4) {

            const colors = new Set(this.collected.map(x => x.color));

            sum = sum * this.getHand(this.collected.map(x => x.number))

            if (colors.size === 1) {
                sum = sum * 10;
            }

            this.level1()
            this.state.eventEmitter.emit("finishedLevel", sum)
            this.state.eventEmitter.emit("playerNewSum", 0)

        } else {
            this.state.eventEmitter.emit("playerNewSum", sum)
        }


    }
}

class Score {
    constructor(state, score, x, y) {
        this.state = state;
        this.pulseSize = 100 * (this.state.scaleFactor / 2) >> 0;
        this.pulseDelta = [(this.pulseSize + this.pulseSize * 0.1) >> 0, (this.pulseSize - this.pulseSize * 0.1) >> 0];
        this.glowAlpha = 1;
        this.glowDirection = -0.05;
        this.score = score;
        this.x = x;
        this.y = y;
        this.dx = -1 + 2 * Math.random();
        this.dy = -1 - Math.random();
        this.alive = true;
        this.pulseDirection = 0.5;
        this.elapsed = 0;
    }

    update() {

        this.x += this.dx;
        this.y += this.dy;

        this.pulseSize += this.pulseDirection;
        if (this.pulseSize > this.pulseDelta[0] || this.pulseSize < this.pulseDelta[1]) {
            this.pulseDirection *= -1;
        }

        if (this.fade) {
            console.log(this.glowAlpha)
            this.glowAlpha -= 0.05;
            console.log(this.glowAlpha)


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

        this.elapsed += elapsed

        if (this.elapsed > 750 && !this.fade) {
            this.fade = true;
        }

        ctx.font = `${this.pulseSize >> 0}px Arial`;
        ctx.fillStyle = `rgba(255, 211, 128, ${this.glowAlpha})`;
        ctx.fillText(this.score, this.x, this.y);
    }
}

export class Game {

    started = true;
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

        this.state.eventEmitter.on('death', this.death.bind(this));
        this.state.eventEmitter.on('finishedLevel', this.finishedLevel.bind(this));
    }

    death() {
        this.state.gameOver.style.display = 'flex';
        document.querySelector("body").style.cursor = "auto"

        console.log("gane death")
        this.started = false;
    }

    finishedLevel(score) {
        console.log(this.score, score)
        this.score += score;
        this.state.score.innerText = `${this.score} (${score})`

        this.items.push(new Score(this.state, score, this.player.x, this.player.y))
    }

    setLevel() {

        this.state.gameOver.style.display = 'none';
        document.querySelector("body").style.cursor = "none"

        this.collector = new Collector(this.state);
        this.collector.level1();

        this.player = new Player(this.state);


        setInterval(() => {
            this.items.push(new Number(this.state))
        }, 1500)

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

        if (!this.started) return;

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

                    this.state.eventEmitter.emit("playerCollectedNumber", item)
                    // const sum = this.collector.addItem(item.number)
                    // this.player.collected(sum)
                }
            }

            this.player.update(this.state.ctx);

            this.items = this.items.filter(x => x.alive)

            this.accumulatedTime -= this.fixedTimeStep;
        }

        this.state.ctx.clearRect(0, 0, this.state.width, this.state.height)

        this.randomLines.draw(this.state.ctx, elapsed)

        for (const item of this.items) {
            item.draw(this.state.ctx, elapsed)
        }

        this.player.draw(this.state.ctx);

        requestAnimationFrame((ticks) => this.draw(ticks));;
    }


}
