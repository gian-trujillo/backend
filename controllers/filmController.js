const Film = require('../models/filmModel');

const normalizeYouTubeEmbedUrl = (url) => {
  if (!url) {
    return '';
  }

  if (url.includes('/embed/')) {
    return url;
  }

  if (url.includes('/shorts/')) {
    const videoId = url.split('/shorts/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes('watch?v=')) {
    const videoId = url.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
};

const getFilms = async (req, res) => {
  try {
    const films = await Film.find({ isActive: true }).sort({ order: 1 });

    return res.send(films);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updateFilm = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedUpdates = ['title', 'description', 'embedUrl'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.embedUrl) {
      updates.embedUrl = normalizeYouTubeEmbedUrl(updates.embedUrl);
    }

    const updatedFilm = await Film.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedFilm) {
      return res.status(404).send({
        message: 'Film not found',
      });
    }

    return res.send(updatedFilm);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  getFilms,
  updateFilm,
};
