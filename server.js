import app from './app.js';
import { connectToDb } from './src/db/connect.js';

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`Server is running and listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exitCode = 1;
  }
};

startServer();