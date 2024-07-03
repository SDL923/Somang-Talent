const express = require('express');
const router = express.Router();
const { getSheetData } = require('../services/googleSheetService');

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

// 루트 경로
router.get('/', (req, res) => {
  res.render('index', { num: "?", name: "나" });
});

// 이름 학번에 맞는 달란트 개수 불러오기
router.get('/name', (req, res) => {
  const { fname, fyear } = req.query;
  getSheetData(fname, fyear, 'main', res);
});

// viewRoutes 배열을 사용하여 경로 설정
viewRoutes.forEach(route => {
  router.get(route.path, (req, res) => {
    res.render(route.view);
  });
});

module.exports = router;
