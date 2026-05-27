const Package = require('../models/packageModel');

const getPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ order: 1 });

    return res.send(packages);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedUpdates = [
      'label',
      'title',
      'subtitle',
      'price',
      'currency',
      'priceNote',
      'details',
      'buttonText',
      'selectValue',
    ];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPackage) {
      return res.status(404).send({ message: 'Package not found' });
    }

    return res.send(updatedPackage);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getPackages,
  updatePackage,
};
