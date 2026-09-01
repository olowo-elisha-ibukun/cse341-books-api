import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Books API',
    description: 'CSE341 Books API',
  },
  host: 'cse341-books-api.onrender.com',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/books.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);