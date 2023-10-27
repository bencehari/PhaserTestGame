class Player {
    /** @type {Phaser.Scene} */ #scene
    /** @type {CursorKeys} */ #cursor
    /** @type {PhysicsImage} */ #image

    #level
    #speed

    /**
     * @param {Phaser.Scene} scene
     * @param {number} speed
     * @param {PhysicsGroup} group
     */
    constructor(scene, level, speed, group) {
        this.#scene = scene
        this.#cursor = scene.input.keyboard.createCursorKeys()

        this.#image = scene.physics.add.image(scene.game.config.width * 0.5, scene.game.config.height * 0.5, 'mainatlas', 'char_squareYellow')
        this.#image.body.setSize(32, 32)
        this.#image.body.setOffset(16, 32)
        this.#image.setScale(g_scale)

        group.add(this.#image)

        this.#level = level
        this.#speed = speed
    }

    /**
     * @returns {PhysicsImage}
     */
    getPhysicsImage() {
        return this.#image
    }

    /**
     * @returns {Phaser.Types.Math.Vector2Like}
     */
    getPosition() {
        return { x: this.#image.x, y: this.#image.y }
    }

    hit() {
        const image = this.#image
        image.setTint(Phaser.Display.Color.GetColor(255, 0, 0))
        this.#scene.tweens.addCounter({
            from: 0,
            to: 255,
            duration: 300,
            onUpdate: function(tween) {
                const value = Math.floor(tween.getValue())
                image.setTint(Phaser.Display.Color.GetColor(255, value, value))
            },
        })
        this.#scene.cameras.main.shake(200, 0.005)
    }

    update() {
        this.#image.body.velocity.x = 0
        this.#image.body.velocity.y = 0

        if (this.#cursor.up.isDown) this.#image.body.velocity.y += -this.#speed
        if (this.#cursor.down.isDown) this.#image.body.velocity.y += this.#speed
        if (this.#cursor.left.isDown) this.#image.body.velocity.x += -this.#speed
        if (this.#cursor.right.isDown) this.#image.body.velocity.x += this.#speed
    }
}
