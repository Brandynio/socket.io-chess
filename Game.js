function Game(params) {
  this.ready        = false;
  this.stalemate    = false;
  this.winner       = null;
  this.activePlayer = 'white';

  this.player1 = {color: null, name: null, inCheck: false, checkmated: false, joined: false},
  this.player2 = {color: null, name: null, inCheck: false, checkmated: false, joined: false},

  this.board = {
    a8: 'bR_', b8: 'bN_', c8: 'bB_', d8: 'bQ_', e8: 'bK_', f8: 'bB_', g8: 'bN_', h8: 'bR_',
    a7: 'bP_', b7: 'bP_', c7: 'bP_', d7: 'bP_', e7: 'bP_', f7: 'bP_', g7: 'bP_', h7: 'bP_',
    a6: null,  b6: null,  c6: null,  d6: null,  e6: null,  f6: null,  g6: null,  h6: null,
    a5: null,  b5: null,  c5: null,  d5: null,  e5: null,  f5: null,  g5: null,  h5: null,
    a4: null,  b4: null,  c4: null,  d4: null,  e4: null,  f4: null,  g4: null,  h4: null,
    a3: null,  b3: null,  c3: null,  d3: null,  e3: null,  f3: null,  g3: null,  h3: null,
    a2: 'wP_', b2: 'wP_', c2: 'wP_', d2: 'wP_', e2: 'wP_', f2: 'wP_', g2: 'wP_', h2: 'wP_',
    a1: 'wR_', b1: 'wN_', c1: 'wB_', d1: 'wQ_', e1: 'wK_', f1: 'wB_', g1: 'wN_', h1: 'wR_'
  };

  this.capturedPieces = [];

  // params currently only contains startedBy but in the future could hold
  // options such as enforce50MovesRule or timedGame, etc.

  if (params.startedBy === 'white') {
    this.player1.color = 'white';
    this.player2.color = 'black';
  }

  if (params.startedBy === 'black') {
    this.player1.color = 'black';
    this.player2.color = 'white';
  }
};

Game.prototype.addPlayer = function(playerData, callback) {

  // Check for open spots
  if (playerData.playerColor === this.player1.color && this.player1.joined) {
    return callback(true);
  }
  if (playerData.playerColor === this.player2.color && this.player2.joined) {
    return callback(true);
  }

  // Add player 1
  if (playerData.playerColor === this.player1.color) {
    this.player1.name   = playerData.playerName;
    this.player1.joined = true;
  }

  // Add player 2
  if (playerData.playerColor === this.player2.color) {
    this.player2.name   = playerData.playerName;
    this.player2.joined = true;
  }

  // Activate game when last player is added
  if (!this.ready && this.player1.joined && this.player2.joined) {
    this.ready = true;
  }

  callback(null, true);
};

Game.prototype.removePlayer = function(playerData, callback) {
  if (this.player1.color === playerData.playerColor) {
    this.player1.joined = false;
    return callback(null, true);
  }

  if (this.player2.color === playerData.playerColor) {
    this.player2.joined = false;
    return callback(null, true);
  }

  callback();
};

Game.prototype.move = function(moveString, callback) {
  var src  = moveString[2] + moveString[3];
  var dest = moveString[5] + moveString[6];

  // Remove the "not moved" identifier (_) if present
  if (this.board[src][this.board[src].length-1] === '_') {
    this.board[src] = this.board[src].slice(0, -1);
  }

  this.board[dest] = this.board[src];
  this.board[src] = null;

  // set active player
  if (moveString[0] === 'w') { this.activePlayer = 'black'; }
  if (moveString[0] === 'b') { this.activePlayer = 'white'; }

  callback(null, true);
};


module.exports = Game;