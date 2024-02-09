'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeid}`,
      label: 'Principal',
      active: pathname === `/${params.storeid}`,
    },
    {
      href: `/${params.storeid}/billboards`,
      label: 'Billboards',
      active: pathname === `/${params.storeid}/billboards`,
    },
    {
      href: `/${params.storeid}/categories`,
      label: 'Categorías',
      active: pathname === `/${params.storeid}/categories`,
    },
    {
      href: `/${params.storeid}/sizes`,
      label: 'Tamaños',
      active: pathname === `/${params.storeid}/sizes`,
    },
    {
      href: `/${params.storeid}/materials`,
      label: 'Materiales',
      active: pathname === `/${params.storeid}/materials`,
    },
    {
      href: `/${params.storeid}/settings`,
      label: 'Configuración',
      active: pathname === `/${params.storeid}/settings`,
    },
  ];

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active
              ? 'text-black dark:text-white'
              : 'text-muted-foreground',
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
