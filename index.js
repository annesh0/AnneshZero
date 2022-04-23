const { Chess } = require("chess.js")

const chess = new Chess()
var config = {
    draggable: true,
    dropOffBoard: 'snapback', // this is the default
    position: 'start'
  }

var board1 = Chessboard('board1', config)