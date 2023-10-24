class Player {
    /** @type {Img} */ #image
    /** @type {CursorKeys} */ #cursor

    #speed

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {number} speed
     */
    constructor(scene, speed) {
        this.#cursor = scene.input.keyboard.createCursorKeys()
        this.#image = scene.add.image(scene.game.config.width * 0.5, scene.game.config.height * 0.5, 'mainatlas', 'char_squareYellow')
        this.#speed = speed
    }

    update() {
        if (this.#cursor.up.isDown) this.#image.y -= this.#speed
        if (this.#cursor.down.isDown) this.#image.y += this.#speed
        if (this.#cursor.left.isDown) this.#image.x -= this.#speed
        if (this.#cursor.right.isDown) this.#image.x += this.#speed
    }
}
