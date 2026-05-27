const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    cloudinaryUrl: {
      type: String,
    },

    publicId: {
      type: String,
    },

    layoutSlot: {
      type: String,
      enum: ['top-right-large', 'top-left-large', 'normal-1', 'normal-2', 'normal-3', 'normal-4'],
      required: true,
    },

    thumbnailUrl: {
      type: String,
    },

    isEmpty: {
      type: Boolean,
      default: true,
    },

  },
  {
    timestamps: true,
  },
);

gallerySchema.index(
  { category: 1, layoutSlot: 1 },
  { unique: true },
);

module.exports = mongoose.model('Gallery', gallerySchema);
