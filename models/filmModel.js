const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 60,
    },

    description: {
      type: String,
      required: true,
      maxlength: 180,
    },

    embedUrl: {
      type: String,
      required: true,
    },

    orientation: {
      type: String,
      enum: ['landscape', 'portrait'],
      required: true,
    },

    order: {
      type: Number,
      required: true,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Film', filmSchema);
