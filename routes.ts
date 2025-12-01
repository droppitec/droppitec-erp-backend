import { schemaEmpty } from './middlewares/ValidationSchema';
import { UsersController } from './src/controllers';
import { ProveedoresController } from './src/controllers/ProveedoresController';
import { PromocionesController } from './src/controllers/PromocionesController';
import { DomicilioController } from './src/controllers/DomicilioController';
import { ConfiguracionesController } from './src/controllers/ConfiguracionesController';
import { ProductosController } from './src/controllers/ProductosController';
import { MarcasController } from './src/controllers/MarcaController';
import { VentasController } from './src/controllers/VentasController';
import { TransportesController } from './src/controllers/TransportesController';
import { PedidosController } from './src/controllers/PedidosController';
import { ComprobantesController } from './src/controllers/ComprobantesController';
import { TarjetasController } from './src/controllers/TarjetasController';
import { FilesController } from './src/controllers/FilesController';
import { CajasController } from './src/controllers/CajasController';
import { ReportesController } from './src/controllers/ReportesController';
import { EstadisticasController } from './src/controllers/EstadisticasController';

import multer from 'multer';
import { authenticateToken } from './middlewares/AuthValidator';

// import { requireAdminRole } from './middlewares/RolValidator';

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Rutas del Backend.
 */
export const AppRoutes = [
  // ===========================================================================
  // 🔓 RUTAS PÚBLICAS (Sin authenticateToken)
  // ===========================================================================
  {
    path: '/usuarios/validar-inicio-sesion',
    method: 'post',
    action: UsersController.validarInicioSesion,
    schema: schemaEmpty,
    middleware: []
  },
  {
    path: '/usuarios/recuperar-contrasena',
    method: 'post',
    action: UsersController.recuperarContrasena,
    schema: schemaEmpty,
    middleware: []
  },
  // Si el registro es público (cualquiera se puede crear cuenta), déjalo aquí.
  // Si solo un admin crea usuarios, muévelo a la sección privada.
  {
    path: '/usuarios/registrar-usuario',
    method: 'post',
    action: UsersController.registrarUsuario,
    schema: schemaEmpty,
    middleware: [] // Ojo: Cambiar a [authenticateToken] si es un sistema cerrado
  },

  // ===========================================================================
  // 🔒 RUTAS PRIVADAS (Requieren Token)
  // ===========================================================================

  // region Usuarios
  {
    path: '/usuarios/consultar-empleados',
    method: 'post',
    action: UsersController.consultarEmpleados,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/consultar-clientes',
    method: 'post',
    action: UsersController.consultarClientes,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/consultar-asistencias',
    method: 'post',
    action: UsersController.consultarAsistencias,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/registrar-asistencia',
    method: 'post',
    action: UsersController.registrarAsistencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/modificar-asistencia',
    method: 'post',
    action: UsersController.modificarAsistencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/modificar-usuario',
    method: 'post',
    action: UsersController.modificarEmpleado,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/eliminar-usuario/:id',
    method: 'get',
    action: UsersController.eliminarUsuario,
    schema: schemaEmpty,
    middleware: [authenticateToken] // Sugerencia: Añadir requireAdminRole aquí
  },
  {
    path: '/usuarios/eliminar-asistencia/:id',
    method: 'get',
    action: UsersController.eliminarAsistencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/registrar-superusuario',
    method: 'post',
    action: UsersController.registrarSuperusuario,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/consultar-usuarios-cuenta-corriente',
    method: 'post',
    action: UsersController.consultarCuentasCorrientesxUsuario,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/registrar-cuenta-corriente',
    method: 'post',
    action: UsersController.registrarCuentaCorriente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/modificar-cuenta-corriente',
    method: 'post',
    action: UsersController.modificarCuentaCorriente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/eliminar-cuenta-corriente/:id',
    method: 'get',
    action: UsersController.eliminarCuentaCorriente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/consultar-all-usuarios',
    method: 'get',
    action: UsersController.consultarAllUsuarios,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/obtener-roles-usuario/:id',
    method: 'get',
    action: UsersController.obtenerRolesUsuario,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/obtener-roles',
    method: 'get',
    action: UsersController.obtenerRoles,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/obtener-motivos-licencia',
    method: 'get',
    action: UsersController.obtenerMotivosLicencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/registrar-licencia',
    method: 'post',
    action: UsersController.registrarLicencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/eliminar-licencia/:id',
    method: 'get',
    action: UsersController.eliminarLicencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/consultar-licencias',
    method: 'post',
    action: UsersController.consultarLicencias,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/obtener-estados-licencia',
    method: 'get',
    action: UsersController.obtenerEstadosLicencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/modificar-licencia',
    method: 'post',
    action: UsersController.modificarLicencia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/buscar-ultimos-clientes',
    method: 'get',
    action: UsersController.buscarUltimosClientes,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/cambiar-contrasena',
    method: 'post',
    action: UsersController.cambiarContrasena,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/consultar-movimientos-cuenta-corriente',
    method: 'post',
    action: UsersController.consultarMovimientosCuentaCorriente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/eliminar-movimiento-cuenta-corriente/:id',
    method: 'get',
    action: UsersController.eliminarMovimientoCuentaCorriente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/usuarios/registrar-movimiento-cuenta-corriente',
    method: 'post',
    action: UsersController.registrarMovimientoCuentaCorriente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Proveedores
  {
    path: '/proveedores/registrar-proveedor',
    method: 'post',
    action: ProveedoresController.registrarProveedor,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/proveedores/consultar-proveedores',
    method: 'post',
    action: ProveedoresController.consultarProveedores,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/proveedores/modificar-proveedor',
    method: 'post',
    action: ProveedoresController.modificarProveedor,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/proveedores/eliminar-proveedor/:id',
    method: 'get',
    action: ProveedoresController.eliminarProveedor,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/proveedores/buscar-tipos-proveedores',
    method: 'get',
    action: ProveedoresController.buscarTiposProveedores,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },

  {
    path: '/proveedores/buscar-todos-proveedores',
    method: 'post',
    action: ProveedoresController.buscarTodosProveedores,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Domicilio
  {
    path: '/domicilio/obtener-provincias',
    method: 'get',
    action: DomicilioController.obtenerProvincias,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/domicilio/obtener-localidades-por-provincia/:idProvincia',
    method: 'get',
    action: DomicilioController.obtenerLocalidadesPorProvincia,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Promociones
  {
    path: '/promociones/registrar-promocion',
    method: 'post',
    action: PromocionesController.registrarPromocion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/promociones/consultar-promociones',
    method: 'post',
    action: PromocionesController.consultarPromociones,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/promociones/modificar-promocion',
    method: 'post',
    action: PromocionesController.modificarPromocion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/promociones/eliminar-promocion/:id',
    method: 'get',
    action: PromocionesController.eliminarPromocion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/promociones/buscar-productos',
    method: 'get',
    action: PromocionesController.buscarProductos,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/promociones/notificar-promocion',
    method: 'post',
    action: PromocionesController.notificarPromocion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/promociones/consultar-promociones-por-producto/:idProducto',
    method: 'get',
    action: PromocionesController.buscarPromocionPorProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Productos
  {
    path: '/productos/registrar-producto',
    method: 'post',
    action: ProductosController.registrarProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/modificar-producto',
    method: 'post',
    action: ProductosController.modificarProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/consultar-productos',
    method: 'post',
    action: ProductosController.consultarProductos,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/buscar-tipo-productos',
    method: 'post',
    action: ProductosController.consultarTipoProductos,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/eliminar-producto/:id',
    method: 'get',
    action: ProductosController.eliminarProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/registrar-detalle-producto',
    method: 'post',
    action: ProductosController.registrarDetalleProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/modificar-detalle-producto',
    method: 'post',
    action: ProductosController.modificarDetalleProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/consultar-detalles-productos',
    method: 'post',
    action: ProductosController.consultarDetalleProductos,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/eliminar-detalle-producto/:id',
    method: 'get',
    action: ProductosController.eliminarDetalleProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/buscar-movimientos-por-producto/:id',
    method: 'get',
    action: ProductosController.consultarMovimientosPorProducto,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/productos/consultar-productos-stock-limitado',
    method: 'get',
    action: ProductosController.consultarProductosConStockLimitado,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // Region Marcas
  {
    path: '/marcas/buscar-marcas',
    method: 'post',
    action: MarcasController.obtenerMarcas,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Configuraciones
  {
    path: '/configuraciones/consultar-configuraciones',
    method: 'get',
    action: ConfiguracionesController.obtenerConfiguraciones,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/configuraciones/registrar-configuracion',
    method: 'get',
    action: ConfiguracionesController.registrarConfiguracion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/configuraciones/modificar-configuracion',
    method: 'post',
    action: ConfiguracionesController.modificarConfiguracion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/configuraciones/existe-configuracion',
    method: 'get',
    action: ConfiguracionesController.existeConfiguracion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Ventas
  {
    path: '/ventas/registrar-venta',
    method: 'post',
    action: VentasController.registrarVentaConDetalles,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/buscar-usuarios-clientes',
    method: 'get',
    action: VentasController.buscarUsuariosClientes,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/buscar-formas-de-pago',
    method: 'get',
    action: VentasController.buscarFormasDePago,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-condiciones-iva',
    method: 'get',
    action: VentasController.obtenerCondicionesIva,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-tipos-facturacion',
    method: 'get',
    action: VentasController.obtenerTipoFacturacion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/facturar-venta',
    method: 'post',
    action: VentasController.facturarVentaConAfip,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/buscar-ventas',
    method: 'post',
    action: VentasController.buscarVentas,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/buscar-ventas-paginadas',
    method: 'post',
    action: VentasController.buscarVentasPaginadas,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/buscar-ventas-por-cc/:idUsuario',
    method: 'get',
    action: VentasController.buscarVentasPorCC,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/anular-venta',
    method: 'post',
    action: VentasController.anularVenta,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/anular-venta-sin-facturacion',
    method: 'post',
    action: VentasController.anularVentaSinFacturacion,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/buscar-ventas-fecha-hora',
    method: 'post',
    action: VentasController.buscarVentasConFechaHora,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-cantidad-ventas-mensuales',
    method: 'get',
    action: VentasController.buscarCantidadVentasMensuales,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-cantidad-ventas-dia-hora',
    method: 'get',
    action: VentasController.buscarVentasPorDiaYHora,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/generar-pago',
    method: 'post',
    action: VentasController.pagarConQRSIRO,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/consultar-pago',
    method: 'post',
    action: VentasController.consultaPagoSIROQR,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/buscar-detalles-venta',
    method: 'post',
    action: VentasController.buscarDetallesVenta,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/generar-pago-cuenta-corriente',
    method: 'post',
    action: VentasController.pagarConQRSIROPagosDeCuentaCorriente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Transportes
  {
    path: '/transportes/buscar-transportes',
    method: 'get',
    action: TransportesController.obtenerTransportes,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Pedidos
  {
    path: '/pedidos/registrar-pedido',
    method: 'post',
    action: PedidosController.registrarPedido,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/pedidos/consultar-pedidos',
    method: 'post',
    action: PedidosController.consultarPedidos,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/pedidos/eliminar-pedido/:id',
    method: 'get',
    action: PedidosController.eliminarPedido,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/pedidos/buscar-estados-pedido',
    method: 'get',
    action: PedidosController.obtenerEstadosPedido,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/pedidos/modificar-pedido',
    method: 'post',
    action: PedidosController.modificarPedido,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/pedidos/buscar-ordenes-de-compra-home',
    method: 'get',
    action: PedidosController.buscarOrdenesDeCompraHome,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },

  // region Comprobantes
  {
    path: '/comprobantes/registrar-comprobante',
    method: 'post',
    action: ComprobantesController.registrarComprobante,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/comprobantes/consultar-comprobantes',
    method: 'post',
    action: ComprobantesController.consultarComprobantes,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/comprobantes/eliminar-comprobante/:id',
    method: 'get',
    action: ComprobantesController.eliminarComprobante,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/comprobantes/buscar-tipos-comprobantes',
    method: 'get',
    action: ComprobantesController.obtenerTiposComprobantes,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/comprobantes/modificar-comprobante',
    method: 'post',
    action: ComprobantesController.modificarComprobante,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Tarjetas
  {
    path: '/tarjetas/registrar-tarjeta',
    method: 'post',
    action: TarjetasController.registrarTarjeta,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/tarjetas/consultar-tarjetas',
    method: 'post',
    action: TarjetasController.consultarTarjetas,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/tarjetas/eliminar-tarjeta/:id',
    method: 'get',
    action: TarjetasController.eliminarTarjeta,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/tarjetas/buscar-tipo-tarjetas',
    method: 'get',
    action: TarjetasController.buscarTiposTarjetas,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/tarjetas/modificar-tarjeta',
    method: 'post',
    action: TarjetasController.modificarTarjeta,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/tarjetas/buscar-cuotas',
    method: 'get',
    action: TarjetasController.consultarCuotas,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Files
  {
    path: '/files/upload',
    method: 'post',
    action: FilesController.guardarArchivo,
    // AQUÍ SE COMBINAN LOS MIDDLEWARES: AUTH + MULTER
    middleware: [authenticateToken, upload.single('file')],
    schema: schemaEmpty
  },
  {
    path: '/files/download/:nombreOriginal',
    method: 'get',
    action: FilesController.obtenerArchivo,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Cajas
  {
    path: '/cajas/registrar-caja',
    method: 'post',
    action: CajasController.registrarCaja,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/consultar-cajas',
    method: 'post',
    action: CajasController.consultarCajas,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/eliminar-caja/:id',
    method: 'get',
    action: CajasController.eliminarCaja,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/modificar-caja',
    method: 'post',
    action: CajasController.modificarCaja,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/registrar-arqueo',
    method: 'post',
    action: CajasController.registrarArqueo,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/consultar-arqueos',
    method: 'post',
    action: CajasController.consultarArqueos,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/eliminar-arqueo/:id',
    method: 'get',
    action: CajasController.eliminarArqueo,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/modificar-arqueo',
    method: 'post',
    action: CajasController.modificarArqueo,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/buscar-estados-arqueo',
    method: 'get',
    action: CajasController.obtenerEstadosArqueo,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/registrar-movimiento-manual',
    method: 'post',
    action: CajasController.registrarMovimientoManual,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/consultar-movimientos-manuales/:id',
    method: 'get',
    action: CajasController.consultarMovimientosManuales,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/eliminar-movimiento-manual/:id',
    method: 'get',
    action: CajasController.eliminarMovimientoManual,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/cajas/cerrar-arqueo',
    method: 'post',
    action: CajasController.cerrarArqueo,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Logs
  {
    path: '/usuarios/buscar-ultimos-logs',
    method: 'get',
    action: UsersController.buscarUltimosLogs,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion
  // region Reportes
  {
    path: '/reportes/obtener-data-reporte',
    method: 'post',
    action: ReportesController.obtenerDataReporte,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  //#endregion

  // region Estadísticas
  {
    path: '/ventas/obtener-ventas-por-forma-pago',
    method: 'post',
    action: EstadisticasController.obtenerVentasPorFormaPago,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-ventas-por-categoria',
    method: 'post',
    action: EstadisticasController.obtenerVentasPorCategoria,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-ventas-por-hora',
    method: 'post',
    action: EstadisticasController.obtenerVentasPorHora,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-ventas-por-empleado',
    method: 'post',
    action: EstadisticasController.obtenerVentasPorEmpleado,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  },
  {
    path: '/ventas/obtener-ventas-por-cliente',
    method: 'post',
    action: EstadisticasController.obtenerVentasPorCliente,
    schema: schemaEmpty,
    middleware: [authenticateToken]
  }
  //#endregion
];
