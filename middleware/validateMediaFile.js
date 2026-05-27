const validateMediaFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({
      message: 'No file uploaded',
    });
  }

  const isImage = req.file.mimetype.startsWith('image/');
  const isVideo = req.file.mimetype.startsWith('video/');

  if (!isImage && !isVideo) {
    return res.status(400).send({
      message: 'Invalid file type. Only images and videos are allowed.',
    });
  }

  if (req.body.mediaType === 'image' && !isImage) {
    return res.status(400).send({
      message: 'Media type does not match uploaded file.',
    });
  }

  if (req.body.mediaType === 'video' && !isVideo) {
    return res.status(400).send({
      message: 'Media type does not match uploaded file.',
    });
  }

  return next();
};

module.exports = validateMediaFile;
