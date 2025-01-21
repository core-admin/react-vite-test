import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { cn } from '@/lib/utils';

const links = [
  { name: '基础使用及验证', href: '/' },
  { name: '结合自定义组件', href: '/demo2' },
  { name: '整合 UI 库', href: '/demo3' },
];

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img
                  className="size-8"
                  src="https://tailwindui.starxg.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  alt=""
                />
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                {links.map(link => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
                    )}
                    activeProps={{
                      className: cn('!bg-gray-900 text-white'),
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
