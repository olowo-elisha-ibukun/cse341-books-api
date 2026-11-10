import swaggerAutogen from 'swagger-autogen';

const isProduction = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'Books API',
    description: 'CSE341 Books API'
  },
  host: isProduction ? 'cse341-books-api-1.onrender.com' : 'localhost:3000',
  schemes: [isProduction ? 'https' : 'http'],
  definitions: {
    Book: {
      id: 'b1',
      authorId: 'a1',
      title: 'The Hobbit',
      publicationDate: '1937-09-21'
    },
    BookUpdate: {
      authorId: 'a1',
      title: 'The Hobbit',
      publicationDate: '1937-09-21'
    },
    Author: {
      id: 'a1',
      name: 'J.R.R. Tolkien',
      birthYear: 1892
    },
    AuthorUpdate: {
      name: 'J.R.R. Tolkien',
      birthYear: 1892
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js', './src/router.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);