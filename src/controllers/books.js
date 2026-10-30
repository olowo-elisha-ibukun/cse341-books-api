import { ObjectId } from 'mongodb';
import {
  createBook as createBookModel,
  deleteBook as deleteBookModel,
  getAllBooks as getAllBooksModel,
  getBookById as getBookByIdModel,
  updateBook as updateBookModel,
} from '../models/books.js';

export const getAllBooks = async (req, res) => {
  try {
    const result = await getAllBooksModel();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to retrieve books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const result = await getBookByIdModel(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to retrieve book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = { ...req.body };
    delete book._id;

    const result = await createBookModel(book);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Failed to create book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBook = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const updates = { ...req.body };
    delete updates._id;

    const result = await updateBookModel(req.params.id, updates);
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const deleted = await deleteBookModel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).json({});
  } catch (error) {
    console.error('Failed to delete book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};