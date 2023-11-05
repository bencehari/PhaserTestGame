"use strict"

import { defaultTextStyle } from "../common.js"

class Init extends Phaser.Scene {
    /** @type {PText} */ #progress

    preload() {
        this.#progress = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.5, 'loading\n0%', defaultTextStyle(30))
        this.#progress.setOrigin(0.5, 0.5)
        this.#progress.setAlign('center')

        this.load.on(Phaser.Loader.Events.PROGRESS, this.progress, this)

        this.load.atlas('mainatlas', '../assets/scribble_platformer_spritesheet.png', '../assets/scribble_platformer_spritesheet_atlas.json')
        this.load.atlas('secatlas', '../assets/scribble_dungeons_spritesheet.png', '../assets/scribble_dungeons_spritesheet_atlas.json')
        this.load.image('grass', '../assets/grass.png')
    }

    progress(value) {
        this.#progress.setText(`loading\n${value * 100}%`)
    }

    create() {
        this.scene.start('mainmenu')
    }
}

export default Init
