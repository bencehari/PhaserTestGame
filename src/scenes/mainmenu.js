class MainMenu extends Phaser.Scene {
    create() {
        this.scene.start('play', { lives: 3, level: 1 })
    }
}
