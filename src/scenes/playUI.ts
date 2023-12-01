import { defaultTextStyle } from "../common"

export default class PlayUI extends Phaser.Scene {
    private _playScene!: Phaser.Scene

    private _hearts: Phaser.GameObjects.Image[] = []

    private _level10!: Phaser.GameObjects.Image
    private _level1!: Phaser.GameObjects.Image

    private _pauseText!: Phaser.GameObjects.Text

    private _paused: boolean = false

    create(data: { lives: integer, level: integer }) {
        for (let i = 1; i < data.lives + 1; i++) {
            const h = this.add.image(10 + i * 15, i * 5 + 25, "mainatlas", "tile_heart")
            h.setTint(0xFF2222)
            this._hearts.push(h)
        }

		const [w, h] = [this.game.config.width as number, this.game.config.height as number]

        this._level1 = this.add.image(w - 32, 32, "mainatlas", `ui_num${data.level % 10}`)
        this._level10 = this.add.image(w - 64, 32, "mainatlas", data.level > 9 ? `ui_num${Math.floor(data.level * 0.1) % 10}` : "ui_num0")

        // TODO: should avoid using built-in scene events
        this._playScene = this.scene.get("play")
        this._playScene.events.on("playerHit", this.onPlayerHit, this)
        this._playScene.events.on("playerLevelUp", this.playerLevelUp, this)

        const textStyle = defaultTextStyle(30)
        textStyle.backgroundColor = "#000000"

        this._pauseText = this.add.text(w * 0.5, h * 0.5, "  game paused  ", textStyle)
        this._pauseText.setOrigin(0.5, 0.5)
        this._pauseText.setVisible(false)

        this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on(Phaser.Input.Keyboard.Events.DOWN, this.onESCDown, this)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this)
    }

    onPlayerHit(lives: integer) {
        // console.log(`[playUI.onPlayerHit] lives: ${lives}`)

        if (lives == -1) {
            // Debug revive
            let i = this._hearts.length
            while (i--) {
                this._hearts[i].setVisible(true)
            }
        }
        else this._hearts[lives].setVisible(false)
    }

    playerLevelUp(level: integer) {
        this._level1.setTexture("mainatlas", `ui_num${level % 10}`)
        this._level10.setTexture("mainatlas", level > 9 ? `ui_num${Math.floor(level * 0.1) % 10}` : "ui_num0")
    }

    onESCDown() {
        if (!this._paused) {
            this.scene.pause("play")
            this._pauseText.setVisible(true)
        }
        else {
            this.scene.resume("play")
            this._pauseText.setVisible(false)
        }

        this._paused = !this._paused
    }

    onShutdown() {
        this._playScene.events.off("playerHit", this.onPlayerHit, this)
        this._playScene.events.off("playerLevelUp", this.playerLevelUp, this)

        this.events.off(Phaser.Scenes.Events.SHUTDOWN, this.onShutdown, this)
    }
}
