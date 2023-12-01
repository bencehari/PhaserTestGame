import { g_scale } from "../globals"

export default class Enemy {
    private _image!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

    private _level: integer
    private _speed: number
    private _depthMod: number

    constructor(scene: Phaser.Scene, x: number, y: number, level: integer, speed: number, group: Phaser.Physics.Arcade.Group) {
        this._image = scene.physics.add.image(x, y, "mainatlas", "char_roundRed")
        this._image.setData("owner", this)

        this._image.body.setSize(32, 32)
        this._image.body.setOffset(16, 32)
        this._image.setScale(g_scale)

        group.add(this._image)

        this._level = level
        this._speed = speed
        this._depthMod = Phaser.Math.RND.between(0, 3)
    }

    get level(): integer { return this._level }

    get position(): Phaser.Types.Math.Vector2Like { return { x: this._image.x, y: this._image.y } }

    update(playerPos: Phaser.Types.Math.Vector2Like) {
        const vec = new Phaser.Math.Vector2(playerPos.x! - this._image.x, playerPos.y! - this._image.y)
        vec.normalize()

        this._image.body.velocity.x = vec.x * this._speed
        this._image.body.velocity.y = vec.y * this._speed

        this._image.flipX = this._image.body.velocity.x < 0
        // TODO: there are some z-fights in the crowd
        this._image.depth = this._image.y + this._image.height * 0.5 + this._depthMod
    }
}
