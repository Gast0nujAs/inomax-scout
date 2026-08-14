import type React from 'react'
import { Package } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Package className="size-5" />
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight">
            INOMAX
          </span>
        </div>

        <div className="max-w-md space-y-4">
          <h1 className="text-balance font-serif text-3xl font-semibold leading-tight">
            Product Scout
          </h1>
          <p className="text-pretty leading-relaxed text-sidebar-foreground/70">
            Releva, organiza y da seguimiento a los productos de MercadoLibre
            que tu equipo está evaluando, todo desde un solo lugar.
          </p>
        </div>

        <p className="text-sm text-sidebar-foreground/50">
          Herramienta interna &middot; INOMAX
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </main>
  )
}
