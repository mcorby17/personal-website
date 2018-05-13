function ticTacToe() {
  this.board = [[0,0,0],
               [0,0,0],
               [0,0,0]];
  this.turn = 0;
  this.currentPlayer = 1;
}

ticTacToe.prototype = {
  status: function(){
    console.log("The number of turns played is " + this.turn +
    " and it is player " + this.currentPlayer + "'s turn.");
    console.log(this.board[0]);
    console.log(this.board[1]);
    console.log(this.board[2]);
  },
  updateBoard: function(id){
    var player = this.currentPlayer;
    switch(id){
      case "tl":
        this.board[0][0] = player;
        break;
      case "tm":
        this.board[0][1] = player;
        break;
      case "tr":
        this.board[0][2] = player;
        break;
      case "ml":
        this.board[1][0] = player;
        break;
      case "mm":
        this.board[1][1] = player;
        break;
      case "mr":
        this.board[1][2] = player;
        break;
      case "bl":
        this.board[2][0] = player;
        break;
      case "bm":
        this.board[2][1] = player;
        break;
      case "br":
        this.board[2][2] = player;
      }
  },
  getRow: function(id){
    switch(id){
      case "tl":
      case "tm":
      case "tr":
        return 0;
        break;
      case "ml":
      case "mm":
      case "mr":
        return 1;
        break;
      case "bl":
      case "bm":
      case "br":
        return 2;
      }
  },
  getCol: function(id){
    switch(id){
      case "tl":
      case "ml":
      case "bl":
        return 0;
        break;
      case "tm":
      case "mm":
      case "bm":
        return 1;
        break;
      case "tr":
      case "mr":
      case "br":
        return 2;
    }
  },
  upDown: function(player, id, row, col) { //Only works when win happens in bottom row
    var board = this.board;

    if(row == 0 && board[row+1][col] == player && board[row+2][col] == player){
      return true;
    }
    else if(row == 1 && board[row+1][col] == player && board[row-1][col] == player){
      return true;
    }
    else if(row == 2 && board[row-1][col] == player && board[row-2][col] == player){
      return true;
    }
    else {
      return false;
    }
  },
  leftRight: function(player, id, row, col) {
    var board = this.board;

    if(col == 0 && board[row][col+1] == player && board[row][col+2] == player){
      return true;
    }
    else if(col == 1 && board[row][col-1] == player && board[row][col+1] == player){
      return true;
    }
    else if(col == 2 && board[row][col-1] == player && board[row][col-2] == player){
      return true;
    }
    else {
      return false;
    }
  },
  topLeftBottomRight: function(player,id,row,col){
    var board = this.board;

    if(row == 0 && col == 0 && board[1][1] == player && board[2][2] == player){
      return true;
    }
    else if(row == 1 && col == 1 && board[0][0] == player && board[2][2] == player){
      return true;
    }
    else if(row == 2 && col ==2 && board[0][0] == player && board[1][1] == player){
      return true;
    }
    else {
      return false;
    }
  },
  topRightBottomLeft: function(player,id,row,col){
    var board = this.board;

    if(row == 0 && col == 2 && board[1][1] == player && board[2][0]){
      return true;
    }
    else if(row == 1 && col == 1 && board[0][2] == player && board[2][0] == player){
      return true;
    }
    else if(row == 2 && col == 0 && board[1][1] == player && board[0][2] == player){
      return true;
    }
    else {
      return false;
    }
  },
  updateProperties: function(){
    this.turn++;
    if(this.currentPlayer == 1){
      this.currentPlayer = 2;
    }
    else{
      this.currentPlayer = 1;
    }
  },
  win: function(player, id){
    if(this.turn < 5){ // Don't need to check if there's been less than 5 turns
      return false;
    }
    else {
      var row = this.getRow(id),
          col = this.getCol(id);

      if(this.upDown(player, id, row, col)){
        return true;
      }
      else if(this.leftRight(player,id,row,col)){
        return true;
      }
      else if(this.topLeftBottomRight(player,id,row,col)){
        return true;
      }
      else if(this.topRightBottomLeft(player,id,row,col)){
        return true;
      }
      else {
        return false;
      }
    }
  },
  start: function(){
    var spaces = document.getElementsByClassName("space"),
        game = this; // Bind new game variable to the ticTacToe object
    for(var i = 0; i<spaces.length; i++){
      spaces[i].addEventListener('click',function(){
        spaceValue = game.board[game.getRow(this.id)][game.getCol(this.id)];
        if(game.currentPlayer == 1 && spaceValue == 0){
          this.style.backgroundImage = "url('x.png')";
          //Update ticTacToe's turn, player, and board
          game.updateBoard(this.id);
          game.updateProperties();
          //Check to see if a player won
          if(game.win(1,this.id)){
            alert("X WIN");
            // Play again?
          };
          game.status();
        }
        else if(spaceValue == 0){
          this.style.backgroundImage = "url('o.png')";
          //Update ticTacToe's turn, player, and board
          game.updateBoard(this.id);
          game.updateProperties();
          //Check to see if a player won
          if(game.win(2,this.id)){
            alert("O WIN");
            // Play again?71
          };
          game.status();
        }
      })
    }
  }
}

var game = new ticTacToe();

window.onload = function(){
  game.start();
}
