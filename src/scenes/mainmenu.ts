import { defaultTextStyle } from "../common"

export default class MainMenu extends Phaser.Scene {
    private _spaceBar!: Phaser.Input.Keyboard.Key

    create() {
        this._spaceBar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        const text = this.add.text(
			this.game.config.width as number * 0.5,
			this.game.config.height as number * 0.5,
			"press space to start game",
			defaultTextStyle(30))

        text.setOrigin(0.5, 0.5)

        // this.printPlayerLevelXPReqs()
    }

    update() {
        if (this._spaceBar.isDown) this.scene.start("play", { lives: 3, level: 1 })
    }

    printPlayerLevelXPReqs() {
        let xp0 = 0
        let xp1 = 5
        let xp = 5
        let mod = 1.5
        let modStep = 0.001
        for (let i = 2; i < 100; i++) {
            console.log(`level: ${i}, xp: ${xp}`)

            xp += Math.ceil(Math.ceil(xp1 - xp0) * mod)
            xp0 = xp1
            xp1 = xp
            mod += modStep
        }
    }
}
