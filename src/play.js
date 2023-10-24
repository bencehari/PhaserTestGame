class Play extends Phaser.Scene {

    #player

    create() {
        this.#player = new Player(this, 5)
    }

    update() {
        this.#player.update()
    }
}
