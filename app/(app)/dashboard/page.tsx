import Link from 'next/link'
import { Package, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/page-header'
import { NewProductButton } from '@/components/app-shell'
import { StatusBadge } from '@/components/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  formatPrice,
  formatDate,
  type Product,
  type ProductStatus,
} from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const products = (data ?? []) as Product[]

  const counts = products.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] ?? 0) + 1
      return acc
    },
    {} as Record<ProductStatus, number>,
  )

  const stats = [
    {
      label: 'Total de productos',
      value: products.length,
      icon: Package,
      tint: 'bg-primary/10 text-primary',
    },
    {
      label: 'En revisión (DUDOSO)',
      value: counts['En revisión'] ?? 0,
      icon: Clock,
      tint: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      label: 'Aprobados',
      value: counts['Aprobado'] ?? 0,
      icon: CheckCircle2,
      tint: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      label: 'Descartados',
      value: counts['Descartado'] ?? 0,
      icon: XCircle,
      tint: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    },
  ]

  const recent = products.slice(0, 5)

  return (
    <>
      <PageHeader
        title="Panel"
        description="Resumen del relevamiento de productos de tu equipo."
        action={<NewProductButton />}
      />

      <div className="space-y-8 p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex size-11 items-center justify-center rounded-lg ${stat.tint}`}
                >
                  <stat.icon className="size-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-serif text-2xl font-semibold tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">
              Productos recientes
            </CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/products" />}>
              Ver todos
              <ArrowRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Package className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Todavía no hay productos</p>
                  <p className="text-sm text-muted-foreground">
                    Empezá agregando el primer producto para relevar.
                  </p>
                </div>
                <NewProductButton />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center gap-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category ?? 'Sin categoría'}
                          {' · '}
                          {formatDate(product.created_at)}
                        </p>
                      </div>
                      <span className="hidden text-sm tabular-nums text-muted-foreground sm:block">
                        {formatPrice(product.price)}
                      </span>
                      <StatusBadge status={product.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
