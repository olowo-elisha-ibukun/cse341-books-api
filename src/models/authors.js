import { getDb } from '../db/connect.js';

const authorsCollection = () => getDb().collection('authors');

export const getAllAuthors = async () => authorsCollection().find().toArray();

export const getAuthorById = async (id) =>
  authorsCollection().findOne({ id });

export const createAuthor = async (author) => {
  const result = await authorsCollection().insertOne(author);
  return { ...author, _id: result.insertedId };
};

export const updateAuthor = async (id, author) => {
  const collection = authorsCollection();
  const result = await collection.updateOne({ id }, { $set: author });

  if (result.matchedCount === 0) {
    return null;
  }

  return collection.findOne({ id });
};

export const deleteAuthor = async (id) => {
  const result = await authorsCollection().deleteOne({ id });
  return result.deletedCount > 0;
};

export const authorHasBooks = async (id) =>
  Boolean(await getDb().collection('books').findOne({ authorId: id }, {
    projection: { _id: 1 },
  }));
