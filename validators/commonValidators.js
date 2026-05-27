const { Joi } = require('celebrate');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = Joi.string()
  .pattern(objectIdRegex)
  .required()
  .messages({
    'string.pattern.base': 'Invalid id',
    'any.required': 'Id is required',
  });

const youtubeUrlSchema = Joi.string()
  .trim()
  .uri()
  .required()
  .custom((value, helpers) => {
    const isYouTubeUrl = value.includes('youtube.com/watch?v=')
      || value.includes('youtube.com/embed/')
      || value.includes('youtube.com/shorts/')
      || value.includes('youtu.be/');

    if (!isYouTubeUrl) {
      return helpers.error('string.youtube');
    }

    return value;
  })
  .messages({
    'string.empty': 'YouTube URL is required',
    'string.uri': 'Video URL must be a valid URL',
    'string.youtube': 'Video URL must be a valid YouTube URL',
    'any.required': 'YouTube URL is required',
  });

module.exports = {
  objectIdSchema,
  youtubeUrlSchema,
};
