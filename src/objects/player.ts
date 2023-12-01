import { g_scale } from "../globals"

export default class Player {
    private _scene!: Phaser.Scene
    private _cursor!: Phaser.Types.Input.Keyboard.CursorKeys
    private _image!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

    private _lives!: number
    private _level!: number
    private _speed!: number

    private _pointerDown: boolean = false

    constructor(scene: Phaser.Scene, lives: integer, level: integer, speed: number, group: Phaser.Physics.Arcade.Group) {
        this._scene = scene
        this._cursor = scene.input.keyboard!.createCursorKeys()

        this._image = scene.physics.add.image(scene.game.config.width as number * 0.5, scene.game.config.height as number * 0.5, "mainatlas", "char_squareYellow")
        this._image.body!.setSize(32, 32)
        this._image.body!.setOffset(16, 32)
        this._image.setScale(g_scale)

        group.add(this._image)

        this._lives = lives
        this._level = level
        this._speed = speed

        scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this)
        scene.input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this)
        scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this)
    }

    get physicsImage(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody { return this._image }

    get level(): integer { return this._level }

    get position(): Phaser.Types.Math.Vector2Like { return { x: this._image.x, y: this._image.y } }

    /**
     * @returns {integer} actual lives of player after hit
     */
    hit(): integer {
        this._lives--

        const image = this._image
        image.setTint(Phaser.Display.Color.GetColor(255, 0, 0))
        this._scene.tweens.addCounter({
            from: 0,
            to: 255,
            duration: 300,
            onUpdate: function(tween) {
                const value = Math.floor(tween.getValue())
                image.setTint(Phaser.Display.Color.GetColor(255, value, value))
            },
        })
        this._scene.cameras.main.shake(200, 0.005)

        return this._lives
    }

    update() {
        let move

        if (this._pointerDown) {
            move = new Phaser.Math.Vector2(
                this._scene.input.activePointer.worldX,
                this._scene.input.activePointer.worldY
            )

            this._image.flipX = move.x < this._image.x

            move.subtract({
                x: this._image.x,
                y: this._image.y
            })
        }
        else {
            move = new Phaser.Math.Vector2(0, 0)

            if (this._cursor.up.isDown) move.y += -1
            if (this._cursor.down.isDown) move.y += 1
            if (this._cursor.left.isDown) {
                move.x += -1
                this._image.flipX = true
            }
            if (this._cursor.right.isDown) {
                move.x += 1
                this._image.flipX = false
            }
        }

        move = move.normalize()

        this._image.body.velocity.x = move.x * this._speed
        this._image.body.velocity.y = move.y * this._speed

        this._image.depth = this._image.y + this._image.height * 0.5
    }

    onPointerDown() { this._pointerDown = true }
    onPointerUp() { this._pointerDown = false }

    levelUp(): integer { return ++this._level }

    // debug
    setLives(lives: integer) { this._lives = lives }
}
