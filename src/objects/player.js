class Player {
    /** @type {PhysicsImage} */ #image
    /** @type {CursorKeys} */ #cursor

    #speed

    /**
     * @param {Phaser.Scene} scene
     * @param {number} speed
     * @param {PhysicsGroup} group
     */
    constructor(scene, speed, group) {
        this.#cursor = scene.input.keyboard.createCursorKeys()
        
        this.#image = scene.physics.add.image(scene.game.config.width * 0.5, scene.game.config.height * 0.5, 'mainatlas', 'char_squareYellow')
        this.#image.body.setSize(32, 32)
        this.#image.body.setOffset(16, 32)

        group.add(this.#image)

        this.#speed = speed
    }

    /**
     * returns the position of the object
     * @returns { Phaser.Types.Math.Vector2Like }
     */
    getPosition() {
        return { x: this.#image.x, y: this.#image.y }
    }

    update() {
        this.#image.body.velocity.x = 0 // Phaser.Math.Vector2.ZERO
        this.#image.body.velocity.y = 0

        if (this.#cursor.up.isDown) this.#image.body.velocity.y += -this.#speed
        if (this.#cursor.down.isDown) this.#image.body.velocity.y += this.#speed
        if (this.#cursor.left.isDown) this.#image.body.velocity.x += -this.#speed
        if (this.#cursor.right.isDown) this.#image.body.velocity.x += this.#speed
    }
}
