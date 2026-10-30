import express from 'express';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from './controllers/books.js';

const router = express.Router();

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

export default router;
