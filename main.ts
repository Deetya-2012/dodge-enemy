let player = sprites.create(img`
    . . . 5 5 5 5 . . .
    . . 5 5 5 5 5 5 . .
    . 5 5 5 5 5 5 5 5 .
    . 5 5 . . 5 5 . 5 .
    . 5 5 5 5 5 5 5 5 .
    . . 5 5 5 5 5 5 . .
    . . . 5 5 5 5 . . .
    . . . . 5 5 . . . .
`, SpriteKind.Player)
controller.moveSprite(player, 120, 0)  // left/right
player.setStayInScreen(true)
player.y = 100
scene.setBackgroundColor(1)
info.setScore(0)
info.setLife(1)

// --- Game variables ---
let level = 1
let enemySpeed = 90
let spawnMs = 650

// --- Spawn enemies repeatedly ---
game.onUpdateInterval(spawnMs, function () {
    const enemy = sprites.create(img`
        . . . f f f f . . .
        . . f 2 2 2 2 f . .
        . f 2 2 2 2 2 2 f .
        . f 2 2 f f 2 2 f .
        . f 2 2 2 2 2 2 f .
        . . f 2 2 2 2 f . .
        . . . f f f f . . .
    `, SpriteKind.Enemy)

    enemy.setPosition(randint(8, 152), -10)
    enemy.vy = enemySpeed + randint(0, 15)
})

// --- Score when enemies pass the player ---
game.onUpdate(function () {
    for (let e of sprites.allOfKind(SpriteKind.Enemy)) {
        if (e.y > 120) {
            e.destroy(effects.disintegrate, 100)
            info.changeScoreBy(1)
        }
    }
})

// --- Collision = Game Over ---
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (p, e) {
    e.destroy()
    game.over(false, effects.melt)
})

// --- Level up every 10 points (faster enemies) ---
game.onUpdate(function () {
    let newLevel = Math.idiv(info.score(), 10) + 1
    if (newLevel > level) {
        level = newLevel
        enemySpeed += 12
        effects.confetti.startScreenEffect(400)
        game.splash("Level " + level + "!", "Speed up!")
    }
})

// --- Optional: move with A/D keys too on keyboard ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function () { })
controller.B.onEvent(ControllerButtonEvent.Pressed, function () { })