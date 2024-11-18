'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import SideNav from '@/components/dashboard/sidenav'
import { MotoWorkShopLoader } from '@/components/MotoWorkShopLoader'
import NotificationBubble from '@/components/NotificacionBubble'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <MotoWorkShopLoader />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block w-64 flex-shrink-0 bg-white`}
      >
        <SideNav onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex-grow" />
          {localStorage.getItem('userName') && (
            <span className="mr-4 text-gray-700">
              Bienvenido, <strong>{localStorage.getItem('userName')}</strong>
            </span>
          )}
          <NotificationBubble />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
