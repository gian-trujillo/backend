const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 35,
    },

    subtitle: {
      type: String,
      required: true,
      maxlength: 40,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: 'MXN',
    },

    priceNote: {
      type: String,
      default: '/desde',
      maxlength: 20,
    },

    details: {
      type: [String],
      required: true,
      validate: {
        validator(details) {
          return details.length >= 1 && details.length <= 5;
        },
        message: 'Package must have between 1 and 5 details',
      },
    },

    buttonText: {
      type: String,
      default: 'Reservar',
    },

    selectValue: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Package', packageSchema);
