import pino from 'pino';

// Detectamos si estamos en desarrollo local
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  // AQUÍ ESTÁ EL TRUCO:
  // Si estamos en producción (Vercel), transport es undefined (usa JSON nativo rápido).
  // Si estamos en local, usa pino-pretty para que se vea bonito.
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined
});
