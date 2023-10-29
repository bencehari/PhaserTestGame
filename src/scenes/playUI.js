class PlayUI extends Phaser.Scene {
    /** @type {Phaser.Scene} */ #playScene

    /** @type {Img} */ #hearts = []

    /** @type {PText} */ #pauseText

    #paused

    create(lives) {
        for (let i = 1; i < lives + 1; i++) {
            const h = this.add.image(10 + i * 15, i * 5 + 25, 'mainatlas', 'tile_heart')
            h.setTint(0xFF2222)
            this.#hearts.push(h)
        }

        // TODO: should avoid using built-in scene events
        this.#playScene = this.scene.get('play')
        this.#playScene.events.on('playerHit', this.onPlayerHit, this)

        const textStyle = getDefaultTextStyle(30)
        textStyle.backgroundColor = '#000000'

        this.#pauseText = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.5, ' game paused ', textStyle)
        this.#pauseText.setOrigin(0.5, 0.5)
        this.#pauseText.setVisible(false)

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on(Phaser.Input.Keyboard.Events.DOWN, this.onESCDown, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this)
    }

    onPlayerHit(lives) {
        // console.log(`[playUI.onPlayerHit] lives: ${lives}`)

        if (lives == -1) {
            // Debug revive
            let i = this.#hearts.length
            while (i--) {
                this.#hearts[i].setVisible(true)
            }
        }
        else this.#hearts[lives].setVisible(false)
    }

    onESCDown() {
        if (!this.#paused) {
            this.scene.pause('play')
            this.#pauseText.setVisible(true)
        }
        else {
            this.scene.resume('play')
            this.#pauseText.setVisible(false)
        }

        this.#paused = !this.#paused
    }

    onShutdown() {
        this.#playScene.events.off('playerHit', this.onPlayerHit, this)
        this.events.off(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this)
    }
}
