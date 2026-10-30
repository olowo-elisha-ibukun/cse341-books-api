import { MongoClient } from 'mongodb';

let db;

export const connectToDb = async () => {
  if (db) {
    return db;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
  } catch (error) {
    await client.close();
    throw error;
  }

  db = client.db('cse341-books-db');
  console.log('Connected to MongoDB Atlas successfully.');
  return db;
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};