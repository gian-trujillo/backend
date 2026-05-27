require('dotenv').config();

const mongoose = require('mongoose');

const Package = require('./models/packageModel');

const packages = [
  {
    label: 'I',
    title: 'Sesión Fotos',
    subtitle: 'Esencial',
    price: 1800,
    currency: 'MXN',
    priceNote: '/desde',
    details: [
      '2 horas de cobertura',
      '1 fotógrafo',
      '20+ fotos editadas',
      'Entrega en 5 días hábiles',
    ],
    buttonText: 'Reservar',
    selectValue: 'Sesión Fotos',
    order: 1,
  },
  {
    label: 'II',
    title: 'Sesión Video',
    subtitle: 'Cinemático',
    price: 3000,
    currency: 'MXN',
    priceNote: '/desde',
    details: [
      '3 horas de cobertura',
      'Cámara + estabilizador',
      'Reels de 1-2 min en 4K',
      'Música licenciada',
      'Entrega en 10 días hábiles',
    ],
    buttonText: 'Reservar',
    selectValue: 'Sesión Videos',
    order: 2,
  },
  {
    label: 'III',
    title: 'Fotos & Videos',
    subtitle: 'Combinado',
    price: 4500,
    currency: 'MXN',
    priceNote: '/desde',
    details: [
      '6 horas de cobertura',
      'Foto + video integrados',
      '50+ fotos editadas · 1 reel',
      'Tomas con drone',
      'Entrega en 15 días hábiles',
    ],
    buttonText: 'Reservar',
    selectValue: 'Fotos y videos',
    order: 3,
  },
  {
    label: 'IV',
    title: 'Cobertura Total',
    subtitle: 'Bodas y XV años',
    price: 8000,
    currency: 'MXN',
    priceNote: '/desde',
    details: [
      '10+ horas · día completo',
      '1 fotógrafo + 1 videógrafo',
      '100+ fotos · película larga',
      'Drone + sesión preboda',
      'Entrega en 20 días hábiles',
    ],
    buttonText: 'Reservar',
    selectValue: 'Cobertura total',
    order: 4,
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    const createPackagePromises = packages.map(async (pkg) => {
      const existingPackage = await Package.findOne({ order: pkg.order });

      if (!existingPackage) {
        await Package.create(pkg);
        console.log(`Created package: ${pkg.title}`);
      }
    });

    await Promise.all(createPackagePromises);

    console.log('Packages seeded');

    await mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
