export interface User {
  id_usuario?: number
  nombre_usuario: string
  email: string
  rol: 'ADMINISTRADOR' | 'VENDEDOR'
}


export interface ClienteResponse {
  clientes: Cliente[];
}

export interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  cedula: string;
  correo: string;
  telefono: string;
  facturas: Factura[];
  motos_cliente: MotoCliente[];
  ventas_directas: VentaDirecta[];
}

export interface FacturaResponse {
  facturas: Factura[];
}

export interface Factura {
  facturas?: Factura[];
  id_factura: number;
  fecha: Date;
  pago_efectivo: number;
  pago_tarjeta: number;
  pago_transferencia: number;
  descuento: number;
  subtotal: number;
  iva: number;
  total: number;
  id_cliente: number;
  cliente: Cliente;
  id_orden_servicio?: number;
  orden_servicio?: OrdenServicio;
  id_venta_directa?: number;
  venta_directa?: VentaDirecta;
}

export interface MotoClienteResponse {
  motos_cliente: MotoCliente[];
}

export interface MotoCliente {
  id_moto_cliente: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  id_cliente: number;
  cliente: Cliente;
  ordenes_servicio: OrdenServicio[];
}

export interface OrdenServicioResponse {
  ordenes_servicio: OrdenServicio[];
}

export interface OrdenServicio {
  id_orden_servicio: number;
  fecha: Date;
  estado: string;
  subtotal: number;
  iva: number;
  total: number;
  adelanto_efectivo: number;
  adelanto_tarjeta: number;
  adelanto_transferencia: number;
  guardar_cascos: boolean;
  guardar_papeles: boolean;
  observaciones: string;
  mecanico: string;
  id_moto_cliente: number;
  moto_cliente: MotoCliente;
  servicios: ServicioOrdenServicio[];
  repuestos: RepuestoOrdenServicio[];
  factura?: Factura;
}

export interface ServicioResponse {
  servicios: Servicio[];
}

export interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  ordenes_servicio: ServicioOrdenServicio[];
}

export interface ServicioOrdenServicioResponse {
  servicios_orden_servicio: ServicioOrdenServicio[];
}

export interface ServicioOrdenServicio {
  id_orden_servicio: number;
  id_servicio: number;
  precio: number;
  orden_servicio: OrdenServicio;
  servicio: Servicio;
}

export interface VentaDirectaResponse {
  ventas_directas: VentaDirecta[];
}

export interface VentaDirecta {
  ventasDirectas: VentaDirecta[];
  id_venta: number;
  fecha: Date;
  pago_efectivo: number;
  pago_tarjeta: number;
  pago_transferencia: number;
  subtotal: number;
  iva: number;
  total: number;
  id_cliente: number;
  cliente: Cliente;
  repuestos: RepuestoVenta[];
  factura?:{
    id_factura : number 
  };
}

export interface MarcaRepuestoResponse {
  marcas_repuesto: MarcaRepuesto[];
}

export interface MarcaRepuesto {
  id_marca: number;
  nombre_marca: string;
  repuestos: Repuesto[];
}

export interface RepuestoResponse {
  repuestos: Repuesto[];
}

export interface Repuesto {
  id_repuesto: number;
  codigo_barras: string;
  nombre_repuesto: string;
  valor_compra: number;
  valor_unitario: number;
  ubicacion: string;
  stock: number;
  id_marca: number;
  marca: MarcaRepuesto;
  ventas: RepuestoVenta[];
  ordenes_servicio: RepuestoOrdenServicio[];
  motos_mercado: MotoRepuesto[];
  proveedores: ProveedorRepuesto[];
}

export interface RepuestoVentaResponse {
  repuestos_venta: RepuestoVenta[];
}

export interface RepuestoVenta {
  id_venta: number;
  id_repuesto: number;
  cantidad: number;
  precio: number;
  venta: VentaDirecta;
  repuesto: Repuesto;
}

export interface RepuestoOrdenServicioResponse {
  repuestos_orden_servicio: RepuestoOrdenServicio[];
}

export interface RepuestoOrdenServicio {
  id_orden_servicio: number;
  id_repuesto: number;
  cantidad: number;
  precio: number;
  orden_servicio: OrdenServicio;
  repuesto: Repuesto;
}

export interface MotoMercadoResponse {
  motos_mercado: MotoMercado[];
}

export interface MotoMercado {
  id_moto_mercado: number;
  modelo: string;
  repuestos: MotoRepuesto[];
}

export interface MotoRepuestoResponse {
  motos_repuesto: MotoRepuesto[];
}

export interface MotoRepuesto {
  id_moto_mercado: number;
  id_repuesto: number;
  moto_mercado: MotoMercado;
  repuesto: Repuesto;
}

export interface ProveedorResponse {
  proveedores: Proveedor[];
}

export interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
  nit: string;
  telefono: string;
  asesor: string;
  fecha_vencimiento: Date;
  repuestos: ProveedorRepuesto[];
  dias_credito_restantes: number;
}

export interface ProveedorRepuestoResponse {
  proveedores_repuesto: ProveedorRepuesto[];
}

export interface ProveedorRepuesto {
  id_proveedor: number;
  id_repuesto: number;
  proveedor: Proveedor;
  repuesto: Repuesto;
}

