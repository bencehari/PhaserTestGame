class PlayUI extends Phaser.Scene {
    /** @type {Img} */ #hearts = []
    /** @type {number} */ #lives

    create(lives) {
        this.#lives = lives

        for (let i = 1; i < lives + 1; i++) {
            const h = this.add.image(10 + i * 15, i * 5 + 25, 'mainatlas', 'tile_heart')
            h.setTint(0xFF2222)
            this.#hearts.push(h)
        }

        const play = this.scene.get('play')
        play.events.on('playerHit', this.onPlayerHit, this)
    }

    onPlayerHit() {
        // TODO: why there is no auto completion here?

        this.#hearts[--this.#lives].setVisible(false)
        if (this.#lives === 0) {
            // TODO: game over

            // Debug revive
            let i = this.#hearts.length
            this.#lives = i
            while (i--) {
                this.#hearts[i].setVisible(true)
            }
        }
    }
}
