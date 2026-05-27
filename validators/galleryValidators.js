const { celebrate, Joi, Segments } = require('celebrate');

const { objectIdSchema } = require('./commonValidators');

const layoutSlots = [
  'top-right-large',
  'top-left-large',
  'normal-1',
  'normal-2',
  'normal-3',
  'normal-4',
];

const mediaTypes = ['image', 'video'];

const categories = [
  'Eventos',
  'Retratos',
  'Paisajes',
  'Drone',
];

const validateObjectIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectIdSchema,
  }),
});

const validateReplaceMedia = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 2 characters',
        'string.max': 'Title must be less than 100 characters',
        'any.required': 'Title is required',
      }),

    category: Joi.string()
      .valid(...categories)
      .required()
      .messages({
        'any.only': 'Invalid gallery category',
        'any.required': 'Category is required',
      }),

    mediaType: Joi.string()
      .valid(...mediaTypes)
      .required()
      .messages({
        'any.only': 'Media type must be image or video',
        'any.required': 'Media type is required',
      }),

    layoutSlot: Joi.string()
      .valid(...layoutSlots)
      .required()
      .messages({
        'any.only': 'Invalid gallery layout slot',
        'any.required': 'Layout slot is required',
      }),
  }),
});

const validateUploadMedia = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    category: Joi.string()
      .valid(...categories)
      .required(),

    mediaType: Joi.string()
      .valid(...mediaTypes)
      .required(),

    layoutSlot: Joi.string()
      .valid(...layoutSlots)
      .required(),
  }),
});

const validateGalleryMetadata = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectIdSchema,
  }),

  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string()
        .trim()
        .min(2)
        .max(100),

      category: Joi.string()
        .valid(...categories),

      mediaType: Joi.string()
        .valid(...mediaTypes),

      layoutSlot: Joi.string()
        .valid(...layoutSlots),
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided',
    }),
});

module.exports = {
  validateObjectIdParam,
  validateReplaceMedia,
  validateUploadMedia,
  validateGalleryMetadata,
};
