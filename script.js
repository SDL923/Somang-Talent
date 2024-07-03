const express = require('express');
const app = express();
const fs = require('fs');
const Redis = require('ioredis');
const dotenv = require('dotenv');
const axios = require('axios');
const { google } = require('googleapis');

dotenv.config();

// 설정
app.set('view engine', 'ejs');

// Redis 설정
const redis = new Redis({
  host: '3.38.213.185',
  port: 6379
});

// 변수 선언
let somang_name;
let somang_year;
let somang_talent;
let emoji_num;
let google_sheet_row_num = -1;
let name_check = 0;
let treasure_check = -1;
let treasure_google_sheet_row_num = -1;

// 유틸리티 함수
const readFileAndSend = (filePath, res) => {
  fs.readFile(filePath, (err, data) => {
    res.writeHead(200, { 'Context-Type': 'text/html' });
    res.end(data);
  });
};

const handleQuizAnswer = async (input_name, input_year, res, correctEmojiNum, successMessage, question_num) => {
  try {
    await getSheetData2(input_name, input_year, 'main');
    if (name_check === 0) {
      res.send("<script>alert('❗올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
    } else {
      if (!isProblemSolved(emoji_num, question_num)) {
        res.send(`<script>alert('${successMessage}'); history.back();</script>`);
        await changeSheetData(correctEmojiNum, emoji_num + Math.pow(2, question_num-1));
      } else {
        res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// 경로 및 응답 처리
const imageRoutes = [
  { path: '/img_url', file: './image/wakeup1.jpg' },
  { path: '/img_timeschedule2', file: './image/timeschedule2.png' },
  { path: '/img_cafe', file: './image/cafe.png' },
  { path: '/img_syg_snack', file: './image/syg_snack.png' },
  { path: '/img_syg_hand', file: './image/syg_hand.png' },
  { path: '/img_sports_album_small', file: './image/sports_album_small.png' },
  { path: '/img_sports_album_large', file: './image/sports_album_large.png' },
  { path: '/img_squidgame_album', file: './image/squidgame_album.png' },
  { path: '/img_aespa_album', file: './image/aespa_album.png' },
  { path: '/img_itzy_album', file: './image/itzy_album.png' },
  { path: '/img_starbucks_small', file: './image/starbucks2.jpg' },
  { path: '/img_starbucks_big', file: './image/starbucks3.jpg' },
  { path: '/img_carmera', file: './image/carmera.jpg' },
  { path: '/img_back', file: './image/back.png' },
  { path: '/img_coin', file: './image/coin.webp' },
  { path: '/img_poom', file: './image/poom.png' },
  { path: '/img_timeschedule', file: './image/timeschedule.png' },
  { path: '/img_bible', file: './image/bible.png' },
  { path: '/img_wakeup', file: './image/wakeup1.png' },
  { path: '/img_market', file: './image/market.png' },
  { path: '/img_game', file: './image/game.png' },
  { path: '/img_information', file: './image/information.png' },
  { path: '/img_teacher', file: './image/teacher.png' },
  { path: '/img_playlist', file: './image/playlist.png' },
  { path: '/img_emoji1_question', file: './image/emoji1.png' },
  { path: '/img_emoji2_question', file: './image/emoji2.png' },
  { path: '/img_emoji3_question', file: './image/emoji3.png' },
];

imageRoutes.forEach(({ path, file }) => {
  app.get(path, (req, res) => readFileAndSend(file, res));
});

const viewRoutes = [
  { path: '/timeschedule_move', view: 'timetable.ejs' },
  { path: '/bible_move', view: 'bible.ejs' },
  { path: '/bible_line1_move', view: 'bible_line1.ejs' },
  { path: '/bible_line2_move', view: 'bible_line2.ejs' },
  { path: '/market_move', view: 'market.ejs' },
  { path: '/informaion_move', view: 'information.ejs' },
  { path: '/game_move', view: 'game.ejs' },
  { path: '/emoji1_move', view: 'emoji1.ejs' },
  { path: '/emoji2_move', view: 'emoji2.ejs' },
  { path: '/emoji3_move', view: 'emoji3.ejs' },
  { path: '/treasure_move', view: 'treasure.ejs' },
  { path: '/playlist_move', view: 'playlist.ejs' },
  { path: '/teacher_move', view: 'teacher.ejs' },
];

viewRoutes.forEach(({ path, view }) => {
  app.get(path, (req, res) => readFileAndSend(`views/${view}`, res));
});

app.get('/', (req, res) => {
  res.render('index', { num: "?", name: "나" });
});

app.get('/name', (req, res) => {
  const { fname, fyear } = req.query;
  somang_name = fname;
  somang_year = fyear;
  getSheetData(somang_name, somang_year, 'main', res);
});

// 퀴즈 응답 처리
app.get('/emoji1_answer', (req, res) => {
  const { emoji1_1, emoji1_2, emoji1_3, quiz_name, quiz_year } = req.query;
  const answers = ["노아", "베드로", "삼손"];
  const userAnswers = [emoji1_1, emoji1_2, emoji1_3];

  const correct = userAnswers.every((answer, index) => answer === answers[index]);

  if (correct) {
    handleQuizAnswer(quiz_name, quiz_year, res, 1, '🥳 정답입니다!!! 🥳\\n\\n1달란트가 적립됩니다.', 1);
  } else {
    const result = userAnswers.map((answer, index) => answer === answers[index] ? '✅' : '❌');
    res.send(`<script>alert('[제출 결과]\\n\\n1번: ${result[0]}\\n2번: ${result[1]}\\n3번: ${result[2]}'); history.back();</script>`);
  }
});

app.get('/emoji2_answer', (req, res) => {
  const { emoji2_1, emoji2_2, emoji2_3, quiz_name, quiz_year } = req.query;
  const answers = ["아브라함", "다윗", "솔로몬"];
  const userAnswers = [emoji2_1, emoji2_2, emoji2_3];

  const correct = userAnswers.every((answer, index) => answer === answers[index]);

  if (correct) {
    handleQuizAnswer(quiz_name, quiz_year, res, 3, '🥳 정답입니다!!! 🥳\\n\\n3달란트가 적립됩니다.', 2);
  } else {
    const result = userAnswers.map((answer, index) => answer === answers[index] ? '✅' : '❌');
    res.send(`<script>alert('[제출 결과]\\n\\n1번: ${result[0]}\\n2번: ${result[1]}\\n3번: ${result[2]}'); history.back();</script>`);
  }
});

app.get('/emoji3_answer', (req, res) => {
  const { emoji3_1, emoji3_2, emoji3_3, quiz_name, quiz_year } = req.query;
  const answers = ["야엘", "엘리야", "요나"];
  const userAnswers = [emoji3_1, emoji3_2, emoji3_3];

  const correct = userAnswers.every((answer, index) => answer === answers[index]);

  if (correct) {
    handleQuizAnswer(quiz_name, quiz_year, res, 5, '🥳 정답입니다!!! 🥳\\n\\n5달란트가 적립됩니다.', 3);
  } else {
    const result = userAnswers.map((answer, index) => answer === answers[index] ? '✅' : '❌');
    res.send(`<script>alert('[제출 결과]\\n\\n1번: ${result[0]}\\n2번: ${result[1]}\\n3번: ${result[2]}'); history.back();</script>`);
  }
});

// 보물찾기 응답 처리
app.get('/treasure_answer', (req, res) => {
  const { treasure_code, quiz_name, quiz_year } = req.query;

  const validCodes = ["aaa", "bbb", "ccc"];
  if (validCodes.includes(treasure_code)) {
    const haha = async () => {
      try {
        await getSheetData_treasure(treasure_code, "treasure");
        if (treasure_check == 1) {
          res.send("<script>alert('🚫 이미 적립된 코드입니다.'); history.back();</script>");
        } else {
          await getSheetData2(quiz_name, quiz_year, "main");
          if (name_check == 0) {
            res.send("<script>alert('❗올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
          } else {
            res.send("<script>alert('🥳 올바른 코드입니다!!! 🥳\\n\\n5달란트가 적립됩니다.'); history.back();</script>");
            await changeSheetData(5, emoji_num);
            await changeSheetData_treasure();
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    haha();
  } else {
    res.send("<script>alert('❌ 잘못된 코드입니다.'); history.back();</script>");
  }
});

// 데이터 처리 함수
const getSheetData = async (somang_name, somang_year, sheetName, res) => {
  const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ";
  try {
    const { data } = await axios.get(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?sheet=${sheetName}`);
    const { rows } = refindSheetsData(data);
    let check = 0;
    let rowCount = 2;
    rows.forEach((row) => {
      if (row.c[0].v == somang_name && row.c[1].v == somang_year) {
        res.render('index', { num: row.c[2].v, name: `"${somang_year} ${somang_name}"` });
        somang_talent = row.c[2].v;
        emoji_num = row.c[3].v;
        google_sheet_row_num = rowCount;
        check = 1;
      }
      rowCount++;
    });
    if (check === 0) {
      res.send("<script>alert('No Information Found.'); history.back();</script>");
    }
  } catch (error) {
    console.log(error);
  }
};

const getSheetData2 = async (somang_name, somang_year, sheetName) => {
  const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ";
  try {
    const { data } = await axios.get(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?sheet=${sheetName}`);
    const { rows } = refindSheetsData(data);
    let check = 0;
    let rowCount = 2;
    rows.forEach((row) => {
      if (row.c[0].v == somang_name && row.c[1].v == somang_year) {
        somang_talent = row.c[2].v;
        emoji_num = row.c[3].v;
        google_sheet_row_num = rowCount;
        check = 1;
      }
      rowCount++;
    });
    name_check = check ? 1 : 0;
  } catch (error) {
    console.log(error);
  }
};

const getSheetData_treasure = async (input_code, sheetName) => {
  const GOOGLE_SHEET_ID = "11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ";
  try {
    const { data } = await axios.get(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?sheet=${sheetName}`);
    const { rows } = refindSheetsData(data);
    let check = 0;
    let rowCount = 2;
    rows.forEach((row) => {
      if (row.c[0].v === input_code) {
        treasure_check = row.c[1].v;
        treasure_google_sheet_row_num = rowCount;
        check = 1;
      }
      rowCount++;
    });
    name_check = check ? 1 : 0;
  } catch (error) {
    console.log(error);
  }
};

const refindSheetsData = (string) => {
  const firstSplit = string.split('google.visualization.Query.setResponse(')[1];
  return JSON.parse(firstSplit.slice(0, firstSplit.length - 2)).table;
};

const changeSheetData = async (add_talent, emoji_num) => {
  const SPREADSHEET_ID = '11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ';
  const SERVICE_ACCOUNT_KEY = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
  const lockKey = `google-sheets-lock:${google_sheet_row_num}`;
  const lockValue = Date.now();

  try {
    const lockAcquired = await redis.set(lockKey, lockValue, 'NX', 'EX', 5);
    if (!lockAcquired) {
      console.log('잠금을 획득할 수 없습니다. 다른 프로세스가 시트를 업데이트하고 있습니다.');
      return;
    }

    const authClient = new google.auth.JWT(
      SERVICE_ACCOUNT_KEY.client_email,
      null,
      SERVICE_ACCOUNT_KEY.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheetsInstance = google.sheets({ version: 'v4', auth: authClient });

    await sheetsInstance.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'main!' + 'C' + google_sheet_row_num + ':' + 'D' + google_sheet_row_num,
      valueInputOption: 'RAW',
      resource: {
        values: [[somang_talent + add_talent, emoji_num]],
      },
    });
  } catch (err) {
    console.error('Error updating cell:', err);
  } finally {
    const lockCurrentValue = await redis.get(lockKey);
    if (lockCurrentValue === String(lockValue)) {
      await redis.del(lockKey);
    }
  }
};

const changeSheetData_treasure = async () => {
  const SPREADSHEET_ID = '11Tk0vKz1Hp0XT45_Dv45VXXb_X4BadZxEEPAoyCPjcQ';
  const SERVICE_ACCOUNT_KEY = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

  try {
    const authClient = new google.auth.JWT(
      SERVICE_ACCOUNT_KEY.client_email,
      null,
      SERVICE_ACCOUNT_KEY.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheetsInstance = google.sheets({ version: 'v4', auth: authClient });

    await sheetsInstance.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'treasure!' + 'B' + treasure_google_sheet_row_num,
      valueInputOption: 'RAW',
      resource: {
        values: [[1]],
      },
    });
  } catch (err) {
    console.error('Error updating cell:', err);
  }
};

function isProblemSolved(emoji_num, question_num) { // question_num 주어진 문제(1번, 2번, 3번)가 이미 풀려있는지 확인. 이미 푼 문제면 ture 반환
  if (emoji_num < 0 || emoji_num > 7) {
    throw new Error("emoji_num out of range.");
  }

  // 숫자를 2진수 문자열로 변환하고 길이를 3으로 맞추기 위해 앞쪽을 '0'으로 채움
  let binaryStr = emoji_num.toString(2).padStart(3, '0');

  // 해당 위치의 비트를 확인 
  return binaryStr[3 - question_num] === '1';
}


// 서버 시작
app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
