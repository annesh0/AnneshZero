
/**
 * Minimax algo w/ alpha beta pruning
 */
 function alphabeta(chess, depth, alpha, beta, flag) {
    if(depth == 0 ) {
        return [null, -updatedPosEval(chess.board())]
    }
    var bestMove = null
    if(flag) {
        var maxEval = -999999
        for(const move of chess.moves()) {
            chess.move(move)
            var curVal = Math.max(maxEval, alphabeta(chess, depth-1, alpha, beta, !flag)[1])
            chess.undo()
            if(curVal > maxEval) {
                maxEval = curVal
                bestMove = move
            }
            if(maxEval >= beta) {
                break;
            }
            alpha = Math.max(alpha, maxEval)
        }
        return [bestMove, maxEval]
    } else {
        var minEval = 999999
        for(const move of chess.moves()) {
            chess.move(move)
            var curVal = Math.min(minEval, minimax(chess,depth-1,!flag)[1])
            chess.undo()
            if(curVal < minEval) {
                minEval = curVal
                bestMove = move
            }
            if(minEval <= alpha) {
                break;
            }
            beta = Math.min(beta, minEval)
        }
        return [bestMove, minEval]
    }
}

//AI using alpha beta pruned minimax algo
function alphabetaAI() {
    if(chess.game_over()) return
    if(chess.turn() == 'b') {
        chess.move(alphabeta(chess, 3, -999999,999999, true)[0])
        board1.position(chess.fen())
    }
}
