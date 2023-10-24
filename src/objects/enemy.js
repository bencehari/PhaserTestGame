class Enemy {
    /** @type {Img} */ #image

    #speed

    /**
     *
     * @param {Phaser.Scene} scene
     * @param {number} x x position
     * @param {number} y y position
     * @param {number} speed
     */
    constructor(scene, x, y, speed) {
        this.#image = scene.add.image(x, y, 'mainatlas', 'char_roundRed')
        this.#speed = speed
    }

    update() {

    }
}
