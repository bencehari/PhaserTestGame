import Enemy from "../objects/enemy"
import Player from "../objects/player"

export default class EnemyHandler {
    private _player!: Player

    private _enemies: Enemy[] = []

    constructor(scene: Phaser.Scene, spawnDelay: number, repeatCount: integer, speed: number[], enemyGroup: Phaser.Physics.Arcade.Group, player: Player) {
        this._player = player

        const enemies = this._enemies
        const spawnDistanceMod = 1000

        scene.time.addEvent({
            delay: spawnDelay,
            repeat: repeatCount,
            loop: false,
            callback: function() {
                const playerPos = player.position
                for (let i = 0; i < 3; i++) {
                    enemies.push(
                        new Enemy(
                            scene,
                            playerPos.x! + Phaser.Math.RND.realInRange(0.3, 1) * Phaser.Math.RND.pick([-1, 1]) * spawnDistanceMod,
                            playerPos.y! + Phaser.Math.RND.realInRange(0.3, 1) * Phaser.Math.RND.pick([-1, 1]) * spawnDistanceMod,
                            1,
                            Phaser.Math.RND.pick(speed),
                            enemyGroup
                        )
                    )
                }
            },
        })
    }

    /**
     * @returns {dir: Phaser.Math.Vector2, distSq: number} dir vector pointing to closest enemy from tpos
     */
    getClosesEnemy(targetPos: Phaser.Types.Math.Vector2Like): { dir: Phaser.Math.Vector2 | null, distSq: number } {
        let minDist = Number.MAX_VALUE
        let direction = null

        let i = this._enemies.length
        while (i--) {
            const epos = this._enemies[i].position
            const vec = new Phaser.Math.Vector2(epos.x! - targetPos.x!, epos.y! - targetPos.y!)
            const dist = vec.lengthSq()
            if (dist < minDist) {
                minDist = dist
                direction = vec
            }
        }

        return {
            dir: direction !== null ? direction.normalize() : null,
            distSq: minDist
        }
    }

    update() {
        let i = this._enemies.length
        while (i--) {
            this._enemies[i].update(this._player.position)
        }
    }

    enemyKilled(enemy: Enemy) {
        let i = this._enemies.length
        while (i--) {
            if (this._enemies[i] === enemy) {
                this._enemies.splice(i, 1)
                break
            }
        }
    }
}
