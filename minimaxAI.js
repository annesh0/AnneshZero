
/**
 * Standard Minimax algo
 * @param {*} chess is the game state object
 * @param {*} depth is the current tree depth
 * @param {*} flag is true if maximizing player, else false
 * @returns [bestMove, evalValue]
 */
 function minimax(chess, depth, flag) {
    if(depth == 0 ) {
        return [null, -updatedPosEval(chess.board())]
    }
    var bestMove = null
    if(flag) {
        var maxEval = -9999
        for(const move of chess.moves()) {
            chess.move(move)
            var curVal = Math.max(maxEval, minimax(chess, depth-1, !flag)[1])
            chess.undo()
            if(curVal > maxEval) {
                maxEval = curVal
                bestMove = move
            }
        }
        return [bestMove, maxEval]
    } else {
        var minEval = 9999
        for(const move of chess.moves()) {
            chess.move(move)
            var curVal = Math.min(minEval, minimax(chess,depth-1,!flag)[1])
            chess.undo()
            if(curVal < minEval) {
                minEval = curVal
                bestMove = move
            }
        }
        return [bestMove, minEval]
    }
}

//AI using minimax algo
function minimaxAI() {
    if(chess.game_over()) return
    if(chess.turn() == 'b') {
        chess.move(minimax(chess, 3, true)[0])
        board1.position(chess.fen())
    }
}