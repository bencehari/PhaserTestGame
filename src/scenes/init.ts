import Phaser from "phaser"
import { defaultTextStyle } from "../common"

export default class Init extends Phaser.Scene {
    private _progress!: Phaser.GameObjects.Text

    preload() {
        this._progress = this.add.text(this.game.config.width as number * 0.5, this.game.config.height as number * 0.5, 'loading\n0%', defaultTextStyle(30))
        this._progress.setOrigin(0.5, 0.5)
        this._progress.setAlign('center')

        this.load.on(Phaser.Loader.Events.PROGRESS, this.progress, this)

        this.load.atlas("mainatlas", "../../assets/scribble_platformer_spritesheet.png", "../assets/scribble_platformer_spritesheet_atlas.json")
        this.load.atlas("secatlas", "../../assets/scribble_dungeons_spritesheet.png", "../assets/scribble_dungeons_spritesheet_atlas.json")
        this.load.image("grass", "../../assets/grass.png")
    }

    progress(value: number) {
        this._progress.setText(`loading\n${value * 100}%`)
    }

    create() {
        this.scene.start("mainmenu")
    }
}
