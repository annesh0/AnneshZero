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

    window.setTimeout(simpleEvalAI, 500)
}
const generalPieceValue = new Map([
    ["p", 10],
    ["n", 30],
    ["b", 30],
    ["r", 50],
    ["q", 90],
    ["k", 900]
]);

const whitePawnValues = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
]

const whiteKnightValues = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50],
]

const whiteBishopValues = [
    [-20,-10,-10,-10,-10,-10,-10,-20]
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20,]
]

const whiteRookValues = [
    [0,  0,  0,  0,  0,  0,  0,  0]
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
]

const whiteQueenValues = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
]

const whiteKingValues = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
]

//mirror values for black pieces
blackPawnValues = whitePawnValues.slice().reverse()
blackKnightValues = whiteKnightValues.slice().reverse()
blackBishopValues = whiteBishopValues.slice().reverse()
blackRookValues = whiteRookValues.slice().reverse()
blackQueenValues = whiteQueenValues.slice().reverse()
blackKingValues = whiteKingValues.slice().reverse()

function updatedPosEval(position) {
    var value = 0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            var curBoard = chess.board()
            var entry = curBoard[i][j]
            if(entry != null) {
                if(entry.color == 'b'){
                    value += (-1) * generalPieceValue.get(entry.type)
                    switch(entry.type) {
                        case "p":
                            value += blackPawnValues[i][j];
                            break;
                        case "n":
                            value += blackKnightValues[i][j];
                            break;
                        case "b":
                            value += blackBishopValues[i][j];
                            break;
                        case "r":
                            value += blackRookValues[i][j];
                            break;
                        case "q":
                            value += blackQueenValues[i][j];
                            break;
                        case "k":
                            value += blackKingValues[i][j];
                            break;
                    }
                } else {
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
 * Minimax algo
 * @param {*} chess game state object
 * @param {*} depth current tree depth
 * @param {*} flag true if maximizing player, else false
 * @returns [bestMove, evalValue]
 */
function minimax(chess, depth, flag) {
    if(depth == 0 || chess.game_over()) {
        return [null, updatedPosEval(chess.fen())]
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
        for(const move of chess.move()) {
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
        chess.move(minimax(chess, 5, false)[0])
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

window.setTimeout(simpleEvalAI, 500)

