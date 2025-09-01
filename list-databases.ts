import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

async function listDatabases() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log('Bases de données existantes :');
    dbs.databases.forEach(db => console.log(' -', db.name));
  } catch (err) {
    console.error('Erreur lors de la récupération des bases :', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

listDatabases();
