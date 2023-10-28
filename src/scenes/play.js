class Play extends Phaser.Scene {
    /** @type {TileSprite} */ #background

    /** @type {Player} */ #player
    /** @type {EnemyHandler} */ #enemyHandler

    // physics
    /** @type {PhysicsGroup} */ #playerGroup
    /** @type {PhysicsGroup} */ #playerSkillsGroup
    /** @type {PhysicsGroup} */ #enemyGroup

    #lastHitTime = 0
    #hitDelay = 1000

    /** @type {dir: Phaser.Math.Vector2, distSq: number} */ #closestEnemyDir

    #lastCastTime = 0

    preload() {
        this.#lastHitTime = 0
        this.#lastCastTime = 0
    }

    create(data) {
        this.scene.launch('playUI', data.lives)

        this.#background = this.add.tileSprite(
            this.game.config.width * 0.5, this.game.config.height * 0.5,
            this.game.config.width, this.game.config.height,
            'grass')

        this.#playerGroup = this.physics.add.group()
        this.#playerSkillsGroup = this.physics.add.group()
        this.#enemyGroup = this.physics.add.group()

        const playerSpeed = 50
        const enemySpeed = [40, 45, 50, 55]

        this.#player = new Player(this, data.level, playerSpeed, this.#playerGroup)
        this.cameras.main.startFollow(this.#player.getPhysicsImage())

        this.#enemyHandler = new EnemyHandler(this, 500, 100, enemySpeed, this.#enemyGroup, this.#player)

        this.physics.add.collider(this.#enemyGroup, this.#enemyGroup)
        this.physics.add.overlap(this.#playerGroup, this.#enemyGroup, this.enemyOverlapPlayer, null, this)
        this.physics.add.overlap(this.#enemyGroup, this.#playerSkillsGroup, this.enemyOverlapSkill, null, this)
    }

    /**
     * @param {PhysicsImage} player
     * @param {PhysicsImage} enemy
     */
    enemyOverlapPlayer(player, enemy) {
        if (this.#lastHitTime + this.#hitDelay > this.time.now) return

        this.#player.hit()
        this.#lastHitTime = this.time.now

        this.events.emit('playerHit')
    }

    /**
     * @param {PhysicsImage} enemy 
     * @param {PhysicsImage} skill 
     */
    enemyOverlapSkill(enemy, skill) {
        const e = enemy.getData('owner')
        const target = Phaser.Math.Clamp(fireball.baseHitChance + (skill.getData('level') - e.getLevel()) * 5, 5, 95)

        if (Phaser.Math.RND.integerInRange(0, 100) < target) {
            this.#enemyHandler.enemyKilled(e)
            this.#enemyGroup.remove(enemy)
            enemy.destroy()
        }

        this.destroySkill(skill)
    }

    update() {
        this.#player.update()
        const ppos = this.#player.getPosition()

        this.#background.setPosition(ppos.x, ppos.y)
        this.#background.setTilePosition(ppos.x, ppos.y)

        this.#enemyHandler.update()

        this.#closestEnemyDir = this.#enemyHandler.getClosesEnemy(ppos)
        this.castSpell()
    }

    castSpell() {
        if (this.#closestEnemyDir.dir === null) return
        else if (this.#closestEnemyDir.distSq > fireball.rangeSq) return

        if (this.#lastCastTime + fireball.castDelay > this.time.now) return

        this.#lastCastTime = this.time.now

        const ppos = this.#player.getPosition()

        const fb = this.physics.add.image(ppos.x, ppos.y, fireball.atlas, fireball.frame)
        fb.setScale(g_scale)
        this.#playerSkillsGroup.add(fb)
        fb.setVelocity(this.#closestEnemyDir.dir.x * fireball.speed, this.#closestEnemyDir.dir.y * fireball.speed)

        fb.setData('level', this.#player.getLevel())

        this.time.delayedCall(fireball.lifetime, this.destroySkill, [fb], this)
    }

    destroySkill(skill) {
        if (skill === null) return

        this.#playerSkillsGroup.remove(skill)
        skill.destroy()
    }
}
