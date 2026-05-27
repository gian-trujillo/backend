require('dotenv').config();

const mongoose = require('mongoose');

const Gallery = require('./models/galleryModel');

const categories = [
  'Eventos',
  'Retratos',
  'Paisajes',
  'Drone',
];

const layoutSlots = [
  'top-right-large',
  'top-left-large',
  'normal-1',
  'normal-2',
  'normal-3',
  'normal-4',
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const createSlotPromises = categories.flatMap((category) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      layoutSlots.map(async (layoutSlot) => {
        const existingSlot = await Gallery.findOne({ category, layoutSlot });

        if (!existingSlot) {
          await Gallery.create({
            title: `${category} ${layoutSlot}`,
            category,
            layoutSlot,
            mediaType: 'image',
            isEmpty: true,
          });

          console.log(`Created: ${category} - ${layoutSlot}`);
        }
      }));

    await Promise.all(createSlotPromises);

    console.log('Gallery slots seeded');

    await mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
