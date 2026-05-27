const streamifier = require('streamifier');
const Gallery = require('../models/galleryModel');
const cloudinary = require('../config/cloudinary');

const uploadMedia = async (req, res) => {
  try {
    const {
      title,
      category,
      mediaType,
      layoutSlot,
    } = req.body;

    if (!req.file) {
      return res.status(400).send({
        message: 'No file uploaded',
      });
    }

    const streamUpload = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio-gallery',
          resource_type:
            mediaType === 'video'
              ? 'video'
              : 'image',
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);
    });

    const result = await streamUpload();

    const galleryItem = await Gallery.create({
      title,
      category,
      mediaType,
      layoutSlot,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(201).send(galleryItem);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getGallery = async (req, res) => {
  const gallery = await Gallery.find();

  res.send(gallery);
};

const protectedTest = async (req, res) => {
  res.send({
    message: 'Protected route working',
  });
};

const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).send({
        message: 'Gallery item not found',
      });
    }

    if (galleryItem.publicId) {
      await cloudinary.uploader.destroy(galleryItem.publicId, {
        resource_type: galleryItem.mediaType === 'video' ? 'video' : 'image',
      });
    }

    galleryItem.cloudinaryUrl = undefined;
    galleryItem.publicId = undefined;
    galleryItem.thumbnailUrl = undefined;
    galleryItem.isEmpty = true;

    await galleryItem.save();

    return res.send(galleryItem);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const replaceMedia = async (req, res) => {
  try {
    const { category, layoutSlot } = req.body;

    const galleryItem = await Gallery.findOne({
      category,
      layoutSlot,
    });

    if (!galleryItem) {
      return res.status(404).send({
        message: 'Gallery slot not found',
      });
    }

    if (!req.file) {
      return res.status(400).send({
        message: 'No file uploaded',
      });
    }

    if (galleryItem.publicId) {
      await cloudinary.uploader.destroy(
        galleryItem.publicId,
        {
          resource_type:
            galleryItem.mediaType === 'video'
              ? 'video'
              : 'image',
        },
      );
    }

    const streamUpload = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio-gallery',
          resource_type:
            req.body.mediaType === 'video'
              ? 'video'
              : 'image',
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(stream);
    });

    const result = await streamUpload();

    galleryItem.title = req.body.title;
    galleryItem.mediaType = req.body.mediaType;
    galleryItem.cloudinaryUrl = result.secure_url;
    galleryItem.publicId = result.public_id;
    galleryItem.isEmpty = false;

    await galleryItem.save();

    return res.send(galleryItem);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updateGalleryMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, category, mediaType, layoutSlot,
    } = req.body;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).send({ message: 'Gallery item not found' });
    }

    if (title !== undefined) {
      galleryItem.title = title;
    }

    if (category !== undefined) {
      galleryItem.category = category;
    }

    if (mediaType !== undefined) {
      galleryItem.mediaType = mediaType;
    }

    if (layoutSlot !== undefined) {
      galleryItem.layoutSlot = layoutSlot;
    }

    await galleryItem.save();

    return res.send(galleryItem);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getGallery,
  protectedTest,
  uploadMedia,
  deleteMedia,
  replaceMedia,
  updateGalleryMetadata,
};
