const express = require('express');
const router = express.Router();
const { handleQuizAnswer } = require('../services/googleSheetService');

router.get('/emoji1_answer', (req, res) => {
  const EMOJI1_ANSWERS = ["노아", "베드로", "삼손"];
  const EMOJI1_SUCCESS_MESSAGE = '🥳 정답입니다!!! 🥳\\n\\n1달란트가 적립됩니다.';
  const EMOJI1_TALENT_POINTS = 1;
  const EMOJI1_QUESTION_NUM = 1;

  const { emoji1_1, emoji1_2, emoji1_3, quiz_name, quiz_year } = req.query;
  const userAnswers = [emoji1_1, emoji1_2, emoji1_3];

  const correct = userAnswers.every((answer, index) => answer === EMOJI1_ANSWERS[index]);

  if (correct) {
    handleQuizAnswer(quiz_name, quiz_year, res, EMOJI1_TALENT_POINTS, EMOJI1_SUCCESS_MESSAGE, EMOJI1_QUESTION_NUM);
  } else {
    const result = userAnswers.map((answer, index) => answer === EMOJI1_ANSWERS[index] ? '✅' : '❌');
    res.send(`<script>alert('[제출 결과]\\n\\n1번: ${result[0]}\\n2번: ${result[1]}\\n3번: ${result[2]}'); history.back();</script>`);
  }
});

router.get('/emoji2_answer', (req, res) => {
  const EMOJI2_ANSWERS = ["아브라함", "다윗", "솔로몬"];
  const EMOJI2_SUCCESS_MESSAGE = '🥳 정답입니다!!! 🥳\\n\\n3달란트가 적립됩니다.';
  const EMOJI2_TALENT_POINTS = 3;
  const EMOJI2_QUESTION_NUM = 2;

  const { emoji2_1, emoji2_2, emoji2_3, quiz_name, quiz_year } = req.query;
  const userAnswers = [emoji2_1, emoji2_2, emoji2_3];

  const correct = userAnswers.every((answer, index) => answer === EMOJI2_ANSWERS[index]);

  if (correct) {
    handleQuizAnswer(quiz_name, quiz_year, res, EMOJI2_TALENT_POINTS, EMOJI2_SUCCESS_MESSAGE, EMOJI2_QUESTION_NUM);
  } else {
    const result = userAnswers.map((answer, index) => answer === EMOJI2_ANSWERS[index] ? '✅' : '❌');
    res.send(`<script>alert('[제출 결과]\\n\\n1번: ${result[0]}\\n2번: ${result[1]}\\n3번: ${result[2]}'); history.back();</script>`);
  }
});

router.get('/emoji3_answer', (req, res) => {
  const EMOJI3_ANSWERS = ["야엘", "엘리야", "요나"];
  const EMOJI3_SUCCESS_MESSAGE = '🥳 정답입니다!!! 🥳\\n\\n5달란트가 적립됩니다.';
  const EMOJI3_TALENT_POINTS = 5;
  const EMOJI3_QUESTION_NUM = 3;

  const { emoji3_1, emoji3_2, emoji3_3, quiz_name, quiz_year } = req.query;
  const userAnswers = [emoji3_1, emoji3_2, emoji3_3];

  const correct = userAnswers.every((answer, index) => answer === EMOJI3_ANSWERS[index]);

  if (correct) {
    handleQuizAnswer(quiz_name, quiz_year, res, EMOJI3_TALENT_POINTS, EMOJI3_SUCCESS_MESSAGE, EMOJI3_QUESTION_NUM);
  } else {
    const result = userAnswers.map((answer, index) => answer === EMOJI3_ANSWERS[index] ? '✅' : '❌');
    res.send(`<script>alert('[제출 결과]\\n\\n1번: ${result[0]}\\n2번: ${result[1]}\\n3번: ${result[2]}'); history.back();</script>`);
  }
});

module.exports = router;
