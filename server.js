const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');

// Routes
const indexRoutes = require('./routes/index');
const emojiRoutes = require('./routes/emoji');
const treasureRoutes = require('./routes/treasure');
const imageRoutes = require('./routes/image');

// Use Routes
app.use('/', indexRoutes);
app.use('/', emojiRoutes);
app.use('/', treasureRoutes);
app.use('/', imageRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});