import { IFilesService } from '../interfaces/IFilesService';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../logger/CustomLogger';
import { IFilesRepository } from '../../repositories/FilesRepository';
import { Archivo } from '../../models/Archivo';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';

// Definimos la carpeta. En Vercel esto apuntará a una ruta de solo lectura,
// pero no intentaremos escribir en ella si detectamos el entorno.
const destFolder = path.join(process.cwd(), 'src', 'assets', 'uploads');

// SOLUCIÓN 1: Solo intentamos crear la carpeta si NO estamos en Vercel
if (process.env.VERCEL !== '1') {
  if (!fs.existsSync(destFolder)) {
    try {
      fs.mkdirSync(destFolder, { recursive: true });
    } catch (error) {
      console.warn('No se pudo crear carpeta uploads (normal en ciertos entornos):', error);
    }
  }
}

@injectable()
export class FilesService implements IFilesService {
  private readonly _filesRepository: IFilesRepository;

  constructor(@inject(TYPES.FilesRepository) repository: IFilesRepository) {
    this._filesRepository = repository;
  }

  public async almacenarArchivo(file: Express.Multer.File): Promise<{ nombreArchivo: string; fileId: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        // Genera un nombre único para el archivo
        const nombreUnico = `${uuidv4()}_${file.originalname}`;

        // En local usamos la carpeta real. En Vercel usamos una ruta ficticia o /tmp
        // para que la base de datos tenga algo guardado en el campo "ruta".
        const filePath = process.env.VERCEL === '1' ? path.join('/tmp', nombreUnico) : path.join(destFolder, nombreUnico);

        // SOLUCIÓN 2: Solo escribimos en disco si NO estamos en Vercel
        if (process.env.VERCEL !== '1') {
          await fs.promises.writeFile(filePath, file.buffer as Uint8Array);
        } else {
          // Si estamos en Vercel, solo logueamos (Simulamos la subida)
          // NOTA: El archivo NO se guarda físicamente, pero el proceso no falla.
          logger.warn(`[Vercel] Omitiendo escritura en disco para ${nombreUnico}. Sistema de archivos es Read-Only.`);
        }

        // Crea una instancia de Archivo (Metadata)
        const archivo = new Archivo();
        archivo.nombre = nombreUnico;
        archivo.ruta = filePath; // Guardamos la ruta aunque el archivo no exista físicamente en Vercel
        archivo.tamano = file.size;
        archivo.tipo = file.mimetype;
        archivo.fechaSubida = new Date();

        // Pasar la instancia de Archivo al repositorio para ser guardado en BD
        const fileRecord = await this._filesRepository.insertarArchivo(archivo);

        resolve({ nombreArchivo: nombreUnico, fileId: fileRecord.id });
      } catch (error) {
        logger.error('Error al guardar archivo: ' + error);
        reject(new Error('Error al guardar el archivo.'));
      }
    });
  }

  public async recuperarArchivo(nombreOriginal: string): Promise<Buffer | null> {
    const nombreUnico = await this._filesRepository.obtenerArchivoPorNombreOriginal(nombreOriginal);

    if (!nombreUnico) {
      throw new Error('Archivo no encontrado en BD.');
    }

    // Manejo de descarga en Vercel
    if (process.env.VERCEL === '1') {
      logger.warn('Intento de descarga en Vercel: El archivo no existe físicamente.');
      // Retornamos null o un buffer vacío para que no explote
      return null;
    }

    return new Promise((resolve, reject) => {
      const filePath = path.join(destFolder, nombreUnico);

      // Verificamos si existe antes de leer para evitar crash
      if (!fs.existsSync(filePath)) {
        logger.error(`El archivo físico no existe: ${filePath}`);
        return reject('El archivo físico no se encuentra en el servidor.');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          logger.error(`Error al recuperar archivo: ${err}`);
          reject('Error al leer el archivo.');
        } else {
          resolve(data);
        }
      });
    });
  }
}
