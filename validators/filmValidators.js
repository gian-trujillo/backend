const { celebrate, Joi, Segments } = require('celebrate');

const {
  objectIdSchema,
  youtubeUrlSchema,
} = require('./commonValidators');

const filmTitleSchema = Joi.string()
  .trim()
  .min(2)
  .max(60)
  .messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 2 characters',
    'string.max': 'Title must be less than 60 characters',
  });

const filmDescriptionSchema = Joi.string()
  .trim()
  .min(2)
  .max(180)
  .messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 2 characters',
    'string.max': 'Description must be less than 180 characters',
  });

const validateUpdateFilm = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectIdSchema,
  }),

  [Segments.BODY]: Joi.object()
    .keys({
      title: filmTitleSchema,
      description: filmDescriptionSchema,
      embedUrl: youtubeUrlSchema,
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided',
    }),
});

module.exports = {
  validateUpdateFilm,
};
