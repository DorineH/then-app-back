const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/thenapp');

const run = async () => {
  await mongoose.connection.collection('favorites').deleteMany({});
  console.log('Tous les favoris supprimés');
  process.exit();
};

run();
