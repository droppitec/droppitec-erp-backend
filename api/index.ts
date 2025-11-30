import { app } from '../app';
import { connectDatabase } from '../src/data/db';

// Conectar a la base de datos cuando se inicializa la función
connectDatabase().catch((err) => {
  console.error('Error connecting to database:', err);
});

// Exportar el app de Express para Vercel
export default app;
