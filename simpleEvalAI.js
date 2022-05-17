function simpleEvalAI() {
    if (chess.game_over()) return

    if(chess.turn() == "b") {
        const moves = chess.moves()
        var bestMove = null
        var minVal = 9999
        for(const move of moves) {
            if(move != null) {
                chess.move(move)
                console.log(posEval(chess.fen()))
                if(posEval(chess.fen()) < minVal) {
                    bestMove = move
                    minVal = posEval(chess.fen())
                }
                chess.undo()
            }
        }
        chess.move(bestMove)
        board1.position(chess.fen())
    }
}