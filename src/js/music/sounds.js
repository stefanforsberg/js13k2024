import CPlayer from "./player"
import { mainTheme, sfxHit, gameOver, shopSong } from "./song";

export default class Sounds {
    constructor() {

        this.player = new CPlayer();

        this.soundsLoading = [mainTheme, sfxHit, gameOver, shopSong]
        this.sounds = [];
        this.currentlyLoadingIndex = 0;

        this.startedLoading = false;
    }

    load(cb) {

        if (!this.startedLoading) {
            this.player.init(this.soundsLoading[this.currentlyLoadingIndex]);
            this.startedLoading = true;
        }

        if (this.player.generate() < 1) {
            setTimeout(() => this.load(cb), 200);
            return;
        } else {
            const wave = this.player.createWave();
            const audio = document.createElement("audio");
            audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
            this.sounds.push(audio);

            this.currentlyLoadingIndex++;

            if (this.currentlyLoadingIndex < this.soundsLoading.length) {
                this.player.init(this.soundsLoading[this.currentlyLoadingIndex]);
                this.load(cb);
            } else {
                this.sounds[0].loop = true;
                this.sounds[0].volume = 0;

                cb();
            }
        }
    }

    playSong(i) {
        this.sounds[i].loop = true;
        this.sounds[i].volume = 1.0;
        this.sounds[i].play();
    }

    pauseSong(i) {
        this.sounds[i].pause();
    }

    stopSong(i) {
        this.pauseSong(i)
        this.sounds[i].currentTime = 0;
    }

    sfx(i) {
        this.sounds[i].play();
    }
}