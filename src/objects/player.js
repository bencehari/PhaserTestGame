class Player {
    /** @type {Phaser.Scene} */ #scene
    /** @type {CursorKeys} */ #cursor
    /** @type {PhysicsImage} */ #image

    #lives
    #level
    #speed

    #pointerDown

    /**
     * @param {Phaser.Scene} scene
     * @param {integer} lives
     * @param {integer} level
     * @param {number} speed
     * @param {PhysicsGroup} group
     */
    constructor(scene, lives, level, speed, group) {
        this.#scene = scene
        this.#cursor = scene.input.keyboard.createCursorKeys()

        this.#image = scene.physics.add.image(scene.game.config.width * 0.5, scene.game.config.height * 0.5, 'mainatlas', 'char_squareYellow')
        this.#image.body.setSize(32, 32)
        this.#image.body.setOffset(16, 32)
        this.#image.setScale(g_scale)

        group.add(this.#image)

        this.#lives = lives
        this.#level = level
        this.#speed = speed

        scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this)
        scene.input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this)
        scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this)
    }

    /**
     * @returns {PhysicsImage}
     */
    get physicsImage() { return this.#image }

    /**
     * @returns {integer} level
     */
    get level() { return this.#level }

    /**
     * @returns {Phaser.Types.Math.Vector2Like}
     */
    get position() { return { x: this.#image.x, y: this.#image.y } }

    /**
     * @returns {integer} actual lives of player
     */
    hit() {
        this.#lives--

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

        return this.#lives
    }

    update() {
        if (this.#pointerDown) {
            let dir = new Phaser.Math.Vector2(
                this.#scene.input.activePointer.worldX,
                this.#scene.input.activePointer.worldY
            )
            dir.subtract({
                x: this.#image.x,
                y: this.#image.y
            })
            dir = dir.normalize()

            this.#image.body.velocity.x = dir.x * this.#speed
            this.#image.body.velocity.y = dir.y * this.#speed
        }
        else {
            let vel = { x: 0, y: 0 }

            if (this.#cursor.up.isDown) vel.y += -this.#speed
            if (this.#cursor.down.isDown) vel.y += this.#speed
            if (this.#cursor.left.isDown) {
                vel.x += -this.#speed
                this.#image.flipX = true
            }
            if (this.#cursor.right.isDown) {
                vel.x += this.#speed
                this.#image.flipX = false
            }

            this.#image.body.velocity.x = vel.x
            this.#image.body.velocity.y = vel.y
        }

        this.#image.depth = this.#image.y + this.#image.height * 0.5
    }

    onPointerDown(pointer) { this.#pointerDown = true }
    onPointerUp(pointer) { this.#pointerDown = false }

    // debug
    setLives(lives) {
        this.#lives = lives
    }
}
