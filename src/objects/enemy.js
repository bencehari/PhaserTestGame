import { g_scale } from "../globals.js"

class Enemy {
    /** @type {PhysicsImage} */ #image

    #level
    #speed
    #depthMod

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x x position
     * @param {number} y y position
     * @param {integer} level
     * @param {number} speed
     * @param {PhysicsGroup} group
     */
    constructor(scene, x, y, level, speed, group) {
        this.#image = scene.physics.add.image(x, y, 'mainatlas', 'char_roundRed')
        this.#image.setData('owner', this)

        this.#image.body.setSize(32, 32)
        this.#image.body.setOffset(16, 32)
        this.#image.setScale(g_scale)

        group.add(this.#image)

        this.#level = level
        this.#speed = speed
        this.#depthMod = Phaser.Math.RND.between(0, 3)
    }

    /**
     * @returns {integer} level
     */
    get level() { return this.#level }

    /**
     * @returns {Phaser.Types.Math.Vector2Like} position
     */
    get position() { return { x: this.#image.x, y: this.#image.y } }

    /**
     * @param { Phaser.Types.Math.Vector2Like } playerPos
     */
    update(playerPos) {
        const vec = new Phaser.Math.Vector2(playerPos.x - this.#image.x, playerPos.y - this.#image.y)
        vec.normalize()

        this.#image.body.velocity.x = vec.x * this.#speed
        this.#image.body.velocity.y = vec.y * this.#speed

        this.#image.flipX = this.#image.body.velocity.x < 0
        // TODO: there are some z-fights in the crowd
        this.#image.depth = this.#image.y + this.#image.height * 0.5 + this.#depthMod
    }
}

export default Enemy
