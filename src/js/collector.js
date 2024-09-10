export class Collector {
    constructor(state) {
        this.state = state;
        this.index = 0;
        this.collected = [];

        this.types = {
            "+++": {
                display: () => {
                    this.state.collectors[1].innerText = "+";
                    this.state.collectors[1].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[3].innerText = "+";
                    this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[5].innerText = "+";
                    this.state.collectors[5].style.backgroundColor = "var(--main-yellow)";
                },
                sum: () => {
                    return this.collected.slice(0, 4).reduce((p, c) => p + c.number, 0);
                },
                addItem: (item) => {
                    this.collected.push(item);
                    this.flashNumber(item, this.index);
                    this.index += 2;
                },
            },
            "++-": {
                display: () => {
                    this.state.collectors[1].innerText = "+";
                    this.state.collectors[1].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[3].innerText = "+";
                    this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[5].innerText = "-";
                    this.state.collectors[5].style.backgroundColor = "var(--main-yellow)";
                },
                sum: () => {
                    return this.collected
                        .slice(0, 4)
                        .reduce((p, c, i) => p + c.number * (i === 3 ? -1 : 1), 0);
                },
                addItem: (item) => {
                    this.collected.push(item);
                    this.flashNumber(item, this.index);

                    this.index += 2;
                },
            },
            ">": {
                display: () => {
                    this.state.collectors[0].innerText = "";
                    this.state.collectors[0].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[0].style.borderColor = "var(--main-light)";
                    this.state.collectors[1].innerText = "";
                    this.state.collectors[1].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[3].innerText = ">";
                    this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[5].innerText = "";
                    this.state.collectors[5].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[6].innerText = "";
                    this.state.collectors[6].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[6].style.borderColor = "var(--main-light)";
                },
                sum: () => {
                    if (this.collected.length < 2) return 0;

                    const a = parseInt(
                        `${this.collected[0].number}${this.collected[1].number}`
                    );

                    if (this.collected.length < 4) return a;

                    const b = parseInt(
                        `${this.collected[2].number}${this.collected[3].number}`
                    );

                    if (b === 13) return b;

                    return a > b ? a - b : 0;
                },
                addItem: (item) => {
                    if (this.index === 0 || this.index === 3) this.index++;

                    this.collected.push(item);
                    this.flashNumber(item, this.index);

                    this.index += 1;
                },
            },
            "<": {
                display: () => {
                    this.state.collectors[0].innerText = "";
                    this.state.collectors[0].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[0].style.borderColor = "var(--main-light)";
                    this.state.collectors[1].innerText = "";
                    this.state.collectors[1].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[3].innerText = "<";
                    this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[5].innerText = "";
                    this.state.collectors[5].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[6].innerText = "";
                    this.state.collectors[6].style.backgroundColor = "var(--main-light)";
                    this.state.collectors[6].style.borderColor = "var(--main-light)";
                },
                sum: () => {
                    if (this.collected.length < 2) return 0;

                    const a = parseInt(
                        `${this.collected[0].number}${this.collected[1].number}`
                    );

                    if (this.collected.length < 4) return a;

                    const b = parseInt(
                        `${this.collected[2].number}${this.collected[3].number}`
                    );

                    if (b === 13) return b;

                    return a < b ? b - a : 0;
                },
                addItem: (item) => {
                    if (this.index === 0 || this.index === 3) this.index++;

                    this.collected.push(item);
                    this.flashNumber(item, this.index);

                    this.index += 1;
                },
            },
            ">>>": {
                display: () => {
                    this.state.collectors[1].innerText = ">";
                    this.state.collectors[1].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[3].innerText = ">";
                    this.state.collectors[3].style.backgroundColor = "var(--main-yellow)";
                    this.state.collectors[5].innerText = ">";
                    this.state.collectors[5].style.backgroundColor = "var(--main-yellow)";
                },
                sum: () => {
                    if (this.collected.length < 4) return 0;

                    if (this.collected[0].number > this.collected[1].number &&
                        this.collected[1].number > this.collected[2].number &&
                        this.collected[2].number > this.collected[3].number) {
                        return this.collected[0].number * this.collected[1].number;
                    }

                    return 0;
                },
                addItem: (item) => {
                    this.collected.push(item);
                    this.flashNumber(item, this.index);

                    this.index += 2;
                },
            },
        };

        this.typeKeys = Object.keys(this.types);

        this.state.eventEmitter.on(
            "playerCollectedNumber",
            this.addItem.bind(this)
        );
    }

    flashNumber(item, index) {
        this.state.collectors[index].innerText = item.number;
        this.state.collectors[index].style.color = "var(--main-black)";

        this.state.collectors[index].style.transition =
            "background-color 0.3s ease";
        this.state.collectors[index].style.backgroundColor = `rgb(${item.color})`;
    }

    level1() {
        this.index = 0;
        this.collected = [];

        this.currentType =
            this.typeKeys[Math.floor(Math.random() * this.typeKeys.length)];

        for (const collector of this.state.collectors) {
            collector.innerText = "";
            collector.style.border = `solid 1px var(--score-border-color)`;
            collector.style.backgroundColor = "var(--main-light)";
        }

        this.types[this.currentType].display();
    }

    getHand(cards) {
        cards.sort((a, b) => a - b);

        const isStraight = (cards) => {
            return cards[3] - cards[0] === 3 && new Set(cards).size === 4;
        };

        if (isStraight(cards)) {
            return this.state.handScores.STRAIGHT;
        }

        const freq = {};
        for (const card of cards) {
            freq[card] = (freq[card] || 0) + 1;
        }

        const frequencies = Object.values(freq).sort((a, b) => b - a);

        if (frequencies[0] === 4) {
            return this.state.handScores.FOAK;
        } else if (frequencies[0] === 3) {
            return this.state.handScores.TOAK;
        } else if (frequencies[0] === 2 && frequencies[1] === 2) {
            return this.state.handScores.TWOPAIR;
        } else if (frequencies[0] === 2) {
            return this.state.handScores.PAIR;
        } else {
            return ["", 1];
        }
    }

    addItem(item, elapsed) {
        this.types[this.currentType].addItem(item);

        let sum = this.types[this.currentType].sum();

        if (item.number === 13 || sum === 13) {
            this.state.eventEmitter.emit("thirteen");

            this.level1();
        }

        if (this.collected.length === 4) {
            const colors = new Set(this.collected.map((x) => x.color));

            const hand = this.getHand(this.collected.map((x) => x.number));

            let log = this.currentType

            if (hand[1] > 1) {
                this.state.eventEmitter.emit("handBonus", hand[0]);
                log += ` ${hand[0]}`
            }

            sum = sum * hand[1];

            if (colors.size === 1) {
                sum = sum * this.state.handScores.COLOR;
                this.state.eventEmitter.emit("colorBonus");
                log += ` 🎨`
            }

            let timeBonus = 1;

            if (elapsed < 7000) {
                timeBonus = 2;
            } else if (elapsed < 15000) {
                timeBonus = 1.5;
            }

            if (timeBonus > 1) {
                sum = sum * timeBonus;
                this.state.eventEmitter.emit("timeBonus");
                log += ` ⏱️`
            }

            sum = sum >> 0;

            this.level1();
            this.state.eventEmitter.emit("finishedLevel", sum, sum > 0 ? `${log} (${sum})` : `${this.currentType} failed`);
            this.state.eventEmitter.emit("playerNewSum", 0);
        } else {
            this.state.eventEmitter.emit("playerNewSum", sum);
        }
    }
}
