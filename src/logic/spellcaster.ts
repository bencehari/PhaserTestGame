import { Scene, Physics, GameObjects } from "phaser"

import { g_scale } from "../globals"
import { fireball } from "../data/spells"

import Player from "../objects/player"
import EnemyHandler from "./enemyhandler"

export default class SpellCaster {
	private _scene!: Scene

	private _player!: Player
	private _enemyHandler!: EnemyHandler
	private _skillGroup!: Physics.Arcade.Group

	private _lastCastTime: number = 0
	private _time: number = 0
	private _plvlAttackSpeedBonus: number = 1

	constructor(scene: Scene, player: Player, enemyHandler: EnemyHandler, skillGroup: Physics.Arcade.Group) {
		this._scene = scene
		this._player = player
		this._enemyHandler = enemyHandler
		this._skillGroup = skillGroup

		scene.events.on("playerLevelUp", this.onPlayerLevelUp, this)
		this.onPlayerLevelUp(player.level)
	}

	onPlayerLevelUp(level: integer) {
		this._plvlAttackSpeedBonus = 1 - level * 0.0075
	}

	update(_: number, dt: number) {
		this._time += dt

		if (this._lastCastTime + fireball.castDelay * this._plvlAttackSpeedBonus > this._time) return
		this._lastCastTime = this._time

        this.castFireball(this._enemyHandler.getClosesEnemy(this._player.position))
	}

	castFireball(target: { dir: Phaser.Math.Vector2 | null, distSq: number }) {
        if (target.dir === null) return
        else if (target.distSq > fireball.rangeSq) return

        const ppos = this._player.position

        const fb = this._scene.physics.add.image(ppos.x!, ppos.y!, fireball.atlas, fireball.frame)
        fb.setScale(g_scale)
        fb.body.setSize(fb.width * g_scale, fb.height * g_scale)
        this._skillGroup.add(fb)
        fb.setVelocity(target.dir.x * fireball.speed, target.dir.y * fireball.speed)

        fb.setData("level", this._player.level)

        this._scene.time.delayedCall(fireball.lifetime, this.destroySkill, [fb], this)
    }

    destroySkill(skill: GameObjects.GameObject) {
        if (skill === null) return

        this._skillGroup.remove(skill)
        skill.destroy()
    }
}
