class EnemySpawner {
    /** @type {Player} */ #player

    /** @type {Enemy} */ #enemies = []

    /**
     * @param {Phaser.Scene} scene
     * @param {number} spawnDelay
     * @param {PhysicsGroup} enemyGroup
     * @param {Player} player
     */
    constructor(scene, spawnDelay, enemyGroup, player) {
        this.#player = player

        const enemySpeed = [100, 125, 150, 175]
        const enemies = this.#enemies

        scene.time.addEvent({
            delay: spawnDelay,
            repeat: 10,
            loop: false,
            callback: function() {
                const playerPos = player.getPosition()
                enemies.push(
                    new Enemy(
                        scene,
                        playerPos.x + Phaser.Math.RND.realInRange(0.3, 1) * Phaser.Math.RND.pick([-1, 1]) * 1000,
                        playerPos.y + Phaser.Math.RND.realInRange(0.3, 1) * Phaser.Math.RND.pick([-1, 1]) * 1000,
                        Phaser.Math.RND.pick(enemySpeed),
                        enemyGroup))
            },
        })
    }

    update() {
        let i = this.#enemies.length
        while (i--) {
            this.#enemies[i].update(this.#player.getPosition())
        }
    }
}
