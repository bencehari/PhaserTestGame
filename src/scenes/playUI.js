class PlayUI extends Phaser.Scene {
    /** @type {Img} */ #hearts = []

    create(lives) {
        for (let i = 1; i < lives + 1; i++) {
            const h = this.add.image(10 + i * 15, i * 5 + 25, 'mainatlas', 'tile_heart')
            h.setTint(0xFF2222)
            this.#hearts.push(h)
        }

        const play = this.scene.get('play')
        play.events.on('playerHit', this.onPlayerHit, this)
    }

    onPlayerHit(lives) {
        if (lives == -1) {
            // Debug revive
            let i = this.#hearts.length
            while (i--) {
                this.#hearts[i].setVisible(true)
            }
        }
        else this.#hearts[lives].setVisible(false)
    }
}
