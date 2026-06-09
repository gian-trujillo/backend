const fs = require('fs/promises');
const path = require('path');

const Promotion = require('../models/promotionModel');

const uploadsDirectory = path.join(__dirname, '..', 'uploads', 'promotions');

const getApiBaseUrl = (req) => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL.replace(/\/$/, '');
  }

  return `${req.protocol}://${req.get('host')}`;
};

const getPromotionImageUrl = (req, filename) => `${getApiBaseUrl(req)}/uploads/promotions/${filename}`;

const deletePromotionImageFile = async (filename) => {
  if (!filename) {
    return;
  }

  const filePath = path.join(uploadsDirectory, filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

const calculateEndsAt = (startsAt, durationDays) => {
  const startDate = startsAt ? new Date(startsAt) : new Date();
  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + Number(durationDays));

  return endDate;
};

const cleanupExpiredPromotionImages = async () => {
  const now = new Date();

  const expiredPromotionsWithImages = await Promotion.find({
    endsAt: { $lte: now },
    imageFilename: { $ne: '' },
  });

  await Promise.all(
    expiredPromotionsWithImages.map(async (promotion) => {
      await deletePromotionImageFile(promotion.imageFilename);

      await Promotion.findByIdAndUpdate(
        promotion._id,
        {
          imageUrl: '',
          imageFilename: '',
          imageDeletedAt: new Date(),
        },
        {
          runValidators: true,
        },
      );
    }),
  );
};

const getActivePromotions = async (req, res) => {
  try {
    await cleanupExpiredPromotionImages();

    const now = new Date();

    const promotions = await Promotion.find({
      isActive: true,
      startsAt: { $lte: now },
      endsAt: { $gt: now },
    })
      .sort({ startsAt: -1, createdAt: -1 })
      .limit(3);

    return res.send(promotions);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getPromotions = async (req, res) => {
  try {
    await cleanupExpiredPromotionImages();

    const promotions = await Promotion.find()
      .sort({ createdAt: -1 });

    return res.send(promotions);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const createPromotion = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description = '',
      badgeText = '',
      buttonText = 'Enviar mensaje',
      startsAt,
      durationDays,
      isActive = true,
      imageAlt = '',
    } = req.body;

    const promotionStartsAt = startsAt ? new Date(startsAt) : new Date();
    const promotionEndsAt = calculateEndsAt(promotionStartsAt, durationDays);

    const promotion = await Promotion.create({
      title,
      subtitle,
      description,
      badgeText,
      buttonText,
      startsAt: promotionStartsAt,
      endsAt: promotionEndsAt,
      durationDays,
      isActive,
      imageAlt,
    });

    return res.status(201).send(promotion);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).send({ message: 'Promotion not found' });
    }

    const allowedUpdates = [
      'title',
      'subtitle',
      'description',
      'badgeText',
      'buttonText',
      'isActive',
      'imageAlt',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        promotion[field] = req.body[field];
      }
    });

    if (req.body.startsAt !== undefined) {
      promotion.startsAt = new Date(req.body.startsAt);
    }

    if (req.body.durationDays !== undefined) {
      promotion.durationDays = req.body.durationDays;
    }

    if (req.body.startsAt !== undefined || req.body.durationDays !== undefined) {
      promotion.endsAt = calculateEndsAt(promotion.startsAt, promotion.durationDays);
    }

    const updatedPromotion = await promotion.save();

    return res.send(updatedPromotion);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).send({ message: 'Promotion not found' });
    }

    await deletePromotionImageFile(promotion.imageFilename);
    await promotion.deleteOne();

    return res.send({ message: 'Promotion deleted' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const replacePromotionImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).send({ message: 'Promotion image is required' });
    }

    const promotion = await Promotion.findById(id);

    if (!promotion) {
      await deletePromotionImageFile(req.file.filename);
      return res.status(404).send({ message: 'Promotion not found' });
    }

    await deletePromotionImageFile(promotion.imageFilename);

    promotion.imageFilename = req.file.filename;
    promotion.imageUrl = getPromotionImageUrl(req, req.file.filename);
    promotion.imageDeletedAt = null;

    const updatedPromotion = await promotion.save();

    return res.send(updatedPromotion);
  } catch (error) {
    if (req.file) {
      await deletePromotionImageFile(req.file.filename).catch(() => {});
    }

    return res.status(500).send({ message: error.message });
  }
};

const deletePromotionImage = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).send({ message: 'Promotion not found' });
    }

    await deletePromotionImageFile(promotion.imageFilename);

    promotion.imageUrl = '';
    promotion.imageFilename = '';
    promotion.imageDeletedAt = new Date();

    const updatedPromotion = await promotion.save();

    return res.send(updatedPromotion);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getActivePromotions,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  replacePromotionImage,
  deletePromotionImage,
};
