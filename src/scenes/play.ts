import PlayUI from "./playUI"
import Player from "../objects/player"
import EnemyHandler from "../logic/enemyhandler"
import SpellCaster from "../logic/spellcaster"
import { fireball } from "../data/spells"

export default class Play extends Phaser.Scene {
    private _background!: Phaser.GameObjects.TileSprite

    private _player!: Player
    private _spellCaster!: SpellCaster
    private _enemyHandler!: EnemyHandler

    // physics
    private _playerGroup!: Phaser.Physics.Arcade.Group
    private _playerSkillsGroup!: Phaser.Physics.Arcade.Group
    private _enemyGroup!: Phaser.Physics.Arcade.Group

    private _lastHitTime: number = 0
    private _hitDelay: number = 1000

    preload() {
        this._lastHitTime = 0
    }

    create(data: { lives: integer, level: integer }) {
        this._background = this.add.tileSprite(
            this.game.config.width as number * 0.5, this.game.config.height as number * 0.5,
            this.game.config.width as number, this.game.config.height as number,
            "grass"
        )

        // TODO: should be something Number.NEGATIVE_MIN_VALUE
        // (Number.MIN_VALUE returns the closest number to ZERO)
        this._background.depth = -10000

        this._playerGroup = this.physics.add.group()
        this._playerSkillsGroup = this.physics.add.group()
        this._enemyGroup = this.physics.add.group()

        const playerSpeed = 50
        const enemySpeed = [40, 45, 50, 55]

        this._player = new Player(this, data.lives, data.level, playerSpeed, this._playerGroup)
        this.cameras.main.startFollow(this._player.physicsImage)

        this._enemyHandler = new EnemyHandler(this, 500, 100, enemySpeed, this._enemyGroup, this._player)

        this._spellCaster = new SpellCaster(this, this._player, this._enemyHandler, this._playerSkillsGroup)

        this.physics.add.collider(this._enemyGroup, this._enemyGroup)
        this.physics.add.overlap(this._playerGroup, this._enemyGroup, this.enemyOverlapPlayer, undefined, this)
        this.physics.add.overlap(this._enemyGroup, this._playerSkillsGroup, this.enemyOverlapSkill, undefined, this)

        this.game.scene.add("playUI", PlayUI)
        this.scene.launch("playUI", data)

        // debug
        this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on(Phaser.Input.Keyboard.Events.DOWN, this.onSpaceDown, this)
    }

    onSpaceDown() {
        this.events.emit("playerLevelUp", this._player.levelUp())
    }

	
    enemyOverlapPlayer(_uu0: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, _uu1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
        if (this._lastHitTime + this._hitDelay > this.time.now) return

        const lives = this._player.hit()
        this._lastHitTime = this.time.now

        this.events.emit("playerHit", [lives])

        // debug
        /*if (lives === -1) {
            this.#player.setLives(3)
            return
        }*/

        // TODO: game over
        if (lives === 0) {
            this.scene.stop("playUI")
            this.scene.remove("playUI")
            this.scene.start("mainmenu")
        }
    }

    enemyOverlapSkill(enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, skill: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile) {
		enemy = enemy as Phaser.Types.Physics.Arcade.GameObjectWithBody
		skill = skill as Phaser.Types.Physics.Arcade.GameObjectWithBody

        const e = enemy.getData("owner")
        const target = Phaser.Math.Clamp(fireball.baseHitChance + (skill.getData("level") - e.level) * 5, 5, 95)

        if (Phaser.Math.RND.integerInRange(0, 100) < target) {
            this._enemyHandler.enemyKilled(e)
            this._enemyGroup.remove(enemy)
            enemy.destroy()
        }

        this._spellCaster.destroySkill(skill)
    }

    update(time: number, dt: number) {
        this._player.update()
        const ppos = this._player.position

        this._background.setPosition(ppos.x, ppos.y)
        this._background.setTilePosition(ppos.x, ppos.y)

        this._enemyHandler.update()

        this._spellCaster.update(time, dt)
    }
}
