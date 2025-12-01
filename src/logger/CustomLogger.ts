import { createLogger, format, transports } from 'winston';

// Definimos los transportes (lugares donde se guardan los logs)
const logTransports = [];

// 1. Siempre agregar Console (Para ver los logs en Vercel y en tu terminal local)
logTransports.push(
  new transports.Console({
    format: format.combine(format.colorize(), format.simple())
  })
);

// 2. Solo agregar archivo si NO estamos en Vercel
// Vercel define la variable de entorno 'VERCEL' automáticamente
if (process.env.VERCEL !== '1') {
  logTransports.push(
    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  );
  logTransports.push(
    new transports.File({
      filename: 'logs/combined.log'
    })
  );
}

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: logTransports
});
