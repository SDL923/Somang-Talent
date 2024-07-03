const express = require('express');
const router = express.Router();
const { getSheetData, getSheetData_treasure, changeSheetData, changeSheetData_treasure } = require('../services/googleSheetService');

router.get('/treasure_answer', (req, res) => {
  const { treasure_code, quiz_name, quiz_year } = req.query;

  const validCodes = ["aaa", "bbb", "ccc"];
  if (validCodes.includes(treasure_code)) {
    const handleTreasureHunt = async () => {
      try {
        const { treasureCheck, treasureGoogleSheetRowNum } = await getSheetData_treasure(treasure_code, "treasure");
        if (treasureCheck === 1) {
          res.send("<script>alert('🚫 이미 적립된 코드입니다.'); history.back();</script>");
        } else {
          const { nameCheck, emojiNum, googleSheetRowNum, somang_talent } = await getSheetData(quiz_name, quiz_year, "main");
          if (!nameCheck) {
            res.send("<script>alert('❗올바른 학번과 이름을 입력해주세요.'); history.back();</script>");
          } else {
            res.send("<script>alert('🥳 올바른 코드입니다!!! 🥳\\n\\n5달란트가 적립됩니다.'); history.back();</script>");
            await changeSheetData(googleSheetRowNum, somang_talent, 5, emojiNum);
            await changeSheetData_treasure(treasureGoogleSheetRowNum);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleTreasureHunt();
  } else {
    res.send("<script>alert('❌ 잘못된 코드입니다.'); history.back();</script>");
  }
});

module.exports = router;
