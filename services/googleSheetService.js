const axios = require('axios');
const { google } = require('googleapis');
const redis = require('./redisService');
const dotenv = require('dotenv');

dotenv.config();

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_KEY = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

const getSheetData = async (name, year, sheetName, res) => {
  const NAME_COLUMN_INDEX = 0;
  const YEAR_COLUMN_INDEX = 1;
  const SOMANG_TALENT_COLUMN_INDEX = 2;
  const EMOJI_COLUMN_INDEX = 3;
  const START_ROW = 2;

  try {
    const { data } = await axios.get(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${sheetName}`);
    const { rows } = refindSheetsData(data);
    let check = 0;
    let rowCount = START_ROW;
    let emojiNum;
    let somang_talent;
    let googleSheetRowNum;

    rows.forEach((row) => {
      if (row.c[NAME_COLUMN_INDEX].v == name && row.c[YEAR_COLUMN_INDEX].v == year) {
        somang_talent = row.c[SOMANG_TALENT_COLUMN_INDEX].v;
        emojiNum = row.c[EMOJI_COLUMN_INDEX].v;
        googleSheetRowNum = rowCount;
        check = 1;
        if (res) {
          res.render('index', { num: row.c[SOMANG_TALENT_COLUMN_INDEX].v, name: `"${year} ${name}"` });
        }
      }
      rowCount++;
    });
    if (check === 0 && res) {
      res.send(`<script>alert('No Information Found.'); history.back();</script>`);
    }
    return { nameCheck: check === 1, emojiNum, somang_talent, googleSheetRowNum };
  } catch (error) {
    console.log(error);
  }
};

const getSheetData_treasure = async (input_code, sheetName) => {
  const CODE_COLUMN_INDEX = 0;
  const CHECK_COLUMN_INDEX = 1;
  const START_ROW = 2;

  try {
    const { data } = await axios.get(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?sheet=${sheetName}`);
    const { rows } = refindSheetsData(data);
    let check = 0;
    let rowCount = START_ROW;
    let treasureCheck;
    let treasureGoogleSheetRowNum;

    rows.forEach((row) => {
      if (row.c[CODE_COLUMN_INDEX].v === input_code) {
        treasureCheck = row.c[CHECK_COLUMN_INDEX].v;
        treasureGoogleSheetRowNum = rowCount;
        check = 1;
      }
      rowCount++;
    });
    return { treasureCheck: check === 1, treasureGoogleSheetRowNum };
  } catch (error) {
    console.log(error);
  }
};

const refindSheetsData = (string) => {
  const firstSplit = string.split('google.visualization.Query.setResponse(')[1];
  return JSON.parse(firstSplit.slice(0, firstSplit.length - 2)).table;
};

const changeSheetData = async (googleSheetRowNum, somang_talent, add_talent, emoji_num) => {
  const SOMANG_TALENT_COLUMN = 'C';
  const EMOJI_COLUMN = 'D';
  const LOCK_EXPIRATION = 5; // seconds
  const lockKey = `google-sheets-lock:${googleSheetRowNum}`;
  const lockValue = Date.now();

  try {
    const lockAcquired = await redis.set(lockKey, lockValue, 'NX', 'EX', LOCK_EXPIRATION);
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
      range: `main!${SOMANG_TALENT_COLUMN}${googleSheetRowNum}:${EMOJI_COLUMN}${googleSheetRowNum}`,
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

const changeSheetData_treasure = async (treasureGoogleSheetRowNum) => {
  const CHECK_COLUMN = 'B';

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
      range: `treasure!${CHECK_COLUMN}${treasureGoogleSheetRowNum}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[1]],
      },
    });
  } catch (err) {
    console.error('Error updating cell:', err);
  }
};

const handleQuizAnswer = async (input_name, input_year, res, correctEmojiNum, successMessage, question_num) => {
  try {
    const { nameCheck, emojiNum, googleSheetRowNum, somang_talent } = await getSheetData(input_name, input_year, 'main');
    if (!nameCheck) {
      res.send("<script>alert('❗올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
    } else {
      if (!isProblemSolved(emojiNum, question_num)) {
        res.send(`<script>alert('${successMessage}'); history.back();</script>`);
        await changeSheetData(googleSheetRowNum, somang_talent, correctEmojiNum, emojiNum + Math.pow(2, question_num - 1));
      } else {
        res.send("<script>alert('🚫 이미 적립된 문제입니다.'); history.back();</script>");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// emoji_num을 통해 해당 emoji 문제가 풀렸는지 확인
function isProblemSolved(emoji_num, question_num) { 
  const MIN_EMOJI_NUM = 0;
  const MAX_EMOJI_NUM = 7;
  const BINARY_STRING_LENGTH = 3;
  const BIT_VALUE_0 = '0';
  const BIT_VALUE_1 = '1';

  if (emoji_num < MIN_EMOJI_NUM || emoji_num > MAX_EMOJI_NUM) {
    throw new Error("emoji_num out of range.");
  }

  let binaryStr = emoji_num.toString(2).padStart(BINARY_STRING_LENGTH, BIT_VALUE_0); // 숫자를 2진수 문자열로 변환하고 길이를 3으로 맞추기 위해 앞쪽을 '0'으로 채움

  return binaryStr[BINARY_STRING_LENGTH - question_num] === BIT_VALUE_1; // 해당 위치의 비트를 확인 
}

module.exports = {
  getSheetData,
  getSheetData_treasure,
  changeSheetData,
  changeSheetData_treasure,
  handleQuizAnswer,
  isProblemSolved
};
