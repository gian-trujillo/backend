const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 80,
    },

    subtitle: {
      type: String,
      required: true,
      maxlength: 140,
    },

    description: {
      type: String,
      maxlength: 300,
      default: '',
    },

    badgeText: {
      type: String,
      maxlength: 30,
      default: '',
    },

    buttonText: {
      type: String,
      default: 'Enviar mensaje',
      maxlength: 40,
    },

    startsAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endsAt: {
      type: Date,
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String,
      default: '',
    },

    imageFilename: {
      type: String,
      default: '',
    },

    imageAlt: {
      type: String,
      maxlength: 120,
      default: '',
    },

    imageDeletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Promotion', promotionSchema);
