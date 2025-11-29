import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { EstadisticasService } from '../services/implementations/EstadisticasService';
import { FiltroEstadisticas } from '../models/comandos/FiltroEstadisticas';

const _estadisticasService = container.get<EstadisticasService>(TYPES.EstadisticasService);

/**
 * Obtiene ventas agrupadas por forma de pago
 */
export async function obtenerVentasPorFormaPago(request: Request, response: Response): Promise<Response> {
  const filtros: FiltroEstadisticas = request.body;

  return _estadisticasService
    .obtenerVentasPorFormaPago(filtros)
    .then((result) => {
      return response.status(HttpCodes.OK).json(result);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

/**
 * Obtiene ventas agrupadas por categoría
 */
export async function obtenerVentasPorCategoria(request: Request, response: Response): Promise<Response> {
  const filtros: FiltroEstadisticas = request.body;

  return _estadisticasService
    .obtenerVentasPorCategoria(filtros)
    .then((result) => {
      return response.status(HttpCodes.OK).json(result);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

/**
 * Obtiene ventas agrupadas por hora del día
 */
export async function obtenerVentasPorHora(request: Request, response: Response): Promise<Response> {
  const filtros: FiltroEstadisticas = request.body;

  return _estadisticasService
    .obtenerVentasPorHora(filtros)
    .then((result) => {
      return response.status(HttpCodes.OK).json(result);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

/**
 * Obtiene ventas agrupadas por empleado
 */
export async function obtenerVentasPorEmpleado(request: Request, response: Response): Promise<Response> {
  const filtros: FiltroEstadisticas = request.body;

  return _estadisticasService
    .obtenerVentasPorEmpleado(filtros)
    .then((result) => {
      return response.status(HttpCodes.OK).json(result);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

/**
 * Obtiene ventas agrupadas por cliente
 */
export async function obtenerVentasPorCliente(request: Request, response: Response): Promise<Response> {
  const filtros: FiltroEstadisticas = request.body;

  return _estadisticasService
    .obtenerVentasPorCliente(filtros)
    .then((result) => {
      return response.status(HttpCodes.OK).json(result);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const EstadisticasController = {
  obtenerVentasPorFormaPago,
  obtenerVentasPorCategoria,
  obtenerVentasPorHora,
  obtenerVentasPorEmpleado,
  obtenerVentasPorCliente
};
