const { celebrate, Joi, Segments } = require('celebrate');

const {
  objectIdSchema,
} = require('./commonValidators');

const packageLabelSchema = Joi.string()
  .trim()
  .min(1)
  .max(6)
  .messages({
    'string.empty': 'Package label is required',
    'string.min': 'Package label must be at least 1 character',
    'string.max': 'Package label must be less than 6 characters',
  });

const packageTitleSchema = Joi.string()
  .trim()
  .min(2)
  .max(35)
  .messages({
    'string.empty': 'Package title is required',
    'string.min': 'Package title must be at least 2 characters',
    'string.max': 'Package title must be less than 35 characters',
  });

const packageSubtitleSchema = Joi.string()
  .trim()
  .min(2)
  .max(40)
  .messages({
    'string.empty': 'Package subtitle is required',
    'string.min': 'Package subtitle must be at least 2 characters',
    'string.max': 'Package subtitle must be less than 40 characters',
  });

const packagePriceSchema = Joi.number()
  .min(0)
  .precision(2)
  .messages({
    'number.base': 'Package price must be a number',
    'number.min': 'Package price cannot be negative',
  });

const packageCurrencySchema = Joi.string()
  .trim()
  .uppercase()
  .min(3)
  .max(6)
  .messages({
    'string.empty': 'Currency is required',
    'string.min': 'Currency must be at least 3 characters',
    'string.max': 'Currency must be less than 6 characters',
  });

const packagePriceNoteSchema = Joi.string()
  .trim()
  .max(20)
  .allow('')
  .messages({
    'string.max': 'Price note must be less than 20 characters',
  });

const packageDetailSchema = Joi.string()
  .trim()
  .min(1)
  .max(60)
  .messages({
    'string.empty': 'Package detail cannot be empty',
    'string.min': 'Package detail must be at least 1 character',
    'string.max': 'Package detail must be less than 60 characters',
  });

const packageDetailsSchema = Joi.array()
  .items(packageDetailSchema)
  .min(1)
  .max(5)
  .messages({
    'array.base': 'Package details must be an array',
    'array.min': 'Package must have at least 1 detail',
    'array.max': 'Package cannot have more than 5 details',
  });

const packageButtonTextSchema = Joi.string()
  .trim()
  .min(2)
  .max(20)
  .messages({
    'string.empty': 'Button text is required',
    'string.min': 'Button text must be at least 2 characters',
    'string.max': 'Button text must be less than 20 characters',
  });

const packageSelectValueSchema = Joi.string()
  .trim()
  .min(2)
  .max(40)
  .messages({
    'string.empty': 'Select value is required',
    'string.min': 'Select value must be at least 2 characters',
    'string.max': 'Select value must be less than 40 characters',
  });

const validateUpdatePackage = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: objectIdSchema,
  }),

  [Segments.BODY]: Joi.object()
    .keys({
      label: packageLabelSchema,
      title: packageTitleSchema,
      subtitle: packageSubtitleSchema,
      price: packagePriceSchema,
      currency: packageCurrencySchema,
      priceNote: packagePriceNoteSchema,
      details: packageDetailsSchema,
      buttonText: packageButtonTextSchema,
      selectValue: packageSelectValueSchema,
    })
    .min(1)
    .messages({
      'object.min': 'At least one field must be provided',
    }),
});

module.exports = {
  validateUpdatePackage,
};
