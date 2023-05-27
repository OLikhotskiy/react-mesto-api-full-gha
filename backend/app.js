require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const errorsCelebrate = require('celebrate').errors;
const errorHandlers = require('./utils/handlers');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cors({
  origin: [
    'https://project-mesto.nomoredomains.rocks',
    'http://project-mesto.nomoredomains.rocks',
    'http://project-mesto.nomoredomains.rock/signin',
    'https://api.project-mesto.nomoredomains.rocks/users/me',
    'https://api.project-mesto.nomoredomains.rocks/cards',
    'https://api.project-mesto.nomoredomains.rocks/signup',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'https://51.250.87.238',
    'http://51.250.87.238',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);
app.use(errorsCelebrate());
app.use(errorHandlers);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
