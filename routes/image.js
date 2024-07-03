const express = require('express');
const router = express.Router();
const { readFileAndSend } = require('../utils/fileUtils');

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
  router.get(path, (req, res) => readFileAndSend(file, res));
});

module.exports = router;
