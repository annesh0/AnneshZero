function randomAI() {
    if (chess.game_over()) return

    if(chess.turn() == "b") {
        const moves = chess.moves()
        const move = moves[Math.floor(Math.random() * moves.length)]
        chess.move(move)
        board1.position(chess.fen())
    }
    window.setTimeout(randomAI, 500)
}