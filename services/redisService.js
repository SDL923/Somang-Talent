const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT
});

module.exports = redis;
