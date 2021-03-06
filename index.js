//import Chess from "chess.js"

const chess = new Chess()
var config = {
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    dropOffBoard: 'snapback', // this is the default
    position: 'start'
}

function onDragStart(source, piece, position, orientation) {
    //make sure game not over
    if(chess.game_over()) return false
    //make sure white to move and only picking up white pieces
    if(chess.turn() == 'b' || piece.search(/^b/) !== -1 ) return false
}

function onDrop(source, target) {
    var move = chess.move({
        from:source,
        to: target,
        promotion: 'q'
    })
    if (move == null) return 'snapback'

    window.setTimeout(alphabetaAI, 50)
}
var generalPieceValue = new Map([
    ["p", 100],
    ["n", 320],
    ["b", 330],
    ["r", 500],
    ["q", 900],
    ["k", 20000]
]);

var whitePawnValues = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

var whiteKnightValues = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50],
];

var whiteBishopValues = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20,]
];
var whiteRookValues = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];

var whiteQueenValues = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];

var whiteKingValues = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
];
//mirror values for black pieces
var blackPawnValues = whitePawnValues.slice().reverse()
var blackKnightValues = whiteKnightValues.slice().reverse()
var blackBishopValues = whiteBishopValues.slice().reverse()
var blackRookValues = whiteRookValues.slice().reverse()
var blackQueenValues = whiteQueenValues.slice().reverse()
var blackKingValues = whiteKingValues.slice().reverse()

function updatedPosEval(curBoard) {
    var value = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            var entry = curBoard[i][j]
            //console.log(entry)
            if(entry != null) {
                //console.log(entry.type)
                if(entry.color == 'b'){
                    value += (-1) * generalPieceValue.get(entry.type)
                    switch(entry.type) {
                        case "p":
                            value += (-1) * blackPawnValues[i][j];
                            break;
                        case "n":
                            value += (-1) *  blackKnightValues[i][j];
                            break;
                        case "b":
                            value += (-1) *  blackBishopValues[i][j];
                            break;
                        case "r":
                            value += (-1) *  blackRookValues[i][j];
                            break;
                        case "q":
                            value += (-1) *  blackQueenValues[i][j];
                            break;
                        case "k":
                            value +=  (-1) *  blackKingValues[i][j];
                            break;
                    }
                } else if (entry.color == "w"){
                    value += (1) * generalPieceValue.get(entry.type)
                    switch(entry.type) {
                        case "p":
                            value += whitePawnValues[i][j];
                            break;
                        case "n":
                            value += whiteKnightValues[i][j];
                            break;
                        case "b":
                            value += whiteBishopValues[i][j];
                            break;
                        case "r":
                            value += whiteRookValues[i][j];
                            break;
                        case "q":
                            value += whiteQueenValues[i][j];
                            break;
                        case "k":
                            value += whiteKingValues[i][j];
                            break;
                    }
                }
                
            }
        }
    }
    return value
}

function posEval(position) {
    var value = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            var curBoard = chess.board()
            var entry = curBoard[i][j]
            if(entry != null) {
                if(entry.color == 'b'){
                    value += (-1) * generalPieceValue.get(entry.type)
                } else {
                    value += (1) * generalPieceValue.get(entry.type)
                }
            }
        }
    }
    //console.log(value)
    return value
}

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
var board1 = Chessboard('board1', config)

window.setTimeout(quiescenceAI(), 50)

