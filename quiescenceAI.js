/**
 * alpha-beta pruning of minimax algo with one step quiescence search
 */
 function quiescence(chess, depth, alpha, beta, flag, lastMove) {
    if(depth == 0 ) {
        if(lastMove.indexOf("x") != -1){
            //check recaptures
            var curEval = updatedPosEval(chess.board())
            var captures = chess.moves({verbose:true}).filter(cap => cap.flags == "c");
            for(const capture of captures) {
                chess.move({from:capture.from, to:capture.to})
                curEval = Math.max(curEval, updatedPosEval(chess.board()))
                chess.undo()
            }
            return [null, -curEval]
        } else {
            return [null, -updatedPosEval(chess.board())]
        }
    }
    var bestMove = null
    if(flag) {
        var maxEval = -999999
        for(const move of chess.moves()) {
            chess.move(move)
            var curVal = Math.max(maxEval, quiescence(chess, depth-1, alpha, beta, !flag)[1], move)
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
            var curVal = Math.min(minEval, quiescence(chess,depth-1, alpha, beta, !flag)[1], move)
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

//AI using quiescence
function quiescenceAI() {
    if(chess.game_over()) return
    if(chess.turn() == 'b') {
        chess.move(quiescence(chess, 3, -999999,999999, true)[0], null)
        board1.position(chess.fen())
    }
}