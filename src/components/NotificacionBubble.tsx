'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

//Fetch datos
import { fetchAllProveedores, fetchAllRepuestos } from '@/lib/data'

//Interfaces
import { Proveedor, Repuesto } from '@/lib/interfaces'

const NotificationBubble = () => {
  const [notifications, setNotifications] = useState<{
    proveedores: Proveedor[]
    repuestos: Repuesto[]
  }>({ proveedores: [], repuestos: [] })
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)

    try {
      const [proveedoresResponse, repuestosResponse] = await Promise.all([
        fetchAllProveedores(),
        fetchAllRepuestos(),
      ]);
      const proveedores = await proveedoresResponse;
      const repuestos = await repuestosResponse;
    
      const lowStockRepuestos = repuestos.filter(repuesto => repuesto.stock <= 10);
      const nearExpirationProveedores = proveedores.filter(proveedor => proveedor.dias_credito_restantes <= 5);
    
      setNotifications({
        proveedores: nearExpirationProveedores,
        repuestos: lowStockRepuestos,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchNotifications()

    // Set up an interval to refresh the data every 5 minutes
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [fetchNotifications])

  const totalNotifications =
    notifications.proveedores.length + notifications.repuestos.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-4 w-4" />
          {totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalNotifications}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Notificaciones</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchNotifications}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
          {notifications.proveedores.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Fechas de crédito próximas a vencer:</h4>
              <ul className="space-y-2">
                {notifications.proveedores.map((proveedor) => (
                  <li key={proveedor.id_proveedor} className="text-sm">
                    {proveedor.nombre_proveedor} -{' '}
                    {proveedor.dias_credito_restantes} Días restantes.
                  </li>
                ))}
              </ul>
            </div>
          )}
          {notifications.repuestos.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Repuestos con bajo stock:</h4>
              <ul className="space-y-2">
                {notifications.repuestos.map((repuesto) => (
                  <li key={repuesto.id_repuesto} className="text-sm">
                    {repuesto.nombre_repuesto} - Stock: {repuesto.stock}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {totalNotifications === 0 && (
            <p className="text-sm text-gray-500">
              No hay notificaciones.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationBubble
