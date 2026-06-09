const { celebrate, Joi, Segments } = require('celebrate');

const {
  objectIdSchema,
} = require('./commonValidators');

const promotionTitleSchema = Joi.string()
  .trim()
  .min(2)
  .max(80)
  .messages({
    'string.empty': 'Promotion title is required',
    'string.min': 'Promotion title must be at least 2 characters',
    'string.max': 'Promotion title must be less than 80 characters',
  });

const promotionSubtitleSchema = Joi.string()
  .trim()
  .min(2)
  .max(140)
  .messages({
    'string.empty': 'Promotion subtitle is required',
    'string.min': 'Promotion subtitle must be at least 2 characters',
    'string.max': 'Promotion subtitle must be less than 140 characters',
  });

const promotionDescriptionSchema = Joi.string()
  .trim()
  .max(300)
  .allow('')
  .messages({
    'string.max': 'Promotion description must be less than 300 characters',
  });

const promotionBadgeTextSchema = Joi.string()
  .trim()
  .max(30)
  .allow('')
  .messages({
    'string.max': 'Promotion badge text must be less than 30 characters',
  });

const promotionButtonTextSchema = Joi.string()
  .trim()
  .min(2)
  .max(40)
  .messages({
    'string.empty': 'Promotion button text is required',
    'string.min': 'Promotion button text must be at least 2 characters',
    'string.max': 'Promotion button text must be less than 40 characters',
  });

const promotionStartsAtSchema = Joi.date()
  .iso()
  .messages({
    'date.base': 'Promotion start date must be a valid date',
    'date.format': 'Promotion start date must be in ISO format',
  });

const promotionDurationDaysSchema = Joi.number()
  .integer()
  .min(1)
  .max(365)
  .messages({
    'number.base': 'Promotion duration must be a number',
    'number.integer': 'Promotion duration must be a whole number',
    'number.min': 'Promotion duration must be at least 1 day',
    'number.max': 'Promotion duration cannot be more than 365 days',
  });

const promotionImageAltSchema = Joi.string()
  .trim()
  .max(120)
  .allow('')
  .messages({
    'string.max': 'Promotion image alt text must be less than 120 characters',
  });

const validateCreatePromotion = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      title: promotionTitleSchema.required(),
      subtitle: promotionSubtitleSchema.required(),
      description: promotionDescriptionSchema,
      badgeText: promotionBadgeTextSchema,
      buttonText: promotionButtonTextSchema,
      startsAt: promotionStartsAtSchema,
      durationDays: promotionDurationDaysSchema.required(),
      isActive: Joi.boolean(),
      imageAlt: promotionImageAltSchema,
    })
    .required(),
});

const validateUpdatePromotion = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectIdSchema,
  }),

  [Segments.BODY]: Joi.object()
    .keys({
      title: promotionTitleSchema,
      subtitle: promotionSubtitleSchema,
      description: promotionDescriptionSchema,
      badgeText: promotionBadgeTextSchema,
      buttonText: promotionButtonTextSchema,
      startsAt: promotionStartsAtSchema,
      durationDays: promotionDurationDaysSchema,
      isActive: Joi.boolean(),
      imageAlt: promotionImageAltSchema,
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided',
    }),
});

const validatePromotionId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectIdSchema,
  }),
});

module.exports = {
  validateCreatePromotion,
  validateUpdatePromotion,
  validatePromotionId,
};
