import express from 'express';
import router from './src/router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json' with { type: 'json' };

const app = express();

app.use(express.json());
app.get('/', (req, res) =>
  res.json({ message: 'Welcome to the CSE341 Books API!' }),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', router);

export default app;
