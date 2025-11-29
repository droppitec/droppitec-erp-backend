import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { FiltroEstadisticas } from '../models/comandos/FiltroEstadisticas';
import { VentasPorFormaPago } from '../models/comandos/VentasPorFormaPago';
import { VentasPorCategoria } from '../models/comandos/VentasPorCategoria';
import { VentasPorHora } from '../models/comandos/VentasPorHora';
import { VentasPorEmpleado } from '../models/comandos/VentasPorEmpleado';
import { VentasPorCliente } from '../models/comandos/VentasPorCliente';

/**
 * Interfaz del repositorio de Estadísticas
 */
export interface IEstadisticasRepository {
  obtenerVentasPorFormaPago(filtros: FiltroEstadisticas): Promise<VentasPorFormaPago[]>;
  obtenerVentasPorCategoria(filtros: FiltroEstadisticas): Promise<VentasPorCategoria[]>;
  obtenerVentasPorHora(filtros: FiltroEstadisticas): Promise<VentasPorHora[]>;
  obtenerVentasPorEmpleado(filtros: FiltroEstadisticas): Promise<VentasPorEmpleado[]>;
  obtenerVentasPorCliente(filtros: FiltroEstadisticas): Promise<VentasPorCliente[]>;
}

/**
 * Repositorio de consultas de estadísticas
 */
@injectable()
export class EstadisticasRepository implements IEstadisticasRepository {
  /**
   * Construye la cláusula WHERE y JOINs necesarios para los filtros
   */
  private construirWhereClause(filtros: FiltroEstadisticas): { where: string; joins: string[]; params: any[] } {
    const condiciones: string[] = [];
    const joins: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Siempre excluir ventas anuladas (anulada es integer 0/1 en la BD)
    condiciones.push('v.anulada = 0');

    // Filtro por fecha desde
    if (filtros.fechaDesde) {
      condiciones.push(`v.fechaventa >= $${paramIndex}`);
      params.push(filtros.fechaDesde);
      paramIndex++;
    }

    // Filtro por fecha hasta
    if (filtros.fechaHasta) {
      condiciones.push(`v.fechaventa <= $${paramIndex}`);
      params.push(filtros.fechaHasta);
      paramIndex++;
    }

    // Si no hay fechas, usar último mes por defecto
    if (!filtros.fechaDesde && !filtros.fechaHasta) {
      condiciones.push(`v.fechaventa >= CURRENT_DATE - INTERVAL '1 month'`);
    }

    // Filtro por forma de pago
    if (filtros.formaDePago && filtros.formaDePago.trim() !== '') {
      joins.push('INNER JOIN PUBLIC.FORMA_DE_PAGO fp ON v.idformadepago = fp.idformadepago');
      condiciones.push(`fp.nformadepago = $${paramIndex}`);
      params.push(filtros.formaDePago);
      paramIndex++;
    }

    // Filtro por categoría
    if (filtros.categoria && filtros.categoria.trim() !== '') {
      joins.push('INNER JOIN PUBLIC.DETALLE_VENTA dv_cat ON v.idventa = dv_cat.idventa');
      joins.push('INNER JOIN PUBLIC.PRODUCTO p_cat ON dv_cat.idproducto = p_cat.idproducto');
      joins.push('INNER JOIN PUBLIC.TIPO_PRODUCTO tp ON p_cat.idtipoproducto = tp.idtipoproducto');
      condiciones.push(`tp.ntipoproducto = $${paramIndex}`);
      params.push(filtros.categoria);
      paramIndex++;
    }

    // Filtro por empleado
    if (filtros.idEmpleado) {
      condiciones.push(`v.idempleado = $${paramIndex}`);
      params.push(filtros.idEmpleado);
      paramIndex++;
    }

    return {
      where: condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '',
      joins: joins,
      params
    };
  }

  /**
   * Obtiene ventas agrupadas por forma de pago
   */
  async obtenerVentasPorFormaPago(filtros: FiltroEstadisticas): Promise<VentasPorFormaPago[]> {
    const client = await PoolDb.connect();
    const { where, joins, params } = this.construirWhereClause(filtros);

    try {
      // Siempre necesitamos el JOIN con FORMA_DE_PAGO para obtener el nombre
      const joinsNecesarios = joins.some((j) => j.includes('FORMA_DE_PAGO')) ? joins : ['INNER JOIN PUBLIC.FORMA_DE_PAGO fp ON v.idformadepago = fp.idformadepago', ...joins];

      const query = `
        SELECT 
          fp.nformadepago AS "formaPago",
          COALESCE(SUM(v.montototal), 0) AS total
        FROM venta v
        ${joinsNecesarios.join('\n        ')}
        ${where}
        GROUP BY fp.nformadepago
        ORDER BY total DESC
      `;

      const res = await client.query(query, params);
      return res.rows.map((row) => ({
        formaPago: row.formaPago,
        total: parseFloat(row.total) || 0
      }));
    } catch (err) {
      logger.error('Error al obtener ventas por forma de pago: ' + err);
      throw new Error('Error al obtener ventas por forma de pago.');
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene ventas agrupadas por categoría
   */
  async obtenerVentasPorCategoria(filtros: FiltroEstadisticas): Promise<VentasPorCategoria[]> {
    const client = await PoolDb.connect();
    const { where, joins, params } = this.construirWhereClause(filtros);

    try {
      // Siempre necesitamos los JOINs con DETALLE_VENTA, PRODUCTO y TIPO_PRODUCTO
      const joinsBase = [
        'INNER JOIN PUBLIC.DETALLE_VENTA dv ON v.idventa = dv.idventa',
        'INNER JOIN PUBLIC.PRODUCTO p ON dv.idproducto = p.idproducto',
        'INNER JOIN PUBLIC.TIPO_PRODUCTO tp ON p.idtipoproducto = tp.idtipoproducto'
      ];

      // Si ya tenemos JOINs de categoría en los filtros, los removemos para evitar duplicados
      const joinsFiltros = joins.filter((j) => !j.includes('TIPO_PRODUCTO') && !j.includes('DETALLE_VENTA') && !j.includes('PRODUCTO'));

      // Combinar todos los JOINs necesarios
      const joinsNecesarios = [...joinsFiltros, ...joinsBase];

      const query = `
        SELECT 
          tp.ntipoproducto AS categoria,
          COALESCE(SUM(dv.subtotalventa), 0) AS total
        FROM venta v
        ${joinsNecesarios.length > 0 ? joinsNecesarios.join('\n        ') : ''}
        ${where}
        GROUP BY tp.ntipoproducto
        ORDER BY total DESC
      `;

      const res = await client.query(query, params);
      return res.rows.map((row) => ({
        categoria: row.categoria,
        total: parseFloat(row.total) || 0
      }));
    } catch (err) {
      logger.error('Error al obtener ventas por categoría: ' + err);
      throw new Error('Error al obtener ventas por categoría.');
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene ventas agrupadas por hora del día
   */
  async obtenerVentasPorHora(filtros: FiltroEstadisticas): Promise<VentasPorHora[]> {
    const client = await PoolDb.connect();
    const { where, joins, params } = this.construirWhereClause(filtros);

    try {
      const query = `
        SELECT 
          TO_CHAR(v.fechaventa, 'HH24:00') AS hora,
          COALESCE(SUM(v.montototal), 0) AS total
        FROM venta v
        ${joins.length > 0 ? joins.join('\n        ') : ''}
        ${where}
        GROUP BY TO_CHAR(v.fechaventa, 'HH24:00')
        ORDER BY hora ASC
      `;

      const res = await client.query(query, params);
      const ventasPorHora = res.rows.map((row) => ({
        hora: row.hora,
        total: parseFloat(row.total) || 0
      }));

      // Generar todas las horas del día (0-23) y completar con 0 si no hay ventas
      const todasLasHoras: VentasPorHora[] = [];
      for (let i = 0; i < 24; i++) {
        const horaStr = `${i.toString().padStart(2, '0')}:00`;
        const ventaExistente = ventasPorHora.find((v) => v.hora === horaStr);
        todasLasHoras.push({
          hora: horaStr,
          total: ventaExistente ? ventaExistente.total : 0
        });
      }

      return todasLasHoras;
    } catch (err) {
      logger.error('Error al obtener ventas por hora: ' + err);
      throw new Error('Error al obtener ventas por hora.');
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene ventas agrupadas por empleado
   */
  async obtenerVentasPorEmpleado(filtros: FiltroEstadisticas): Promise<VentasPorEmpleado[]> {
    const client = await PoolDb.connect();
    const { where, joins, params } = this.construirWhereClause(filtros);

    try {
      // Siempre necesitamos el JOIN con USUARIO para obtener el nombre
      const joinsNecesarios = ['INNER JOIN PUBLIC.USUARIO u ON v.idempleado = u.idusuario', ...joins];

      const query = `
        SELECT 
          v.idempleado AS "idEmpleado",
          COALESCE(u.nombre || ' ' || u.apellido, u.nombre, u.nusuario, 'Sin nombre') AS "nombreCompleto",
          COALESCE(SUM(v.montototal), 0) AS total
        FROM venta v
        ${joinsNecesarios.join('\n        ')}
        ${where}
        GROUP BY v.idempleado, u.nombre, u.apellido, u.nusuario
        ORDER BY total DESC
      `;

      const res = await client.query(query, params);
      return res.rows.map((row) => ({
        idEmpleado: parseInt(row.idEmpleado),
        nombreCompleto: row.nombreCompleto || 'Sin nombre',
        total: parseFloat(row.total) || 0
      }));
    } catch (err) {
      logger.error('Error al obtener ventas por empleado: ' + err);
      throw new Error('Error al obtener ventas por empleado.');
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene ventas agrupadas por cliente
   */
  async obtenerVentasPorCliente(filtros: FiltroEstadisticas): Promise<VentasPorCliente[]> {
    const client = await PoolDb.connect();
    const { where, joins, params } = this.construirWhereClause(filtros);

    try {
      // Siempre necesitamos el LEFT JOIN con USUARIO para obtener el nombre del cliente
      const joinsNecesarios = ['LEFT JOIN PUBLIC.USUARIO u ON v.idusuario = u.idusuario', ...joins];

      const query = `
        SELECT 
          v.idusuario AS "idCliente",
          CASE 
            WHEN u.nombre IS NOT NULL AND u.apellido IS NOT NULL THEN u.nombre || ' ' || u.apellido
            WHEN u.nombre IS NOT NULL THEN u.nombre
            WHEN u.nusuario IS NOT NULL THEN u.nusuario
            ELSE 'Cliente ' || v.idusuario::text
          END AS "nombreCompleto",
          COALESCE(SUM(v.montototal), 0) AS total
        FROM venta v
        ${joinsNecesarios.join('\n        ')}
        ${where}
        GROUP BY v.idusuario, u.nombre, u.apellido, u.nusuario
        ORDER BY total DESC
      `;

      const res = await client.query(query, params);
      return res.rows.map((row) => ({
        idCliente: parseInt(row.idCliente) || 0,
        nombreCompleto: row.nombreCompleto || 'Cliente sin nombre',
        total: parseFloat(row.total) || 0
      }));
    } catch (err) {
      logger.error('Error al obtener ventas por cliente: ' + err);
      throw new Error('Error al obtener ventas por cliente.');
    } finally {
      client.release();
    }
  }
}
