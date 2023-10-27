class Play extends Phaser.Scene {
    /** @type {Player} */ #player
    /** @type {EnemySpawner} */ #enemySpawner

    // physics
    /** @type {PhysicsGroup} */ #playerGroup
    /** @type {PhysicsGroup} */ #enemyGroup

    /** @type {number} */ #lastHitTime = 0
    #hitDelay = 1000

    preload() {
        this.#lastHitTime = 0
    }

    create(data) {
        this.scene.launch('playUI', data.lives)

        this.#playerGroup = this.physics.add.group()
        this.#enemyGroup = this.physics.add.group()

        this.#player = new Player(this, 100, this.#playerGroup)
        this.cameras.main.startFollow(this.#player.getPhysicsImage())

        this.#enemySpawner = new EnemySpawner(this, 2000, this.#enemyGroup, this.#player)

        this.physics.add.collider(this.#enemyGroup, this.#enemyGroup)
        this.physics.add.overlap(this.#playerGroup, this.#enemyGroup, this.enemyOverlapPlayer, null, this)
    }

    enemyOverlapPlayer(player, enemy) {
        if (this.#lastHitTime + this.#hitDelay > this.time.now) return

        this.#player.hit()
        this.#lastHitTime = this.time.now

        this.events.emit('playerHit')
    }

    update() {
        this.#player.update()
        this.#enemySpawner.update()
    }
}
