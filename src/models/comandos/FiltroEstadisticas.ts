export class FiltroEstadisticas {
  fechaDesde?: Date | null;
  fechaHasta?: Date | null;
  formaDePago?: string; // nombre de la forma de pago o vacío para todas
  categoria?: string; // nombre de la categoría o vacío para todas
  idEmpleado?: number | null; // ID del empleado o null para todos
}
