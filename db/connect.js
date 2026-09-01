import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let _db;

export const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client.db('cse341-books-db');
      console.log('Connected to MongoDB Atlas successfully.');
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

export const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};