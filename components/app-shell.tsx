'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, LogOut, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'

const NAV = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/products', label: 'Productos', icon: Package },
]

export function AppShell({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className="grid min-h-svh grid-cols-1 md:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside className="hidden flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Package className="size-4" />
          </div>
          <span className="font-serif text-base font-semibold tracking-tight">
            INOMAX123
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-xs text-sidebar-foreground/70">
              {email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Package className="size-4" />
            </div>
            <span className="font-serif text-base font-semibold">INOMAX</span>
          </div>
          <div className="flex items-center gap-2">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Button
                  key={item.href}
                  size="sm"
                  variant={active ? 'default' : 'ghost'}
                  render={<Link href={item.href} />}
                >
                  {item.label}
                </Button>
              )
            })}
            <Button size="icon" variant="ghost" onClick={handleSignOut} aria-label="Cerrar sesión">
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  )
}

export function NewProductButton() {
  return (
    <Button render={<Link href="/products/new" />}>
      <Plus className="size-4" />
      Nuevo producto
    </Button>
  )
}
