import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { AppRoutes } from './routes';
import { checkSchema, validationResult } from 'express-validator';
import { logger } from './src/logger/CustomLogger';
import { connectDatabase } from './src/data/db';
import cors from 'cors';
import PoolDb from './src/data/db';

// Imports de middlewares (asegúrate de usarlos DENTRO de tus rutas en AppRoutes, no globalmente)
import { authenticateToken } from './middlewares/AuthValidator';
// import { requireAdminRole } from './middlewares/RolValidator';

export const app = express();

// 1. Configuración Básica
// Express moderno ya trae body-parser.
// NOTA: Vercel tiene un límite de request body de 4.5MB.
// Configurar esto a 200mb no funcionará en Vercel Serverless (AWS Lambda limitations).
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configura CORS para aceptar peticiones de tu frontend
app.use(cors());

// 2. Health Check (Ruta Pública)
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Verificación rápida de conexión (sin detener el hilo principal mucho tiempo)
    const client = await PoolDb.connect();
    client.release();

    res.status(200).json({
      status: 'ok',
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    logger.error(`Health Check Failed: ${error.message}`);
    res.status(503).json({
      status: 'error',
      message: 'Error de conexión a BD',
      error: error.message
    });
  }
});

// 3. Registro de Rutas
AppRoutes.forEach((route) => {
  // Combinamos los middlewares específicos de la ruta
  const middlewares = route.middleware || [];

  app.use(route.path, ...middlewares, checkSchema(route.schema), async (request: Request, response: Response, next: NextFunction) => {
    // Validación de express-validator
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      // Ejecutamos la acción y manejamos promesas
      await route.action(request, response);
    } catch (err) {
      next(err);
    }
  });
});

// 4. Global Error Handler (Para capturar crashes inesperados)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled Error: ${err.message}`, err);

  // Si el header ya se envió, delegar a Express
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 5. Servidor Local (Solo corre si NO estamos en Vercel)
const startServer = async () => {
  const PORT = process.env.PORT || 8080;
  try {
    await connectDatabase(); // Conectar DB antes de escuchar
    app.listen(PORT, () => {
      logger.info(`Server running locally on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start local server', error);
  }
};

if (process.env.VERCEL !== '1') {
  startServer();
}
