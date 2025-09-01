import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://then-user:BzgI6wWFEa7xMDDg@then-cluster.ywe405e.mongodb.net/';
const DB_NAME = process.env.DB_NAME || 'thenapp';

async function resetDatabase() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log(`Suppression de la base de données : ${DB_NAME}`);
    await db.dropDatabase();
    console.log('Base de données supprimée avec succès.');
  } catch (err) {
    console.error('Erreur lors de la suppression de la base :', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

resetDatabase();
