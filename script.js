var express = require('express');
var app = express();
var fs = require('fs');

// set the view engine to ejs
app.set('view engine', 'ejs');

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
  let input_emoji1_1 = req.query.emoji1_1;
  let input_emoji1_2 = req.query.emoji1_2;
  let input_emoji1_3 = req.query.emoji1_3;

  if(input_emoji1_1=="aa" && input_emoji1_2=="aa" && input_emoji1_3=="aa"){
    res.send("<script>alert('🥳 정답입니다!!! 🥳\\n\\n5달란트가 적립됩니다.'); history.back();</script>");
    //res.send("<script>swal('로그인 성공!', 'Aaa', 'success'); history.back();</script>");
  }

  changeSheetData();

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



const axios = require('axios');
const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ"

let somang_name;
let somang_year;
let somang_talent;
let emoji_num;
let google_sheet_row_num=-1;
app.get('/name', function(req, res){
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
      console.log(google_sheet_row_num)
      if(check==0){ //없는 이름
        res.send("<script>alert('No Information Found.'); history.back();</script>");
      }
  
    } catch (error) {
      console.log(error)
    }
  }

  getSheetData('main')
});

const refindSheetsData = (string) => {
    const firstSplit = string.split('google.visualization.Query.setResponse(')[1]
  
    const jsonData = JSON.parse(firstSplit.slice(0, firstSplit.length - 2))
  
    return jsonData.table
}






async function changeSheetData() { //구글스프레드시트 에서 정보를 가져올때는 다른 방법 (axios)를 사용했다. 여기 사용한 방법으로 정보를 가져오면 더 깔끔하게 될 듯
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
      range: 'main!'+'C'+google_sheet_row_num, // Specify the cell you want to update (e.g., 'Sheet1' is the sheet name, and 'A1' is the cell).
      valueInputOption: 'RAW',
      resource: {
        values: [[somang_talent+5]], // The new value you want to set in the cell.
      },
    });

    console.log('Cell A1 has been updated successfully.');
  } catch (err) {
    console.error('Error updating cell:', err);
  }
}





















app.listen(8080);
console.log('Server is listening on port 8080');






