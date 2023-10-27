class Enemy {
    /** @type {PhysicsImage} */ #image

    #speed

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x x position
     * @param {number} y y position
     * @param {number} speed
     * @param {PhysicsGroup} group
     */
    constructor(scene, x, y, speed, group) {
        this.#image = scene.physics.add.image(x, y, 'mainatlas', 'char_roundRed')
        this.#image.body.setSize(32, 32)
        this.#image.body.setOffset(16, 32)

        group.add(this.#image)

        this.#speed = speed
    }

    /**
     * @param { Phaser.Types.Math.Vector2Like } playerPos
     */
    update(playerPos) {
        const vec = new Phaser.Math.Vector2(playerPos.x - this.#image.x, playerPos.y - this.#image.y)
        vec.normalize()

        this.#image.body.velocity.x = vec.x * this.#speed
        this.#image.body.velocity.y = vec.y * this.#speed
    }
}
