const game = new Phaser.Game({
    width: 1128,
    height: 615,
    backgroundColor: '#2d2d2d',
    physics: { default: 'arcade' },
    parent: 'game',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 922,
            height: 487,
        },
        max: {
            width: 2256,
            height: 1230,
        },
    }
})

game.scene.add('init', Init)
game.scene.add('mainmenu', MainMenu)
game.scene.add('play', Play)

game.scene.start('init')
