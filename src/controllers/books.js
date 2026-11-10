import {
  getAuthorById as getAuthorByIdModel,
} from '../models/authors.js';
import {
  createBook as createBookModel,
  deleteBook as deleteBookModel,
  getAllBooks as getAllBooksModel,
  getBookById as getBookByIdModel,
  updateBook as updateBookModel,
} from '../models/books.js';

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isBookBody = (body) =>
  body &&
  typeof body === 'object' &&
  !Array.isArray(body) &&
  isNonEmptyString(body.id) &&
  isNonEmptyString(body.authorId) &&
  isNonEmptyString(body.title) &&
  isNonEmptyString(body.publicationDate);

const isBookUpdateBody = (body, id) =>
  body &&
  typeof body === 'object' &&
  !Array.isArray(body) &&
  isNonEmptyString(body.authorId) &&
  isNonEmptyString(body.title) &&
  isNonEmptyString(body.publicationDate) &&
  (body.id === undefined || body.id === id);

const isDuplicateKeyError = (error) => error?.code === 11000;

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
  const body = req.body;
  if (!isBookBody(body)) {
    return res.status(400).json({
      message: 'id, authorId, title, and publicationDate are required',
    });
  }

  const book = {
    id: body.id.trim(),
    authorId: body.authorId.trim(),
    title: body.title.trim(),
    publicationDate: body.publicationDate.trim(),
  };

  try {
    if (await getBookByIdModel(book.id)) {
      return res.status(400).json({ message: `Duplicate book id: ${book.id}` });
    }

    if (!(await getAuthorByIdModel(book.authorId))) {
      return res.status(400).json({
        message: `Author not found for authorId: ${book.authorId}`,
      });
    }

    const result = await createBookModel(book);
    return res.status(201).json(result);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(400).json({ message: `Duplicate book id: ${book.id}` });
    }

    console.error('Failed to create book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!isBookUpdateBody(body, id)) {
    return res.status(400).json({
      message: 'authorId, title, and publicationDate are required; id cannot be changed',
    });
  }

  try {
    if (!(await getBookByIdModel(id))) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const authorId = body.authorId.trim();
    if (!(await getAuthorByIdModel(authorId))) {
      return res.status(400).json({
        message: `Author not found for authorId: ${authorId}`,
      });
    }

    const result = await updateBookModel(id, {
      authorId,
      title: body.title.trim(),
      publicationDate: body.publicationDate.trim(),
    });
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
    const deleted = await deleteBookModel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
