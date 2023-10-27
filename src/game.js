const physicsDebug = {
    debug: true,
    debugShowBody: true,
    debugShowStaticBody: true,
    debugShowVelocity: true,
    debugVelocityColor: 0xffff00,
    debugBodyColor: 0x0000ff,
    debugStaticBodyColor: 0xffffff
}

const game = new Phaser.Game({
    width: 1128,
    height: 615,
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        // arcade: physicsDebug,
    },
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
game.scene.add('playUI', PlayUI)

game.scene.start('init')
