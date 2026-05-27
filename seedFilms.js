require('dotenv').config();

const mongoose = require('mongoose');

const Film = require('./models/filmModel');

const films = [
  {
    label: 'I',
    title: 'Edición social',
    description: 'Un video corto enfocado en ritmo, composición y color.',
    embedUrl: 'https://www.youtube.com/embed/3l1krAh71eg',
    orientation: 'landscape',
    order: 1,
    isActive: true,
  },
  {
    label: 'II',
    title: 'Tomas aéreas',
    description: 'Edición dinámica con movimiento, ambiente y perspectiva.',
    embedUrl: 'https://www.youtube.com/embed/Ts0D8c1nc5s',
    orientation: 'landscape',
    order: 2,
    isActive: true,
  },
  {
    label: 'III',
    title: 'Reel vertical',
    description: 'Contenido vertical pensado para redes sociales y presentación rápida.',
    embedUrl: 'https://www.youtube.com/embed/kwwXcoZmEEM',
    orientation: 'portrait',
    order: 3,
    isActive: true,
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const createFilmPromises = films.map(async (film) => {
      const existingFilm = await Film.findOne({ order: film.order });

      if (!existingFilm) {
        await Film.create(film);
        console.log(`Created film: ${film.title}`);
      }
    });

    await Promise.all(createFilmPromises);

    console.log('Films seeded');

    await mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
