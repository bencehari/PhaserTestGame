import { g_scale } from "../globals.js"
import { fireball } from "../data/spells.js"

class SpellCaster {
	/** @type {Phaser.Scene} */ #scene

	/** @type {Player} */ #player
	/** @type {EnemyHandler} */ #enemyHandler
	/** @type {PhysicsGroup} */ #skillGroup

	/** @type {dir: Phaser.Math.Vector2, distSq: number} */ #target

	#lastCastTime = 0
	#plvlAttackSpeedBonus = 1

	/**
	 * @param {Phaser.Scene} scene
	 * @param {Player} player
	 * @param {EnemyHandler} enemyHandler
	 * @param {PhysicsGroup} skillGroup
	 */
	constructor(scene, player, enemyHandler, skillGroup) {
		this.#scene = scene
		this.#player = player
		this.#enemyHandler = enemyHandler
		this.#skillGroup = skillGroup

		this.playerLevelUp()
	}

	// TODO: make this event-driven
	playerLevelUp() {
		this.#plvlAttackSpeedBonus = 1 - this.#player.level * 0.0075
	}

	update(time) {
		if (this.#lastCastTime + fireball.castDelay * this.#plvlAttackSpeedBonus > time) return
		this.#lastCastTime = time

        this.castFireball(this.#enemyHandler.getClosesEnemy(this.#player.position))
	}

	/**
	 * @param {dir: Phaser.Math.Vector2, distSq: number} target
	 */
	castFireball(target) {
        if (target.dir === null) return
        else if (target.distSq > fireball.rangeSq) return

        const ppos = this.#player.position

        const fb = this.#scene.physics.add.image(ppos.x, ppos.y, fireball.atlas, fireball.frame)
        fb.setScale(g_scale)
        fb.body.setSize(fb.width * g_scale, fb.height * g_scale)
        this.#skillGroup.add(fb)
        fb.setVelocity(target.dir.x * fireball.speed, target.dir.y * fireball.speed)

        fb.setData('level', this.#player.level)

        this.#scene.time.delayedCall(fireball.lifetime, this.destroySkill, [fb], this)
    }

    destroySkill(skill) {
        if (skill === null) return

        this.#skillGroup.remove(skill)
        skill.destroy()
    }
}

export default SpellCaster
