class Play extends Phaser.Scene {
    /** @type {TileSprite} */ #background

    /** @type {Player} */ #player
    /** @type {SpellCaster} */ #spellCaster
    /** @type {EnemyHandler} */ #enemyHandler

    // physics
    /** @type {PhysicsGroup} */ #playerGroup
    /** @type {PhysicsGroup} */ #playerSkillsGroup
    /** @type {PhysicsGroup} */ #enemyGroup

    #lastHitTime = 0
    #hitDelay = 1000

    preload() {
        this.#lastHitTime = 0
    }

    create(data) {
        this.#background = this.add.tileSprite(
            this.game.config.width * 0.5, this.game.config.height * 0.5,
            this.game.config.width, this.game.config.height,
            'grass'
        )
        
        // TODO: should be something Number.NEGATIVE_MIN_VALUE
        // (Number.MIN_VALUE returns the closest number to ZERO)
        this.#background.depth = -10000

        this.#playerGroup = this.physics.add.group()
        this.#playerSkillsGroup = this.physics.add.group()
        this.#enemyGroup = this.physics.add.group()

        const playerSpeed = 50
        const enemySpeed = [40, 45, 50, 55]

        this.#player = new Player(this, data.lives, data.level, playerSpeed, this.#playerGroup)
        this.cameras.main.startFollow(this.#player.getPhysicsImage())

        this.#enemyHandler = new EnemyHandler(this, 500, 100, enemySpeed, this.#enemyGroup, this.#player)
        
        this.#spellCaster = new SpellCaster(this, this.#player, this.#enemyHandler, this.#playerSkillsGroup)

        this.physics.add.collider(this.#enemyGroup, this.#enemyGroup)
        this.physics.add.overlap(this.#playerGroup, this.#enemyGroup, this.enemyOverlapPlayer, null, this)
        this.physics.add.overlap(this.#enemyGroup, this.#playerSkillsGroup, this.enemyOverlapSkill, null, this)

        // TODO: workaround
        this.game.scene.add('playUI', PlayUI)
        this.scene.launch('playUI', data.lives)
    }

    /**
     * @param {PhysicsImage} player
     * @param {PhysicsImage} enemy
     */
    enemyOverlapPlayer(player, enemy) {
        if (this.#lastHitTime + this.#hitDelay > this.time.now) return

        const lives = this.#player.hit()
        this.#lastHitTime = this.time.now

        this.events.emit('playerHit', [lives])

        // debug
        /*if (lives === -1) {
            this.#player.setLives(3)
            return
        }*/

        // TODO: game over
        if (lives === 0) {
            this.scene.stop('playUI')
            this.scene.remove('playUI')
            this.scene.start('mainmenu')
        }
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

        this.#spellCaster.destroySkill(skill)
    }

    update() {
        this.#player.update()
        const ppos = this.#player.getPosition()

        this.#background.setPosition(ppos.x, ppos.y)
        this.#background.setTilePosition(ppos.x, ppos.y)

        this.#enemyHandler.update()

        this.#spellCaster.update()
    }
}
