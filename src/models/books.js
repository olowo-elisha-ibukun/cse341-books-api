import { getDb } from '../db/connect.js';

const booksCollection = () => getDb().collection('books');

export const getAllBooks = async () => booksCollection().find().toArray();

export const getBookById = async (id) => booksCollection().findOne({ id });

export const createBook = async (book) => {
  const result = await booksCollection().insertOne(book);
  return { ...book, _id: result.insertedId };
};

export const updateBook = async (id, updates) => {
  const collection = booksCollection();
  const result = await collection.updateOne({ id }, { $set: updates });

  if (result.matchedCount === 0) {
    return null;
  }

  return collection.findOne({ id });
};

export const deleteBook = async (id) => {
  const result = await booksCollection().deleteOne({ id });
  return result.deletedCount > 0;
};
