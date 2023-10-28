class MainMenu extends Phaser.Scene {
    /** @type {Key} */ #spaceBar

    create() {
        this.#spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        const text = this.add.text(this.game.config.width * 0.5, this.game.config.height * 0.5, 'press space to start game', getDefaultTextStyle(30))
        text.setOrigin(0.5, 0.5)
    }

    update() {
        if (this.#spaceBar.isDown) this.scene.start('play', { lives: 3, level: 1 })
    }
}
