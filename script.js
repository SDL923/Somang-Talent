var express = require('express');
var app = express();
var fs = require('fs');

// set the view engine to ejs
app.set('view engine', 'ejs');



let somang_name;
let somang_year;
let somang_talent;
let emoji_num;
let google_sheet_row_num=-1;
let name_check=0;



//---------- timetable ----------
app.get('/timeschedule_move', function(req, res) {
  fs.readFile('views/timetable.ejs', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);    
  })
});

app.get('/img_timeschedule2', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/timeschedule2.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

//-------------------------------


//---------- market ----------
app.get('/market_move', function(req, res) {
  fs.readFile('views/market.ejs', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);    
  })
});

app.get('/img_cafe', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/cafe.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});
//-------------------------------


//---------- game ----------
app.get('/game_move', function(req, res) {
  fs.readFile('views/game.ejs', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);    
  })
});

//-------------------------------

//---------- emoji1 ----------
app.get('/emoji1_move', function(req, res) { //emoji1.ejs 들어가기
  
  fs.readFile('views/emoji1.ejs', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);    
  })

  //res.render('emoji1', {emoji1_1: " ", emoji1_2: " ", emoji1_3: " "}); (둘이상 응답 둘이상 응답)  
});


app.get('/emoji1_answer', function(req, res){
  let answer1="노아";
  let answer2="베드로";
  let answer3="삼손";

  let input_emoji1_1 = req.query.emoji1_1;
  let input_emoji1_2 = req.query.emoji1_2;
  let input_emoji1_3 = req.query.emoji1_3;
  let input_name = req.query.quiz_name;
  let input_year = req.query.quiz_year;

  
  if(input_emoji1_1==answer1 && input_emoji1_2==answer2 && input_emoji1_3==answer3){

    const haha = async () => { //getSheetData2 함수를 기다리기?(동기) 위해서 비동기 함수 haha를 만들고 getSheetData2 앞에 await을 적었다.
      try {
        await getSheetData2(input_name, input_year, "main")
        //console.log(google_sheet_row_num)
        //console.log(name_check)
        if(name_check==0){
          res.send("<script>alert('❗올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
        }else{

          if(emoji_num==0 || emoji_num==2 || emoji_num==3 || emoji_num==6){
            res.send("<script>alert('🥳 정답입니다!!! 🥳\\n\\n1달란트가 적립됩니다.'); history.back();</script>");
      
            if(emoji_num==0){
              changeSheetData(1,1);
            }else if(emoji_num==2){
              changeSheetData(1,4);
            }else if(emoji_num==3){
              changeSheetData(1,5);
            }else if(emoji_num==6){
              changeSheetData(1,7);
            }

          }else{
            res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
          }
        }

      } catch (error) {
        console.log(error)
      }
    }

    haha();

  }else if(input_emoji1_1!=answer1 && input_emoji1_2==answer2 && input_emoji1_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji1_1==answer1 && input_emoji1_2!=answer2 && input_emoji1_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji1_1==answer1 && input_emoji1_2==answer2 && input_emoji1_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ✅\\n3번: ❌'); history.back();</script>");
  }else if(input_emoji1_1!=answer1 && input_emoji1_2!=answer2 && input_emoji1_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji1_1!=answer1 && input_emoji1_2==answer2 && input_emoji1_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ❌'); history.back();</script>");
  }else if(input_emoji1_1==answer1 && input_emoji1_2!=answer2 && input_emoji1_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ❌'); history.back();</script>");
  }else{
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ❌'); history.back();</script>");
  }

});




  /** 

  if(google_sheet_row_num==-1){
    res.send("<script>alert('❗홈 화면에 올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
  }else{
    if(emoji_num==0 || emoji_num==2 || emoji_num==3 || emoji_num==6){
      if(input_emoji1_1==answer1 && input_emoji1_2==answer2 && input_emoji1_3==answer3){
        res.send("<script>alert('🥳 정답입니다!!! 🥳\\n\\n1달란트가 적립됩니다.'); history.back();</script>");
        if(emoji_num==0){
          changeSheetData(1,1);
        }else if(emoji_num==2){
          changeSheetData(1,4);
        }else if(emoji_num==3){
          changeSheetData(1,5);
        }else if(emoji_num==6){
          changeSheetData(1,7);
        }
        
      }else if(input_emoji1_1!=answer1 && input_emoji1_2==answer2 && input_emoji1_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji1_1==answer1 && input_emoji1_2!=answer2 && input_emoji1_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji1_1==answer1 && input_emoji1_2==answer2 && input_emoji1_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ✅\\n3번: ❌'); history.back();</script>");
      }else if(input_emoji1_1!=answer1 && input_emoji1_2!=answer2 && input_emoji1_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji1_1!=answer1 && input_emoji1_2==answer2 && input_emoji1_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ❌'); history.back();</script>");
      }else if(input_emoji1_1==answer1 && input_emoji1_2!=answer2 && input_emoji1_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ❌'); history.back();</script>");
      }else{
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ❌'); history.back();</script>");
      }
    }else{
      res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
    }
  }
});**/

app.get('/img_emoji1_question', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/emoji1.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

//-------------------------------

//---------- emoji2 ----------
app.get('/emoji2_move', function(req, res) { //emoji1.ejs 들어가기
  
  fs.readFile('views/emoji2.ejs', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);    
  })

  //res.render('emoji1', {emoji1_1: " ", emoji1_2: " ", emoji1_3: " "}); (둘이상 응답 둘이상 응답)  
});



app.get('/emoji2_answer', function(req, res){
  let answer1="아브라함";
  let answer2="다윗";
  let answer3="솔로몬";

  let input_emoji2_1 = req.query.emoji2_1;
  let input_emoji2_2 = req.query.emoji2_2;
  let input_emoji2_3 = req.query.emoji2_3;
  let input_name = req.query.quiz_name;
  let input_year = req.query.quiz_year;

  
  if(input_emoji2_1==answer1 && input_emoji2_2==answer2 && input_emoji2_3==answer3){

    const haha = async () => { //getSheetData2 함수를 기다리기?(동기) 위해서 비동기 함수 haha를 만들고 getSheetData2 앞에 await을 적었다.
      try {
        await getSheetData2(input_name, input_year, "main")
        //console.log(google_sheet_row_num)
        //console.log(name_check)
        if(name_check==0){
          res.send("<script>alert('❗올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
        }else{

          if(emoji_num==0 || emoji_num==1 || emoji_num==3 || emoji_num==5){
            res.send("<script>alert('🥳 정답입니다!!! 🥳\\n\\n3달란트가 적립됩니다.'); history.back();</script>");
      
            if(emoji_num==0){
              changeSheetData(3,2);
            }else if(emoji_num==1){
              changeSheetData(3,4);
            }else if(emoji_num==3){
              changeSheetData(3,6);
            }else if(emoji_num==5){
              changeSheetData(3,7);
            }

          }else{
            res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
          }
        }

      } catch (error) {
        console.log(error)
      }
    }

    haha();


  }else if(input_emoji2_1!=answer1 && input_emoji2_2==answer2 && input_emoji2_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji2_1==answer1 && input_emoji2_2!=answer2 && input_emoji2_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji2_1==answer1 && input_emoji2_2==answer2 && input_emoji2_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ✅\\n3번: ❌'); history.back();</script>");
  }else if(input_emoji2_1!=answer1 && input_emoji2_2!=answer2 && input_emoji2_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji2_1!=answer1 && input_emoji2_2==answer2 && input_emoji2_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ❌'); history.back();</script>");
  }else if(input_emoji2_1==answer1 && input_emoji2_2!=answer2 && input_emoji2_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ❌'); history.back();</script>");
  }else{
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ❌'); history.back();</script>");
  }
});


/** 
app.get('/emoji2_answer', function(req, res){
  let answer1="아브라함";
  let answer2="다윗";
  let answer3="솔로몬";

  let input_emoji2_1 = req.query.emoji2_1;
  let input_emoji2_2 = req.query.emoji2_2;
  let input_emoji2_3 = req.query.emoji2_3;

  if(google_sheet_row_num==-1){
    res.send("<script>alert('❗홈 화면에 올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
  }else{
    if(emoji_num==0 || emoji_num==1 || emoji_num==3 || emoji_num==5){
      if(input_emoji2_1==answer1 && input_emoji2_2==answer2 && input_emoji2_3==answer3){
        res.send("<script>alert('🥳 정답입니다!!! 🥳\\n\\n3달란트가 적립됩니다.'); history.back();</script>");
        if(emoji_num==0){
          changeSheetData(3,2);
        }else if(emoji_num==1){
          changeSheetData(3,4);
        }else if(emoji_num==3){
          changeSheetData(3,6);
        }else if(emoji_num==5){
          changeSheetData(3,7);
        }
        
      }else if(input_emoji2_1!=answer1 && input_emoji2_2==answer2 && input_emoji2_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji2_1==answer1 && input_emoji2_2!=answer2 && input_emoji2_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji2_1==answer1 && input_emoji2_2==answer2 && input_emoji2_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ✅\\n3번: ❌'); history.back();</script>");
      }else if(input_emoji2_1!=answer1 && input_emoji2_2!=answer2 && input_emoji2_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji2_1!=answer1 && input_emoji2_2==answer2 && input_emoji2_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ❌'); history.back();</script>");
      }else if(input_emoji2_1==answer1 && input_emoji2_2!=answer2 && input_emoji2_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ❌'); history.back();</script>");
      }else{
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ❌'); history.back();</script>");
      }
    }else{
      res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
    }
  }
});**/

app.get('/img_emoji2_question', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/emoji2.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

//-------------------------------

//---------- emoji3 ----------
app.get('/emoji3_move', function(req, res) { //emoji3.ejs 들어가기
  
  fs.readFile('views/emoji3.ejs', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);    
  })

  //res.render('emoji1', {emoji1_1: " ", emoji1_2: " ", emoji1_3: " "}); (둘이상 응답 둘이상 응답)  
});




app.get('/img_emoji1_question', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/emoji1.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

//-------------------------------

//---------- emoji2 ----------
app.get('/emoji2_move', function(req, res) { //emoji1.ejs 들어가기
  
  fs.readFile('views/emoji2.ejs', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);    
  })

  //res.render('emoji1', {emoji1_1: " ", emoji1_2: " ", emoji1_3: " "}); (둘이상 응답 둘이상 응답)  
});



app.get('/emoji3_answer', function(req, res){
  let answer1="야엘";
  let answer2="엘리야";
  let answer3="요나";

  let input_emoji3_1 = req.query.emoji3_1;
  let input_emoji3_2 = req.query.emoji3_2;
  let input_emoji3_3 = req.query.emoji3_3;
  let input_name = req.query.quiz_name;
  let input_year = req.query.quiz_year;

  
  if(input_emoji3_1==answer1 && input_emoji3_2==answer2 && input_emoji3_3==answer3){

    const haha = async () => { //getSheetData2 함수를 기다리기?(동기) 위해서 비동기 함수 haha를 만들고 getSheetData2 앞에 await을 적었다.
      try {
        await getSheetData2(input_name, input_year, "main")
        //console.log(google_sheet_row_num)
        //console.log(name_check)
        if(name_check==0){
          res.send("<script>alert('❗올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
        }else{

          if(emoji_num==0 || emoji_num==1 || emoji_num==2 || emoji_num==4){
            res.send("<script>alert('🥳 정답입니다!!! 🥳\\n\\n5달란트가 적립됩니다.'); history.back();</script>");
      
            if(emoji_num==0){
              changeSheetData(5,3);
            }else if(emoji_num==1){
              changeSheetData(5,5);
            }else if(emoji_num==2){
              changeSheetData(5,6);
            }else if(emoji_num==4){
              changeSheetData(5,7);
            }

          }else{
            res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
          }
        }

      } catch (error) {
        console.log(error)
      }
    }

    haha();

  }else if(input_emoji3_1!=answer1 && input_emoji3_2==answer2 && input_emoji3_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji3_1==answer1 && input_emoji3_2!=answer2 && input_emoji3_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji3_1==answer1 && input_emoji3_2==answer2 && input_emoji3_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ✅\\n3번: ❌'); history.back();</script>");
  }else if(input_emoji3_1!=answer1 && input_emoji3_2!=answer2 && input_emoji3_3==answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ✅'); history.back();</script>");
  }else if(input_emoji3_1!=answer1 && input_emoji3_2==answer2 && input_emoji3_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ❌'); history.back();</script>");
  }else if(input_emoji3_1==answer1 && input_emoji3_2!=answer2 && input_emoji3_3!=answer3){
    res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ❌'); history.back();</script>");
  }else{
    res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ❌'); history.back();</script>");
  }

});

/** 
app.get('/emoji3_answer', function(req, res){
  let answer1="야엘";
  let answer2="엘리야";
  let answer3="요나";

  let input_emoji3_1 = req.query.emoji3_1;
  let input_emoji3_2 = req.query.emoji3_2;
  let input_emoji3_3 = req.query.emoji3_3;

  if(google_sheet_row_num==-1){
    res.send("<script>alert('❗홈 화면에 올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
  }else{
    if(emoji_num==0 || emoji_num==1 || emoji_num==2 || emoji_num==4){
      if(input_emoji3_1==answer1 && input_emoji3_2==answer2 && input_emoji3_3==answer3){
        res.send("<script>alert('🥳 정답입니다!!! 🥳\\n\\n5달란트가 적립됩니다.'); history.back();</script>");
        if(emoji_num==0){
          changeSheetData(5,3);
        }else if(emoji_num==1){
          changeSheetData(5,5);
        }else if(emoji_num==2){
          changeSheetData(5,6);
        }else if(emoji_num==4){
          changeSheetData(5,7);
        }
        
      }else if(input_emoji3_1!=answer1 && input_emoji3_2==answer2 && input_emoji3_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji3_1==answer1 && input_emoji3_2!=answer2 && input_emoji3_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji3_1==answer1 && input_emoji3_2==answer2 && input_emoji3_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ✅\\n3번: ❌'); history.back();</script>");
      }else if(input_emoji3_1!=answer1 && input_emoji3_2!=answer2 && input_emoji3_3==answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ✅'); history.back();</script>");
      }else if(input_emoji3_1!=answer1 && input_emoji3_2==answer2 && input_emoji3_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ✅\\n3번: ❌'); history.back();</script>");
      }else if(input_emoji3_1==answer1 && input_emoji3_2!=answer2 && input_emoji3_3!=answer3){
        res.send("<script>alert('[제출 결과]\\n\\n1번: ✅\\n2번: ❌\\n3번: ❌'); history.back();</script>");
      }else{
        res.send("<script>alert('[제출 결과]\\n\\n1번: ❌\\n2번: ❌\\n3번: ❌'); history.back();</script>");
      }
    }else{
      res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
    }
  }
});**/

app.get('/img_emoji3_question', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/emoji3.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

//-------------------------------


app.get('/img_back', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/back.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});


//---------- index(home) ----------
app.get('/img_coin', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/coin.webp', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

app.get('/img_poom', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/poom.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

app.get('/img_timeschedule', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/timeschedule.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});

app.get('/img_bible', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/bible.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});


app.get('/img_wakeup', function(req, res) { // wakeup 사진 보내기
  fs.readFile('./image/wakeup1.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});


app.get('/img_market', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/market.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});
app.get('/img_game', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/game.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});
app.get('/img_how', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/how.png', function(err,data){
    res.writeHead(200, {'Context-Type':'text/html'});
    res.end(data);
  })
});



app.get('/', function(req, res) {
  res.render('index', {num: "?", name: "나"}); //초기 달란트 개수 ?
});

//-------------------------------


/** 
const axios = require('axios');
const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ"

let somang_name;
let somang_year;
let somang_talent;
let emoji_num;
let google_sheet_row_num=-1;
let name_check=0;
**/

app.get('/name', function(req, res){
  const axios = require('axios');
  const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ"

  somang_name = req.query.fname;
  somang_year = req.query.fyear;

  const getSheetData = async (sheetName) => {
   
    try {
      const { data } = await axios({
        method: 'get',
        url: `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?sheet=${sheetName}`,
      })
  
      const { cols, rows } = refindSheetsData(data)
      
      let check=0;
      let rowCount=2; //2행부터 시작
  
      rows.forEach((row) => {
          if(row.c[0].v == somang_name && row.c[1].v == somang_year){
            res.render('index', {num: row.c[2].v, name: '"'+somang_year+" "+somang_name+'"'});
            somang_talent=row.c[2].v
            emoji_num=row.c[3].v
            google_sheet_row_num=rowCount
            check=1
          }
          rowCount++;
      })
      //console.log(google_sheet_row_num)
      if(check==0){ //없는 이름
        res.send("<script>alert('No Information Found.'); history.back();</script>");
      }
  
    } catch (error) {
      console.log(error)
    }
  }

  getSheetData('main')
});





const getSheetData2 = async (somang_name, somang_year, sheetName) => {
  const axios = require('axios');
  const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ"
   
  try {
    const { data } = await axios({
      method: 'get',
      url: `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?sheet=${sheetName}`,
    })

    const { cols, rows } = refindSheetsData(data)
    
    let check=0;
    let rowCount=2; //2행부터 시작

    rows.forEach((row) => {
        if(row.c[0].v == somang_name && row.c[1].v == somang_year){
          somang_talent=row.c[2].v //단란트 개수 조회
          emoji_num=row.c[3].v //이모지 숫자 조회(상중하 뭐 풀었는지)
          google_sheet_row_num=rowCount //스프레드시트에서 몇번째 줄에 있는지 
          check=1
        }
        rowCount++;
    })
    //console.log(google_sheet_row_num)
    if(check==0){ //없는 이름
      //res.send("<script>alert('No Information Found.'); history.back();</script>");
      name_check=0; //이름 죄회했는데 없음
    }else{
      name_check=1;
    }

  } catch (error) {
    console.log(error)
  }
}




const refindSheetsData = (string) => {
  const firstSplit = string.split('google.visualization.Query.setResponse(')[1]

  const jsonData = JSON.parse(firstSplit.slice(0, firstSplit.length - 2))

  return jsonData.table
}





async function changeSheetData(add_talent, emoji_num) { //구글스프레드시트 에서 정보를 가져올때는 다른 방법 (axios)를 사용했다. 여기 사용한 방법으로 정보를 가져오면 더 깔끔하게 될 듯
  const { google } = require('googleapis');
  const sheets = google.sheets('v4');
  const SPREADSHEET_ID = '11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ';
  const SERVICE_ACCOUNT_KEY = require('./somang-talent-ed6b9740a487.json');

  try {
    // Authorize the client using the service account credentials
    const authClient = new google.auth.JWT(
      SERVICE_ACCOUNT_KEY.client_email,
      null,
      SERVICE_ACCOUNT_KEY.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Connect to the Google Sheets API
    const sheetsInstance = google.sheets({ version: 'v4', auth: authClient });

    // Example: Edit cell A1 with the new value 'Hello, World!'
    await sheetsInstance.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'main!'+'C'+google_sheet_row_num+':'+'D'+google_sheet_row_num, // Specify the cell you want to update (e.g., 'Sheet1' is the sheet name, and 'A1' is the cell).
      valueInputOption: 'RAW',
      resource: {
        values: [[somang_talent+add_talent, emoji_num]], // The new value you want to set in the cell.
      },
    });

    //console.log('Cell A1 has been updated successfully.');
  } catch (err) {
    console.error('Error updating cell:', err);
  }
}







app.listen(8080);
console.log('Server is listening on port 8080');






