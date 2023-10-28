class EnemyHandler {
    /** @type {Player} */ #player

    /** @type {Array<Enemy>} */ #enemies = []

    /**
     * @param {Phaser.Scene} scene
     * @param {number} spawnDelay
     * @param {integer} repeatCount
     * @param {Array<integer>} speed
     * @param {PhysicsGroup} enemyGroup
     * @param {Player} player
     */
    constructor(scene, spawnDelay, repeatCount, speed, enemyGroup, player) {
        this.#player = player

        const enemies = this.#enemies
        const spawnDistanceMod = 1000

        scene.time.addEvent({
            delay: spawnDelay,
            repeat: repeatCount,
            loop: false,
            callback: function() {
                const playerPos = player.getPosition()
                enemies.push(
                    new Enemy(
                        scene,
                        playerPos.x + Phaser.Math.RND.realInRange(0.3, 1) * Phaser.Math.RND.pick([-1, 1]) * spawnDistanceMod,
                        playerPos.y + Phaser.Math.RND.realInRange(0.3, 1) * Phaser.Math.RND.pick([-1, 1]) * spawnDistanceMod,
                        1,
                        Phaser.Math.RND.pick(speed),
                        enemyGroup))
            },
        })
    }

    /**
     * @param {Phaser.Types.Math.Vector2Like} tpos target position
     * @returns {Phaser.Math.Vector2} dir vector pointing to closest enemy from tpos
     */
    getClosesEnemy(tpos) {
        let min_dist = Number.MAX_VALUE
        let direction = null

        let i = this.#enemies.length
        while (i--) {
            const epos = this.#enemies[i].getPosition()
            const vec = new Phaser.Math.Vector2(epos.x - tpos.x, epos.y - tpos.y)
            const dist = vec.lengthSq()
            if (dist < min_dist) {
                min_dist = dist
                direction = vec
            }
        }

        return direction !== null ? direction.normalize() : null
    }

    update() {
        let i = this.#enemies.length
        while (i--) {
            this.#enemies[i].update(this.#player.getPosition())
        }
    }

    /**
     * @param {Enemy} enemy 
     */
    enemyKilled(enemy) {
        let i = this.#enemies.length
        while (i--) {
            if (this.#enemies[i] === enemy) {
                this.#enemies.splice(i, 1)
                break
            }
        }
    }
}
