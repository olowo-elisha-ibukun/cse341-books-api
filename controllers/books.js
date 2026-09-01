import { getDb } from '../db/connect.js';

export const getAllBooks = async (req, res) => {
  try {
    const result = await getDb().collection('books').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const result = await getDb().collection('books').findOne({ id: bookId });
    res.setHeader('Content-Type', 'application/json');
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};