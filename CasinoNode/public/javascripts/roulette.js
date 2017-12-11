exports.test = function(req, res){var a = {};a.hola = 5;res.json(a);};

var table = {};
table['00'] = {color:'b', half:1,parity:1,row:-1,dozen:-1};
table['0'] = {color:'r', half:0,parity:0,row:-1,dozen:-1};

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


var currentGame={};
currentGame.minBet = -1;
currentGame.money=0;
currentGame.casinoName="test";

//---------------------------- statistics
currentGame.numZero=0;
currentGame.numZeroZero=0;
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

//----------------------------


exports.addNumberToCurrentGame = function(req, res){
  var auth = req.params.auth;
  if(auth === 'auth'){
    var user = req.params.user;
    var newNumber = req.params.newNumber;

    var data = {};
    data.user = user;
    data.newNumber = newNumber;
    res.json(data);
  }
  else{
    var unauthorized = {unauthorized:true};
    res.json(table);
  }

};
