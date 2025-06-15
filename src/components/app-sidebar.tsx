'use client';

import { useEffect, useState } from 'react';
import {
  Command,
  LifeBuoy,
  Send,
  ShoppingCart,
  Package,
  Box,
  Users,
  Store,
  Settings,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getSessionUser } from '@/actions/auth/get-session-user';
import { User } from '@/app/generated/prisma';
import { redirect } from 'next/navigation';

const data = {
  navMain: [
    {
      title: 'Ventas',
      url: '/ventas/historial',
      icon: ShoppingCart,
      isActive: true,
      items: [
        {
          title: 'Nueva Venta',
          url: '/ventas/nueva',
        },
        {
          title: 'Historial',
          url: '/ventas/historial',
        },
      ],
    },
    {
      title: 'Inventario',
      url: '/inventario/stock',
      icon: Package,
      items: [
        {
          title: 'Stock',
          url: '/inventario/stock',
        },
        {
          title: 'Ajustes',
          url: '/inventario/ajustes',
        },
      ],
    },
    {
      title: 'Productos',
      url: '/productos/lista',
      icon: Box,
      items: [
        {
          title: 'Lista',
          url: '/productos/lista',
        },
        {
          title: 'Nuevo',
          url: '/productos/nuevo',
        },
      ],
    },
    {
      title: 'Proveedores',
      url: '/proveedores/lista',
      icon: Store,
      items: [
        {
          title: 'Lista',
          url: '/proveedores/lista',
        },
        {
          title: 'Nuevo',
          url: '/proveedores/nuevo',
        },
      ],
    },
    {
      title: 'Clientes',
      url: '/clientes/lista',
      icon: Users,
      items: [
        {
          title: 'Lista',
          url: '/clientes/lista',
        },
        {
          title: 'Nuevo',
          url: '/clientes/nuevo',
        },
      ],
    },
    {
      title: 'Parametrización',
      url: '#',
      icon: Settings,
      items: [
        {
          title: 'Categorías',
          url: '/parametrizacion/categorias',
        },
        {
          title: 'Unidades de Medida',
          url: '/parametrizacion/unidades',
        },
        {
          title: 'Métodos de Pago',
          url: '/parametrizacion/metodos-pago',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Soporte',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Punto Frio POS',
      url: '/',
      icon: Command,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const user = await getSessionUser();
    if (!user) redirect('/auth/login');
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Punto Frio POS</span>
                  <span className='truncate text-xs'>
                    Sistema de Ventas e Inventario
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.firstName + ' ' + user?.lastName || '',
            email: user?.email || '',
            avatar: '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
