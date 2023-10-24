class Play extends Phaser.Scene {
    /** @type {Player} */ #player
    /** @type {Enemy} */ #enemies = []

    create() {
        this.#player = new Player(this, 5)
        this.#enemies.push(
            new Enemy(this, this.game.config.width * 0.5, this.game.config.height * 0.25, 3),
            new Enemy(this, this.game.config.width * 0.75, this.game.config.height * 0.5, 3),
            new Enemy(this, this.game.config.width * 0.5, this.game.config.height * 0.75, 3),
            new Enemy(this, this.game.config.width * 0.25, this.game.config.height * 0.5, 3),
        )
    }

    update() {
        this.#player.update()
    }
}
