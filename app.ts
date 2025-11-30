import 'reflect-metadata';
import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import { checkSchema, validationResult } from 'express-validator';
import { logger } from './src/logger/CustomLogger';
import { connectDatabase } from './src/data/db';
import cors from 'cors';
import { authenticateToken } from './middlewares/AuthValidator';
import { requireAdminRole } from './middlewares/RolValidator';
import PoolDb from './src/data/db';

// create express app
export const app = express();
app.use(bodyParser.json({ limit: '200mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

// Health check endpoint - debe estar antes de los middlewares de autenticación
// Nos sirve para verifica si el server esta correctamente levantantado y escuchando.
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Verificar conexión a la base de datos
    const client = await PoolDb.connect();
    client.release();
    res.status(200).json({
      status: 'ok',
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      message: 'Servidor con problemas',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Middleware para autenticar el token
app.use(authenticateToken);

// Middleware para verificar roles de administrador
app.use(requireAdminRole);

// register all application routes
AppRoutes.forEach((route) => {
  const middlewares = route.middleware || [];

  app.use(route.path, ...middlewares, checkSchema(route.schema), (request: Request, response: Response, next: Function) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.json(validationResult(request).array());
    }
    route
      .action(request, response)
      .then(() => next)
      .catch((err: any) => next(err));
  });
});

const startServer = async () => {
  const PORT = process.env.PORT || 8080;
  await app.listen(PORT, () => {
    logger.info(`Server running on http://127.0.0.1:${PORT}`);
  });
};

// Solo iniciar el servidor si no estamos en Vercel
// Vercel manejará el servidor automáticamente
if (process.env.VERCEL !== '1') {
  (async () => {
    connectDatabase();
    await startServer();
  })();
}
