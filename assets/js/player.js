
var board,
game = new Chess();

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function(source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true ||
    piece.search(/^b/) !== -1) {
    return false;
  }
};

var makeRandomMove = function() {
  var possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return;
  $.post(
    "http://sammysignal.pythonanywhere.com/chess/",
    {
      "fen": game.fen(),
      "possibleMoves": possibleMoves.toString()
    },
    // {'data': [game.fen(), possibleMoves]},
    function(data,status,xhr){
      game.move(data);
      board.position(game.fen());
  });


  // var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  // console.log(possibleMoves[randomIndex])
  // game.move(possibleMoves[randomIndex]);
  // console.log(possibleMoves);
  // console.log(possibleMoves[12]);
  // console.log(typeof(possibleMoves[12]))
  // console.log(m);
  // console.log(typeof(m));
  
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  // make random legal move for black
  window.setTimeout(makeRandomMove, 250);
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  // orientation: 'black',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);


// var onChange = function(oldPos, newPos) {
//   console.log("Position changed:");
//   console.log("Old position: " + ChessBoard.objToFen(oldPos));
//   console.log("New position: " + ChessBoard.objToFen(newPos));
//   console.log("--------------------");
//   $.post(
//     "http://sammysignal.pythonanywhere.com/chess/",
//     ChessBoard.objToFen(newPos),
//     function(data,status,xhr){
//       console.log(data);
//     });
// };

// var cfg = {
//   draggable: true,
//   position: 'start',
//   onChange: onChange
// };
// var board = ChessBoard('board', cfg);
