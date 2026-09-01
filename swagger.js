import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Books API',
    description: 'CSE341 Books API',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/books.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);