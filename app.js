require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const packageRoutes = require('./routes/packageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const filmRoutes = require('./routes/filmRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const { requestLogger, errorLogger } = require('./middleware/logger');

const { MONGO_URI = 'mongodb://localhost:27017/photowebsite' } = process.env;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const app = express();

const allowedCors = [
  'https://skylensadventures.com',
  'https://www.skylensadventures.com',
  'https://skylens.adventphoto.com',
  'https://www.skylens.adventphoto.com',
  'http://localhost:5173',
  'http://localhost:4173',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedCors.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(requestLogger);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/gallery', galleryRoutes);
app.use('/packages', packageRoutes);
app.use('/contact', contactRoutes);
app.use('/films', filmRoutes);
app.use('/promotions', promotionRoutes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Error en el servidor' : message,
  });
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the server at http://localhost:${PORT}`);
});
