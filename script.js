var express = require('express');
var app = express();
var fs = require('fs');

// set the view engine to ejs
app.set('view engine', 'ejs');

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

app.get('/img_back', function(req, res) { // timeschedule 사진 보내기
  fs.readFile('./image/back.png', function(err,data){
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



app.get('/', function(req, res) {
  res.render('index', {num: "?"}); //초기 달란트 개수 ?
});

const axios = require('axios')
const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ"

app.get('/name', function(req, res){
  let somang_name = req.query.fname;
  let somang_year = req.query.fyear;

  const getSheetData = async (sheetName) => {
   
    try {
      const { data } = await axios({
        method: 'get',
        url: `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?sheet=${sheetName}`,
      })
  
      const { cols, rows } = refindSheetsData(data)
      
      let check=0;

      rows.forEach((row) => {
          if(row.c[0].v == somang_name && row.c[1].v == somang_year){
            res.render('index', {num: row.c[2].v});
            //console.log(row.c[2].v)
            check=1

          }
      })

      if(check==0){ //없는 이름
        res.send("<script>alert('No Information Found.'); history.back();</script>");
      }
  
    } catch (error) {
      console.log(error)
    }
  }

  getSheetData('sheet01')
});


const refindSheetsData = (string) => {
    const firstSplit = string.split('google.visualization.Query.setResponse(')[1]
  
    const jsonData = JSON.parse(firstSplit.slice(0, firstSplit.length - 2))
  
    return jsonData.table
}

app.listen(8080);
console.log('Server is listening on port 8080');






