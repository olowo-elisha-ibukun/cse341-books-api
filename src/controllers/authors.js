import {
  authorHasBooks as authorHasBooksModel,
  createAuthor as createAuthorModel,
  deleteAuthor as deleteAuthorModel,
  getAllAuthors as getAllAuthorsModel,
  getAuthorById as getAuthorByIdModel,
  updateAuthor as updateAuthorModel,
} from '../models/authors.js';

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isValidBirthYear = (value) =>
  typeof value === 'number' && Number.isFinite(value);

const isDuplicateKeyError = (error) => error?.code === 11000;

export const getAllAuthors = async (req, res) => {
  try {
    const result = await getAllAuthorsModel();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to retrieve authors:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    const result = await getAuthorByIdModel(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to retrieve author:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createAuthor = async (req, res) => {
  const body = req.body;
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    !isNonEmptyString(body.id) ||
    !isNonEmptyString(body.name) ||
    !isValidBirthYear(body.birthYear)
  ) {
    return res.status(400).json({ message: 'id, name, and numeric birthYear are required' });
  }

  try {
    const author = {
      id: body.id.trim(),
      name: body.name.trim(),
      birthYear: body.birthYear,
    };

    if (await getAuthorByIdModel(author.id)) {
      return res.status(400).json({ message: `Duplicate author id: ${author.id}` });
    }

    const result = await createAuthorModel(author);
    return res.status(201).json(result);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(400).json({ message: `Duplicate author id: ${body.id.trim()}` });
    }

    console.error('Failed to create author:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAuthor = async (req, res) => {
  const body = req.body;
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    !isNonEmptyString(body.name) ||
    !isValidBirthYear(body.birthYear) ||
    (body.id !== undefined && body.id !== req.params.id)
  ) {
    return res.status(400).json({ message: 'name and numeric birthYear are required; id cannot be changed' });
  }

  try {
    const result = await updateAuthorModel(req.params.id, {
      name: body.name.trim(),
      birthYear: body.birthYear,
    });

    if (!result) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update author:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAuthor = async (req, res) => {
  try {
    const author = await getAuthorByIdModel(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (await authorHasBooksModel(req.params.id)) {
      return res.status(409).json({
        message: 'Cannot delete author: books still reference this author',
      });
    }

    const deleted = await deleteAuthorModel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete author:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
