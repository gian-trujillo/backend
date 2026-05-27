require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const packageRoutes = require('./routes/packageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const filmRoutes = require('./routes/filmRoutes');
const { requestLogger, errorLogger } = require('./middleware/logger');

const { MONGO_URI = 'mongodb://localhost:27017/photowebsite' } = process.env;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/auth', authRoutes);
app.use('/gallery', galleryRoutes);
app.use('/packages', packageRoutes);
app.use('/contact', contactRoutes);
app.use('/films', filmRoutes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Error en el servidor' : message,
  });
});

const { PORT = 3000 } = process.env;

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the server at http://localhost:${PORT}`);
});
