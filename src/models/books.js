import { ObjectId } from 'mongodb';
import { getDb } from '../db/connect.js';

const booksCollection = () => getDb().collection('books');

export const getAllBooks = async () => booksCollection().find().toArray();

export const getBookById = async (id) =>
  booksCollection().findOne({ _id: new ObjectId(id) });

export const createBook = async (book) => {
  const result = await booksCollection().insertOne(book);
  return { ...book, _id: result.insertedId };
};

export const updateBook = async (id, updates) => {
  const collection = booksCollection();
  const objectId = new ObjectId(id);
  const result = await collection.updateOne(
    { _id: objectId },
    { $set: updates },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return collection.findOne({ _id: objectId });
};

export const deleteBook = async (id) => {
  const result = await booksCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};
