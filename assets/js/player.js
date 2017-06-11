
var board,
game = new Chess();

var pieces = ['P', 'N', 'B', 'R', 'Q']
var piecesB = ['p', 'n', 'b', 'r', 'q']

var values = {'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9}

var greys = true;





//////////
////////////
//////////



var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnEvalWhite =
    [
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
        [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
        [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
        [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
        [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
        [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
        [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
        [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
        [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
        [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
        [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen =
    [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);




var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


/* board visualization and games state handling */

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    // renderMoveHistory(game.history());
};


var positionCount;
var getBestMove = function (game) {
    positionCount = 0;
    //var depth = parseInt($('#search-depth').find(':selected').text());
    var depth = 3;
    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    // $('#position-count').text(positionCount);
    // $('#time').text(moveTime/1000 + 's');
    // $('#positions-per-s').text(positionsPerS);
    console.log("position count: " + positionCount);
    console.log("time: " + moveTime/1000 + 's');
    console.log("positions per sec: " + positionsPerS);
    return bestMove;
};

// var renderMoveHistory = function (moves) {
//     var historyElement = $('#move-history').empty();
//     historyElement.empty();
//     for (var i = 0; i < moves.length; i = i + 2) {
//         historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
//     }
//     historyElement.scrollTop(historyElement[0].scrollHeight);

// };

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    // renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};



/////////
/////////
/////////
/////////
/////////




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
  var considerations = 0;
  for (var m=0; m < possibleMoves.length; m++) {
    // make hypothetical move
    // console.log(game.turn());
    // console.log(game.fen());
    game.move(possibleMoves[m]);
    // console.log(game.turn());
    // console.log(game.fen());
    var possibleMovesOther = game.moves();
    // console.log(possibleMovesOther);
    var bestHeuristicOpp = -10000;
    var bestOppMove, testHOpp;
    for (var n=0; n < possibleMovesOther.length; n++) {
      // console.log("trying " + possibleMovesOther[n]);
      game.move(possibleMovesOther[n]);
      // see the value of this state
      testHopp = heuristic(otherTurn(turn));
      if (testHopp > bestHeuristicOpp) {
        // console.log(testHopp);
        bestHeuristicOpp = testHopp;
        bestOppMove = possibleMovesOther[n];
      }
      // console.log(game.fen());
      var u = game.undo();
      // console.log(game.fen());
      // console.log(u);
      considerations++;
    }
    if (bestHeuristicOpp < bestHeuristic) {
      bestHeuristic = bestHeuristicOpp;
      bestMove = possibleMoves[m]
    }
    var u2 = game.undo();
    // console.log(u2);
  }
  //console.log(bestMove);
  // Make the move!
  game.move(bestMove);
  //console.log(game.board());
  console.log(considerations);
}

var mover = function() {

}

var restart = function() {
  game = new Chess();
  board.position(game.fen());
  document.getElementById("win").style.display = "none";
  document.getElementById("lose").style.display = "none";
  document.getElementById("draw").style.display = "none";
}

var checkGameOver = function() {
  if (game.in_checkmate()) {
    var turn = game.fen().split(' ')[1];
    if (turn == 'b') {
      document.getElementById("win").style.display = "block";
    }
    else {
      document.getElementById("lose").style.display = "block";
    }
  }
  if (game.in_stalemate() || game.in_draw()) {
    document.getElementById("draw").style.display = "block";
  }
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


  removeGreySquares();
  // make random legal move for black
  window.setTimeout(function(){
    //makeRandomMove();
    checkGameOver();
    //makeIntelligentMove();
    makeBestMove();
    board.position(game.fen());
    checkGameOver();
  }, 250);
};


// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};


var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};


var cfg = {
  // orientation: 'black',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare
};
board = ChessBoard('board', cfg);


var toggle = function() {
  if (greys) {
    cfg = {
      // orientation: 'black',
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);
    board.position(game.fen());
    greys = false;
  }
  else {
    cfg = {
      // orientation: 'black',
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare
    };
    board = ChessBoard('board', cfg);
    board.position(game.fen());
    greys = true;
  }
}
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

var undo = function() {
  if (game.turn() == 'w') {
    game.undo();
    game.undo();
    board.position(game.fen());
  }
  document.getElementById("win").style.display = "none";
  document.getElementById("lose").style.display = "none";
  document.getElementById("draw").style.display = "none";
}

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
