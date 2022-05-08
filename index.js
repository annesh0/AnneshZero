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

function minMaxAI() {
    
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

