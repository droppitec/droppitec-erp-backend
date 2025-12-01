import { app } from '../app';
import { connectDatabase } from '../src/data/db';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Esta variable cacheará la conexión para que no se reconecte en cada petición (cold start vs warm start)
let isConnected = false;

export default async (req: VercelRequest, res: VercelResponse) => {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
      console.log('DB Connected in Serverless');
    } catch (error) {
      console.error('Error connecting to database:', error);
      return res.status(500).send('Database connection error');
    }
  }

  // Pasamos el request a la app de Express
  app(req, res);
};
