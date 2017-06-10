
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

var charCount = function(str, c) {
  var count = 0;
  for (var i = 0 ; i < str.length; i++) {
    if (str[i] == c) {
      count ++;
    }
  }
  return count;
}

var isWhite = function(b_o_w) {
  if (b_o_w == 'w') { 
    return true;
  }
  return false;
}

var otherTurn = function(t) {
  if (t == 'b') {
    return 'w';
  }
  return 'b'
}

var makeRandomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
}

var centerControl = function(fen, turn) {
  var p;
  // if (isWhite(turn)) {
  //   p = pieces;
  // } else {
  //   p = piecesB
  // }
  var parts = fen.split(' ')[0].split("/");
  var total = 0;
  for (var i = 0 ; i < 8; i++) {
    for (var k = 0 ; k < pieces.length ; k++) {
      //console.log(values[pieces[k]]);
      if (isWhite(turn)) {
        total = total + (i-3.5)*( values[pieces[k]]*charCount(parts[i], pieces[k]) )
      } else {
        total = total - (i-3.5)*( values[pieces[k]]*charCount(parts[i], piecesB[k]) )
      }
      
    }
    // total = total + charCount(parts[i], 'P');
    // total = total + charCount(parts[i], 'N');
    // total = total + charCount(parts[i], 'B');
    // total = total + charCount(parts[i], 'R');
    // total = total + charCount(parts[i], 'Q');
  }
  return total;
}

var countPieces = function(fen, turn) {
  var sum_b = 0;
  var sum_w = 0;
  for (var j = 0; j < fen.length; j++) {
    // if lowercase
    if ("A" <= fen[j] && fen[j] <= "Z" && fen[j] != "K") {
      sum_w = sum_w + values[fen[j]]
    }
    if ("a" <= fen[j] && fen[j] <= "z" && fen[j] != "k") {
      sum_b = sum_b + values[fen[j].toUpperCase()]
    }
  }
  if (turn == 'w') {
    return sum_w;
  } else {
    return sum_b;
  }
  return -1;
  // var p;
  // if (turn == 'b') {
  //   p = pieces;
  // } else {
  //   p = piecesB;
  // }
  // var counter = 0
  // for (var i = 0; i < p.length; i++) {
  //   for (var j = 0; j < fen.length; j++) {
  //     if (fen[j] == p[i]) { 
  //       counter += values[p[i].toUpperCase()];
  //     }
  //   }
  // }
  // return (counter / (39));
}

// if still early in game, castled is good.
// if 
var heuristic = function(t="b") {
  var possibleMoves = game.moves();
  var fen = game.fen().split(' ');
  // fen string
  var f = fen[0];
  // whose turn, either 'b' or 'w;
  var turn = fen[1];
  if (t == 'b' || t == 'w') {
    turn = t;
  }
  // any subset of KQkq, representing black or white castling king or queen side.
  // White is uppercase.
  var canCastle = fen[2];
  // en passant square, if opportunity exists.
  var ep = fen[3];
  // counts half moves to check for three-move repetition (resulting in tie)
  var plies = fen[4];
  var moveCounter = fen[5];


  return (countPieces(f, turn) - countPieces(f, otherTurn(turn))) + 
         (0.01)*(centerControl(f, turn));
}

var makeIntelligentMove = function() {
  var possibleMoves = game.moves();
  console.log(possibleMoves);
  var fen = game.fen().split(' ');
  // fen string
  var f = fen[0];
  // whose turn, either 'b' or 'w;
  var turn = fen[1];

  var bestHeuristic = 10000;
  var bestMove, testH;
  for (var m=0; m < possibleMoves.length; m++) {
    // make hypothetical move
    console.log(game.turn());
    console.log(game.fen());
    game.move(possibleMoves[m]);
    console.log(game.turn());
    console.log(game.fen());
    var possibleMovesOther = game.moves();
    console.log(possibleMovesOther);
    var bestHeuristicOpp = -10000;
    var bestOppMove, testHOpp;
    for (var n=0; n < possibleMovesOther.length; n++) {
      console.log("trying " + possibleMovesOther[n]);
      game.move(possibleMovesOther[n]);
      // see the value of this state
      testHopp = heuristic(otherTurn(turn));
      if (testHopp > bestHeuristicOpp) {
        console.log(testHopp);
        bestHeuristicOpp = testHopp;
        bestOppMove = possibleMovesOther[n];
      }
      console.log(game.fen());
      var u = game.undo();
      console.log(game.fen());
      console.log(u);
    }
    if (bestHeuristicOpp < bestHeuristic) {
      bestHeuristic = bestHeuristicOpp;
      bestMove = possibleMoves[m]
    }
    var u2 = game.undo();
    console.log(u2);
  }
  console.log(bestMove);
  // Make the move!
  game.move(bestMove);
  console.log(game.board())
}

var mover = function() {

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
    makeIntelligentMove();
    board.position(game.fen());
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

// $(document).ready(function(){
//   console.log("loaded!");
//   while (!game.game_over()) {
//     window.setTimeout(function(){
//       //makeRandomMove();
//       makeIntelligentMove();
//       board.position(game.fen());
//     }, 250);
//   }
// });

console.log("vars");
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
