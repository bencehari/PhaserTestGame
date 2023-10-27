class Play extends Phaser.Scene {
    /** @type {Player} */ #player
    /** @type {EnemyHandler} */ #enemyHandler

    // physics
    /** @type {PhysicsGroup} */ #playerGroup
    /** @type {PhysicsGroup} */ #playerSkillsGroup
    /** @type {PhysicsGroup} */ #enemyGroup

    #lastHitTime = 0
    #hitDelay = 1000

    /** @type {Phaser.Math.Vector2} */ #closestEnemyDir

    #lastCastTime = 0
    #castDelay = 1500

    preload() {
        this.#lastHitTime = 0
        this.#lastCastTime = 0
    }

    create(data) {
        this.scene.launch('playUI', data.lives)

        this.#playerGroup = this.physics.add.group()
        this.#playerSkillsGroup = this.physics.add.group()
        this.#enemyGroup = this.physics.add.group()

        this.#player = new Player(this, data.level, 100, this.#playerGroup)
        this.cameras.main.startFollow(this.#player.getPhysicsImage())

        this.#enemyHandler = new EnemyHandler(this, 2000, this.#enemyGroup, this.#player)

        this.physics.add.collider(this.#enemyGroup, this.#enemyGroup)
        this.physics.add.overlap(this.#playerGroup, this.#enemyGroup, this.enemyOverlapPlayer, null, this)
        this.physics.add.overlap(this.#enemyGroup, this.#playerSkillsGroup, this.enemyOverlapSkill, null, this)
    }

    enemyOverlapPlayer(player, enemy) {
        if (this.#lastHitTime + this.#hitDelay > this.time.now) return

        this.#player.hit()
        this.#lastHitTime = this.time.now

        this.events.emit('playerHit')
    }

    enemyOverlapSkill(enemy, skill) {
        // TODO: kill enemy

        this.#playerSkillsGroup.remove(skill)
        skill.destroy()
    }

    update() {
        this.#player.update()
        this.#enemyHandler.update()

        this.#closestEnemyDir = this.#enemyHandler.getClosesEnemy(this.#player.getPosition())
        this.castSpell()
    }

    castSpell() {
        if (this.#closestEnemyDir === null) return
        if (this.#lastCastTime + this.#castDelay > this.time.now) return

        this.#lastCastTime = this.time.now

        const ppos = this.#player.getPosition()

        const speed = 100

        const fireball = this.physics.add.image(ppos.x, ppos.y, 'secatlas', 'red_char')
        fireball.setScale(g_scale)
        this.#playerSkillsGroup.add(fireball)
        fireball.setVelocity(this.#closestEnemyDir.x * speed, this.#closestEnemyDir.y * speed)

        // TODO: destroy fireball after some time
    }
}