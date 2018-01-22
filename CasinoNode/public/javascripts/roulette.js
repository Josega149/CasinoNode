exports.test = function(req, res){var a = {};a.hola = 5;res.json(a);};

var table = {};
table['00'] = {color:'none', half:-1,parity:-1,row:-1,dozen:-1};
table['0'] = {color:'none', half:-1,parity:-1,row:-1,dozen:-1};

table['1'] = {color:'r'};table['2']={color:'b'};table['3'] = {color:'r'};
table['4'] = {color:'b'};table['5'] = {color:'r'};table['6'] = {color:'b'};
table['7'] = {color:'r'};table['8'] = {color:'b'};table['9'] = {color:'r'};
table['10'] = {color:'b'};table['11'] = {color:'b'};table['12'] = {color:'r'};

table['13'] = {color:'b'};table['14'] = {color:'r'};table['15'] = {color:'b'};
table['16'] = {color:'r'};table['17'] = {color:'b'};table['18'] = {color:'r'};
table['19'] = {color:'r'};table['20'] = {color:'b'};table['21'] = {color:'r'};
table['22'] = {color:'b'};table['23'] = {color:'r'};table['24'] = {color:'b'};

table['25'] = {color:'r'};table['26'] = {color:'b'};table['27'] = {color:'r'};
table['28'] = {color:'b'};table['29'] = {color:'b'};table['30'] = {color:'r'};
table['31'] = {color:'b'};table['32'] = {color:'r'};table['33'] = {color:'b'};
table['34'] = {color:'r'};table['35'] = {color:'b'};table['36'] = {color:'r'};

for(var i=1;i<=36 ;i++){
  table[i+""].half = ((i<=18)? 0:1);
  table[i+""].parity = ((i%2==0)? 0:1);
  var row =Math.floor(i%3);
  table[i+""].row = (row ==0)? 3 : row;
  if(i<=12){
    table[i+""].dozen = 1;
  } else if(i<=24){
    table[i+""].dozen = 2;
  } else{
    table[i+""].dozen = 3;
  }
}

var currentGame = restart();


//----------------------------
exports.restart = function(req, res){
  var auth = req.params.auth;
  if(auth === 'auth'){
    var user = req.params.user;
    currentGame = restart();
    res.json(currentGame);
  }
  else{
    var unauthorized = {unauthorized:'invalid auth token'};
    res.json(unauthorized);
  }

};

exports.addNumberToCurrentGame = function(req, res){
  var auth = req.params.auth;
  if(auth === 'auth'){
    var user = req.params.user;
    var newNumber = req.params.newNumber;
    var betToAll = req.params.betToAll;
    var data = {};
    data.user = user;
    data.newNumber = newNumber;
    var number = parseInt(newNumber);
    if(number>36 || number<0){
      var unauthorized = {unauthorized:'numberOutOfBounds'};
      res.json(unauthorized);
    }
    else{
      currentGame = addNumberToCurrentGame(currentGame, newNumber);
      res.json(currentGame);
    }
  }
  else{
    var unauthorized = {unauthorized:'invalid auth token'};
    res.json(unauthorized);
  }

};


function addNumberToCurrentGame ( currentGame,  newNumber, bet){

//----------------------------- update statistics
  currentGame = updateStatistics(currentGame, newNumber);
//----------------------------- update bets
  currentGame = calculateBets(currentGame,newNumber,bet);



  return currentGame;
}
function calculateBets(currentGame,newNumber, bet){
  var field = table[newNumber];
  var colorC = field.color;
  var halfC = field.half;
  var parityC = field.parity;
  var rowC = field.row;
  var dozenC = field.dozen;

  var size = currentGame.history.length-1;
  //Here we can modify the NUMBER OF DATA IN HISTORY BEFORE START BETING
  if(size < 10){
    return currentGame;
  }

  var field = table[currentGame.history[size-1]];
  var colorP = field.color;
  var halfP = field.half;
  var parityP = field.parity;
  var rowP = field.row;
  var dozenP = field.dozen;///** no esta bien, revisar C o P -1
//Color
  if(colorP === colorC || colorP === 'none'){//double the bet
  currentGame.money -= (currentGame.betRed + currentGame.betBlack);
    currentGame.betRed*= 2;
    currentGame.betBlack *=2;
    if(currentGame.betRed ===0 && currentGame.betBlack===0 ){
      if(colorC === 'b'){
        currentGame.betRed = currentGame.minBetDouble;
      }
      else{
        currentGame.betBlack = currentGame.minBetDouble;
      }
    }
  }
  else{
    //If the user bet, the money increments the amount of the bet
    currentGame.money += currentGame.betRed + currentGame.betBlack;
    currentGame.betRed = 0;
    currentGame.betBlack =0;
  }
//half
  if(halfP === halfC || halfC === -1){//double the bet
    currentGame.money -= (currentGame.bet1to18 + currentGame.bet19to36);
    currentGame.bet1to18*= 2;
    currentGame.bet19to36 *=2;
    if(currentGame.bet1to18 ===0 && currentGame.bet19to36===0 ){
      if(halfP > 18){
        currentGame.bet1to18 = currentGame.minBetDouble;
      }
      else{
        currentGame.bet19to36 = currentGame.minBetDouble;
      }
    }
  }
  else{
    //If the user bet, the money increments the amount of the bet
    currentGame.money += currentGame.bet1to18 + currentGame.bet19to36;
    currentGame.bet1to18=0;
    currentGame.bet19to36=0;
  }

//parity
  if(parityP === parityC || parityC ===-1){//double the bet
    currentGame.money -= (currentGame.betOdd + currentGame.betEven);
    currentGame.betOdd*= 2;
    currentGame.betEven *=2;
    if(currentGame.betOdd ===0 && currentGame.betEven===0 ){
      if(parityP %2 === 0 ){
        currentGame.betOdd = currentGame.minBetDouble;
      }
      else{
        currentGame.betEven = currentGame.minBetDouble;
      }
    }
  }
  else{
    //If the user bet, the money increments the amount of the bet
    currentGame.money += currentGame.betOdd + currentGame.betEven;
    currentGame.betOdd=0; //impar
    currentGame.betEven=0;
  }

///**
//row
if(rowP === rowC || rowC === -1){//triple the bet
  currentGame.money -= (currentGame.betRow1 + currentGame.betRow2 + currentGame.betRow3);
  currentGame.betRow1*= 3;
  currentGame.betRow2*= 3;
  currentGame.betRow3*= 3;
  if(currentGame.betRow1===0 && currentGame.betRow2===0 && currentGame.betRow3===0 ){
    if(dozenP === 1 ){
      currentGame.betRow2=currentGame.minBetTriple;
      currentGame.betRow3=currentGame.minBetTriple;
    }
    else if(dozenP === 2 ){
      currentGame.betRow1=currentGame.minBetTriple;
      currentGame.betRow3=currentGame.minBetTriple;
    }
    else{//(dozenP === 3 ){
      currentGame.betRow1=currentGame.minBetTriple;
      currentGame.betRow2=currentGame.minBetTriple;
    }
  }
}
else{
  //If the user bet, the money increments the amount of the bet
  currentGame.money -= (currentGame.betRow1 + currentGame.betRow2 + currentGame.betRow3);
  currentGame.money += (Math.max(currentGame.betRow1 , currentGame.betRow2 , currentGame.betRow3)*3);
  currentGame.betRow1=0;currentGame.betRow2=0;currentGame.betRow3=0;
}

//dozen
  if(dozenP === dozenC || dozenC === -1){//triple the bet
    currentGame.money -= (currentGame.betDozen1 + currentGame.betDozen2 + currentGame.betDozen3);
    currentGame.betDozen1*= 3;
    currentGame.betDozen2*= 3;
    currentGame.betDozen3*= 3;
    if(currentGame.betDozen1===0 && currentGame.betDozen2===0 && currentGame.betDozen3===0 ){
      if(dozenP === 1 ){
        currentGame.betDozen2=currentGame.minBetTriple;
        currentGame.betDozen3=currentGame.minBetTriple;
      }
      else if(dozenP === 2 ){
        currentGame.betDozen1=currentGame.minBetTriple;
        currentGame.betDozen3=currentGame.minBetTriple;
      }
      else{//(dozenP === 3 ){
        currentGame.betDozen1=currentGame.minBetTriple;
        currentGame.betDozen2=currentGame.minBetTriple;
      }
    }
  }
  else{
    //If the user bet, the money increments the amount of the bet
    currentGame.money -= (currentGame.betDozen1 + currentGame.betDozen2 + currentGame.betDozen3);
    currentGame.money += (Math.max(currentGame.betDozen1 , currentGame.betDozen2 , currentGame.betDozen3)*3);
    currentGame.betDozen1=0;currentGame.betDozen2=0;currentGame.betDozen3=0;
  }*/



  //propose bet to numbers:

  //
  if(currentGame.minLosses > currentGame.money){
    currentGame.minLosses = currentGame.money;
  }
  return currentGame;
}

function updateStatistics(currentGame, newNumber){
  var field = table[newNumber];
  var color = field.color;
  var half = field.half;
  var parity = field.parity;
  var row = field.row;
  var dozen = field.dozen;

  currentGame.numRed += (color === 'r')?1:0;
  currentGame.numBlack += (color === 'b')?1:0;
  currentGame.num1to18+= (half === 0)?1:0;
  currentGame.num19to36+= (half === 1)?1:0;
  currentGame.numOdd+= (parity === 1)?1:0;
  currentGame.numEven+= (parity === 0)?1:0;
  currentGame.numRow1+= (row === 1)?1:0;
  currentGame.numRow2+=(row === 2)?1:0;
  currentGame.numRow3+=(row === 3)?1:0;
  currentGame.numDozen1+=(dozen === 1)?1:0;
  currentGame.numDozen2+=(dozen === 2)?1:0;
  currentGame.numDozen3+=(dozen === 3)?1:0;
  currentGame.history.push(newNumber);
  return currentGame;
}

function restart(){
  var currentGame={};
  currentGame.casinoName="test";
  currentGame.minBetDouble = 1000;
  currentGame.minBetTriple = 500;
  currentGame.minBetEach = 100;
  currentGame.money=0;


  //---------------------------- statistics

  //TODO ADD more statistics as max bet, numero de 0s, de negras, %acierto
  //color
  //zerozero = black
  //zero = red
  currentGame.numRed=0;
  currentGame.numBlack=0;
  //firstHalf  0 firstHalf 1 secondHalf
  //zerozero = 1
  //zero = 0
  currentGame.num1to18=0;
  currentGame.num19to36=0;
  //parity   1 impar  0 par
  //zerozero = 1
  //zero = 0
  currentGame.numOdd=0; //impar
  currentGame.numEven=0;

  currentGame.numRow1=0;
  currentGame.numRow2=0;
  currentGame.numRow3=0;

  currentGame.numDozen1=0;
  currentGame.numDozen2=0;
  currentGame.numDozen3=0;

  //---------------------------- bets
  currentGame.betRed=0;
  currentGame.betBlack=0;

  currentGame.bet1to18=0;
  currentGame.bet19to36=0;

  currentGame.betOdd=0; //impar
  currentGame.betEven=0;

  currentGame.betRow1=0;
  currentGame.betRow2=0;
  currentGame.betRow3=0;

  currentGame.betDozen1=0;
  currentGame.betDozen2=0;
  currentGame.betDozen3=0;

  currentGame.minLosses=0;


  currentGame.history=[];

  return currentGame;
}
