class Play extends Phaser.Scene {
    /** @type {Player} */ #player
    /** @type {Enemy} */ #enemies = []

    // physics
    /** @type {PhysicsGroup} */ #playerGroup
    /** @type {PhysicsGroup} */ #enemyGroup

    /** @type {number} */ #lastHitTime = 0
    #hitDelay = 1000

    preload() {
        this.#lastHitTime = 0
    }

    create() {
        this.#playerGroup = this.physics.add.group()
        this.#enemyGroup = this.physics.add.group()

        this.#player = new Player(this, 200, this.#playerGroup)
        this.cameras.main.startFollow(this.#player.getPhysicsImage())

        const enemySpeed = 100
        this.#enemies.push(
            new Enemy(this, this.game.config.width * 0.5, this.game.config.height * 0.25, enemySpeed, this.#enemyGroup),
            new Enemy(this, this.game.config.width * 0.75, this.game.config.height * 0.5, enemySpeed, this.#enemyGroup),
            new Enemy(this, this.game.config.width * 0.5, this.game.config.height * 0.75, enemySpeed, this.#enemyGroup),
            new Enemy(this, this.game.config.width * 0.25, this.game.config.height * 0.5, enemySpeed, this.#enemyGroup),
        )

        this.physics.add.collider(this.#enemyGroup, this.#enemyGroup)
        this.physics.add.overlap(this.#playerGroup, this.#enemyGroup, this.enemyOverlapPlayer, null, this)
    }

    enemyOverlapPlayer(player, enemy) {
        if (this.#lastHitTime + this.#hitDelay > this.time.now) return

        this.#player.hit()
        this.#lastHitTime = this.time.now
    }

    update() {
        this.#player.update()
        let playerPos = this.#player.getPosition()

        let i = this.#enemies.length
        while (i--) {
            this.#enemies[i].update(playerPos)
        }
    }
}
