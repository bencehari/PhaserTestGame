"use strict"

import { g_scale } from "../globals.js"

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
        let move

        if (this.#pointerDown) {
            move = new Phaser.Math.Vector2(
                this.#scene.input.activePointer.worldX,
                this.#scene.input.activePointer.worldY
            )

            this.#image.flipX = move.x < this.#image.x

            move.subtract({
                x: this.#image.x,
                y: this.#image.y
            })
        }
        else {
            move = new Phaser.Math.Vector2(0, 0)

            if (this.#cursor.up.isDown) move.y += -1
            if (this.#cursor.down.isDown) move.y += 1
            if (this.#cursor.left.isDown) {
                move.x += -1
                this.#image.flipX = true
            }
            if (this.#cursor.right.isDown) {
                move.x += 1
                this.#image.flipX = false
            }
        }

        move = move.normalize()

        this.#image.body.velocity.x = move.x * this.#speed
        this.#image.body.velocity.y = move.y * this.#speed

        this.#image.depth = this.#image.y + this.#image.height * 0.5
    }

    onPointerDown(pointer) { this.#pointerDown = true }
    onPointerUp(pointer) { this.#pointerDown = false }

    /**
     * @returns {integer} new level
     */
    levelUp() { return ++this.#level }

    // debug
    setLives(lives) { this.#lives = lives }
}

export default Player
