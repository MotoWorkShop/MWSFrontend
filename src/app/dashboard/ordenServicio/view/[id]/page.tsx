'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Printer, Loader2, ArrowLeft } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { fetchOneOrdenServicio } from '@/lib/data'
import { COMPANY_INFO } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

export default function CompactPrintServiceOrderView() {
  const { id } = useParams()
  const router = useRouter()
  const [orden, setOrden] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrden = async () => {
      try {
        const data = await fetchOneOrdenServicio(Number(id))
        setOrden(data)
      } catch (err) {
        console.error('Error al cargar la orden de servicio:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrden()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!orden) {
    return (
      <div className="text-center">No se encontró la orden de servicio</div>
    )
  }

  const renderLogo = () => {
    if (orden.estado !== 'PENDIENTE') {
      return (
        <div className="flex justify-between items-start mb-4">
          <Image
            src={COMPANY_INFO.logo}
            alt="Logo de la empresa"
            width={100}
            height={100}
          />
          <div className="text-right">
            <h2 className="text-xl font-bold">{COMPANY_INFO.name}</h2>
            <p className="text-sm">NIT: {COMPANY_INFO.nit}</p>
            <p className="text-sm">{COMPANY_INFO.address}</p>
            <p className="text-sm">Tel: {COMPANY_INFO.phone}</p>
            <p className="text-sm">{COMPANY_INFO.email}</p>
          </div>
        </div>
      )
    }
    return null
  }

  const renderServiciosRepuestos = () => {
    if (orden.estado === 'PENDIENTE') {
      return (
        <>
          <div className="space-y-6 print:break-inside-avoid">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Servicios y Repuestos</h3>
              <div className="border border-gray-300 rounded-md p-4">
                <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-gray-700">
                  <div className="col-span-8">Concepto</div>
                  <div className="col-span-2 text-right">Cant</div>
                  <div className="col-span-2 text-right">Entregado</div>
                </div>
                {[...Array(25)].map((_, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <div className="col-span-8">
                      <Separator className="my-2 border-[1px] border-gray-200" />
                    </div>
                    <div className="col-span-2">
                      <Separator className="my-2 border-[1px] border-gray-200" />
                    </div>
                    <div className="col-span-2">
                      <Separator className="my-2 border-[1px] border-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="mb-4 print:break-inside-avoid">
            <h3 className="text-lg font-bold mb-2">Servicios</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orden.servicios.map((servicio) => (
                  <TableRow key={servicio.id_servicio}>
                    <TableCell>{servicio.servicio.nombre_servicio}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(servicio.precio)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mb-4 print:break-inside-avoid">
            <h3 className="text-lg font-bold mb-2">Repuestos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repuesto</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead className="text-right">P. Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orden.repuestos.map((repuesto) => (
                  <TableRow key={repuesto.id_repuesto}>
                    <TableCell>{repuesto.repuesto.nombre_repuesto}</TableCell>
                    <TableCell>{repuesto.cantidad}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(repuesto.precio)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(repuesto.precio * repuesto.cantidad)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )
    }
  }

  const renderFinancialSummary = () => {
    if (orden.estado !== 'PENDIENTE') {
      return (
        <div className="mb-4 print:break-inside-avoid">
          <h3 className="text-lg font-bold mb-2">Resumen Financiero</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Valor</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    Number(orden.subtotal) + Number(orden.descuento)
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Descuento</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orden.descuento)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Subtotal</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orden.subtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>IVA</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orden.iva)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orden.total)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Pago Efectivo</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orden.adelanto_efectivo)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Pago Tarjeta</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orden.adelanto_tarjeta)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Pago Transferencia</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orden.adelanto_transferencia)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Saldo Pendiente</strong>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    Number(orden.total) -
                      (Number(orden.adelanto_efectivo) +
                        Number(orden.adelanto_tarjeta) +
                        Number(orden.adelanto_transferencia))
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )
    }
    return null
  }

  return (
    <div className="container mx-auto py-4 px-4 max-w-4xl">
      <div className="print:hidden mb-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/ordenServicio')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">
          Orden de Servicio #{orden.id_orden_servicio}
        </h1>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
      </div>

      <div className="print:mb-4">
        {renderLogo()}

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4 d-flex flex-row">
          <div>
            <h3 className="text-lg font-bold mb-1">Cliente</h3>
            <p>
              <strong>Nombre:</strong>{' '}
              {orden.moto_cliente.cliente.nombre_cliente}
            </p>
            <p>
              <strong>Cédula:</strong> {orden.moto_cliente.cliente.cedula}
            </p>
            <p>
              <strong>Teléfono:</strong> {orden.moto_cliente.cliente.telefono}
            </p>
            <p>
              <strong>Correo:</strong> {orden.moto_cliente.cliente.correo}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Moto</h3>
            <p>
              <strong>Marca:</strong> {orden.moto_cliente.marca}
            </p>
            <p>
              <strong>Modelo:</strong> {orden.moto_cliente.modelo}
            </p>
            <p>
              <strong>Año:</strong> {orden.moto_cliente.ano}
            </p>
            <p>
              <strong>Placa:</strong> {orden.moto_cliente.placa}
            </p>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-lg font-bold mb-1">Detalles de la Orden</h3>
          <div className="grid grid-cols-2 gap-2">
            <p>
              <strong>Orden #:</strong> {orden.id_orden_servicio}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(orden.fecha)}
            </p>
            <p>
              <strong>Estado:</strong> <Badge>{orden.estado}</Badge>
            </p>
            <p>
              <strong>Mecánico:</strong> {orden.mecanico}
            </p>
            <p>
              <strong>Guardar Cascos:</strong>{' '}
              {orden.guardar_cascos ? 'Sí' : 'No'}
            </p>
            <p>
              <strong>Guardar Papeles:</strong>{' '}
              {orden.guardar_papeles ? 'Sí' : 'No'}
            </p>
          </div>
          <p className="mt-2 max-w-full">
            <strong>Trabajo a realizar:</strong> {orden.observaciones || 'N/A'}
          </p>
          <p className="mt-2">
            <strong>Diagnostico del mecánico:</strong>{' '}
            {orden.observaciones_mecanico || 'N/A'}
          </p>
        </div>
      </div>

      {renderServiciosRepuestos()}
      {renderFinancialSummary()}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container,
          .container * {
            visibility: visible;
          }
          .container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
        }
        @page {
          size: auto;
          margin: 10mm;
        }
        body {
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}
