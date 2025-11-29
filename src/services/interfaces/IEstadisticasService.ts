import { FiltroEstadisticas } from '../../models/comandos/FiltroEstadisticas';
import { VentasPorFormaPago } from '../../models/comandos/VentasPorFormaPago';
import { VentasPorCategoria } from '../../models/comandos/VentasPorCategoria';
import { VentasPorHora } from '../../models/comandos/VentasPorHora';
import { VentasPorEmpleado } from '../../models/comandos/VentasPorEmpleado';
import { VentasPorCliente } from '../../models/comandos/VentasPorCliente';

export interface IEstadisticasService {
  obtenerVentasPorFormaPago(filtros: FiltroEstadisticas): Promise<VentasPorFormaPago[]>;
  obtenerVentasPorCategoria(filtros: FiltroEstadisticas): Promise<VentasPorCategoria[]>;
  obtenerVentasPorHora(filtros: FiltroEstadisticas): Promise<VentasPorHora[]>;
  obtenerVentasPorEmpleado(filtros: FiltroEstadisticas): Promise<VentasPorEmpleado[]>;
  obtenerVentasPorCliente(filtros: FiltroEstadisticas): Promise<VentasPorCliente[]>;
}
