import express from 'express';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from './controllers/books.js';
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
} from './controllers/authors.js';

const router = express.Router();

router.get('/books', (req, res) => {
  /*
   #swagger.tags = ['Books']
   #swagger.summary = 'Get all books'
   #swagger.responses[200] = {
     description: 'Books retrieved successfully, including each authorId',
     schema: [{ id: 'b1', authorId: 'a1', title: 'The Hobbit', publicationDate: '1937-09-21' }]
   }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return getAllBooks(req, res);
});

router.get('/books/:id', (req, res) => {
  /*
   #swagger.tags = ['Books']
   #swagger.summary = 'Get a book by ID'
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Book ID' }
   #swagger.responses[200] = {
     description: 'Book retrieved successfully, including its authorId',
     schema: { id: 'b1', authorId: 'a1', title: 'The Hobbit', publicationDate: '1937-09-21' }
   }
   #swagger.responses[404] = { description: 'Book not found' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return getBookById(req, res);
});

router.post('/books', (req, res) => {
  /*
   #swagger.tags = ['Books']
   #swagger.summary = 'Create a book'
   #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     description: 'All fields are required. authorId must match an existing author.',
     schema: { $ref: '#/definitions/Book' }
   }
   #swagger.responses[201] = {
     description: 'Book created successfully',
     schema: { id: 'b1', authorId: 'a1', title: 'The Hobbit', publicationDate: '1937-09-21' }
   }
   #swagger.responses[400] = { description: 'Missing required fields, duplicate book ID, or authorId does not exist' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return createBook(req, res);
});

router.put('/books/:id', (req, res) => {
  /*
   #swagger.tags = ['Books']
   #swagger.summary = 'Update a book'
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Book ID' }
   #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     description: 'authorId, title, and publicationDate are required. authorId must match an existing author. The ID is supplied by the path.',
     schema: { $ref: '#/definitions/BookUpdate' }
   }
   #swagger.responses[200] = {
     description: 'Book updated successfully',
     schema: { id: 'b1', authorId: 'a1', title: 'The Hobbit', publicationDate: '1937-09-21' }
   }
   #swagger.responses[400] = { description: 'Missing required fields or authorId does not exist' }
   #swagger.responses[404] = { description: 'Book not found' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return updateBook(req, res);
});

router.delete('/books/:id', (req, res) => {
  /*
   #swagger.tags = ['Books']
   #swagger.summary = 'Delete a book'
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Book ID' }
   #swagger.responses[204] = { description: 'Book deleted; response has no content' }
   #swagger.responses[404] = { description: 'Book not found' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return deleteBook(req, res);
});

router.get('/authors', (req, res) => {
  /*
   #swagger.tags = ['Authors']
   #swagger.summary = 'Get all authors'
   #swagger.responses[200] = {
     description: 'Authors retrieved successfully',
     schema: [{ id: 'a1', name: 'J.R.R. Tolkien', birthYear: 1892 }]
   }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return getAllAuthors(req, res);
});

router.get('/authors/:id', (req, res) => {
  /*
   #swagger.tags = ['Authors']
   #swagger.summary = 'Get an author by ID'
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Author ID' }
   #swagger.responses[200] = {
     description: 'Author retrieved successfully',
     schema: { id: 'a1', name: 'J.R.R. Tolkien', birthYear: 1892 }
   }
   #swagger.responses[404] = { description: 'Author not found' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return getAuthorById(req, res);
});

router.post('/authors', (req, res) => {
  /*
   #swagger.tags = ['Authors']
   #swagger.summary = 'Create an author'
   #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     description: 'Required fields: id, name, and birthYear.',
     schema: { $ref: '#/definitions/Author' }
   }
   #swagger.responses[201] = {
     description: 'Author created successfully',
     schema: { id: 'a1', name: 'J.R.R. Tolkien', birthYear: 1892 }
   }
   #swagger.responses[400] = { description: 'Missing required fields or duplicate author ID' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return createAuthor(req, res);
});

router.put('/authors/:id', (req, res) => {
  /*
   #swagger.tags = ['Authors']
   #swagger.summary = 'Update an author'
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Author ID' }
   #swagger.parameters['body'] = {
     in: 'body',
     required: true,
     description: 'Required fields: name and birthYear. The author ID cannot be changed.',
     schema: { $ref: '#/definitions/AuthorUpdate' }
   }
   #swagger.responses[200] = {
     description: 'Author updated successfully',
     schema: { id: 'a1', name: 'J.R.R. Tolkien', birthYear: 1892 }
   }
   #swagger.responses[400] = { description: 'Missing or invalid required fields' }
   #swagger.responses[404] = { description: 'Author not found' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return updateAuthor(req, res);
});

router.delete('/authors/:id', (req, res) => {
  /*
   #swagger.tags = ['Authors']
   #swagger.summary = 'Delete an author'
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Author ID' }
   #swagger.responses[204] = { description: 'Author deleted; response has no content' }
   #swagger.responses[404] = { description: 'Author not found' }
   #swagger.responses[409] = { description: 'Author cannot be deleted while books reference them' }
   #swagger.responses[500] = { description: 'Internal server error' }
  */
  return deleteAuthor(req, res);
});

export default router;
