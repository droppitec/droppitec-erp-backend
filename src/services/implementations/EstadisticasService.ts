import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IEstadisticasService } from '../interfaces/IEstadisticasService';
import { IEstadisticasRepository } from '../../repositories/EstadisticasRepository';
import { FiltroEstadisticas } from '../../models/comandos/FiltroEstadisticas';
import { VentasPorFormaPago } from '../../models/comandos/VentasPorFormaPago';
import { VentasPorCategoria } from '../../models/comandos/VentasPorCategoria';
import { VentasPorHora } from '../../models/comandos/VentasPorHora';
import { VentasPorEmpleado } from '../../models/comandos/VentasPorEmpleado';
import { VentasPorCliente } from '../../models/comandos/VentasPorCliente';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a las estadísticas de ventas
 */
@injectable()
export class EstadisticasService implements IEstadisticasService {
  private readonly _estadisticasRepository: IEstadisticasRepository;

  constructor(@inject(TYPES.EstadisticasRepository) repository: IEstadisticasRepository) {
    this._estadisticasRepository = repository;
  }

  public async obtenerVentasPorFormaPago(filtros: FiltroEstadisticas): Promise<VentasPorFormaPago[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._estadisticasRepository.obtenerVentasPorFormaPago(filtros);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerVentasPorCategoria(filtros: FiltroEstadisticas): Promise<VentasPorCategoria[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._estadisticasRepository.obtenerVentasPorCategoria(filtros);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerVentasPorHora(filtros: FiltroEstadisticas): Promise<VentasPorHora[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._estadisticasRepository.obtenerVentasPorHora(filtros);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerVentasPorEmpleado(filtros: FiltroEstadisticas): Promise<VentasPorEmpleado[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._estadisticasRepository.obtenerVentasPorEmpleado(filtros);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerVentasPorCliente(filtros: FiltroEstadisticas): Promise<VentasPorCliente[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._estadisticasRepository.obtenerVentasPorCliente(filtros);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
