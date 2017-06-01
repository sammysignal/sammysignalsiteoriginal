
var board,
game = new Chess();

var pieces = ['P', 'N', 'B', 'R', 'Q']
var piecesB = ['p', 'n', 'b', 'r', 'q']

var values = {'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9}

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function(source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true ||
    piece.search(/^b/) !== -1) {
    return false;
  }
};

var makeAPIMove = function() {
  var possibleMoves = game.moves();
  console.log(game.fen())

  // game over
  if (possibleMoves.length === 0) return;
  $.post(
    //"http://sammysignal.pythonanywhere.com/chess/",
    "http://localhost:5000/chess/",
    {
      "fen": game.fen(),
      "possibleMoves": possibleMoves.toString()
    },
    // {'data': [game.fen(), possibleMoves]},
    function(data,status,xhr){
      game.move(data);
      board.position(game.fen());
      console.log(game.fen())
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

var makeRandomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
}

var countPieces = function(fen, turn) {
  var p;
  if (turn == 'b') {
    p = pieces;
  } else {
    p = piecesB;
  }
  var counter = 0
  for (var i = 0; i < p.length; i++) {
    for (var j = 0; j < fen.length; j++) {
      if (fen[j] == p[i]) { 
        counter += values[p[i].toUpperCase()];
      }
    }
  }
  return (counter / (8+10+6+6+9));
}

var heuristic = function() {
  var possibleMoves = game.moves();
  var fen = game.fen().split(' ');
  // fen string
  var f = fen[0];
  // whose turn, either 'b' or 'w;
  var turn = fen[1];
  // any subset of KQkq, representing black or white castling king or queen side.
  // White is uppercase.
  var canCastle = fen[2];
  // en passant square, if opportunity exists.
  var ep = fen[3];
  // counts half moves to check for three-move repetition (resulting in tie)
  var plies = fen[4];
  var moveCounter = fen[5];

  return countPieces(f, turn);
}

var makeIntelligentMove = function(depth) {
  if (depth <= 0) {
    makeRandomMove();
    return;
  }
  var possibleMoves = game.moves();
  var fen = game.fen().split(' ');
  // fen string
  var f = fen[0];
  // whose turn, either 'b' or 'w;
  var turn = fen[1];

  var bestHeuristic = 0;
  var bestMove;
  for (var m=0; m < possibleMoves.length; m++) {
    // make hypothetical move
    game.move(possibleMoves[m]);
    // let other player make move
    makeIntelligentMove(depth-1);
    // see the value of this state
    var testH = heuristic();
    if (testH > bestHeuristic) {
      console.log(testH);
      bestHeuristic = testH;
      bestMove = possibleMoves[m];
    }
    game.undo();
    game.undo();
  }

  // Make the move!
  game.move(bestMove);
  board.position(game.fen());
}

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
  window.setTimeout(function(){
    //makeRandomMove();
    makeIntelligentMove(2);
  }, 250);
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
