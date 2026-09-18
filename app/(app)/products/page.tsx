import Link from 'next/link'
import Image from 'next/image'
import { Package, ImageOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/page-header'
import { NewProductButton } from '@/components/app-shell'
import { ProductFilters } from '@/components/product-filters'
import { StatusBadge } from '@/components/status-badge'
import { ProductDecision } from '@/components/product-decision'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatPrice, type Product } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>
}) {
  const { q, category, status } = await searchParams
  const supabase = await createClient()

  let queryBuilder = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) queryBuilder = queryBuilder.eq('category', category)
  if (status) queryBuilder = queryBuilder.eq('status', status)
  if (q) {
    queryBuilder = queryBuilder.or(
      `name.ilike.%${q}%,description.ilike.%${q}%,mla.ilike.%${q}%`,
    )
  }

  const { data } = await queryBuilder
  const products = (data ?? []) as Product[]

  return (
    <>
      <PageHeader
        title="Productos"
        description="Todos los productos relevados por el equipo."
        action={<NewProductButton />}
      />

      <div className="space-y-6 p-6">
        <ProductFilters />

        {products.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Package className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No se encontraron productos</p>
              <p className="text-sm text-muted-foreground">
                Ajustá los filtros o agregá un nuevo producto.
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Desktop table */}
            <Card className="hidden overflow-hidden py-0 md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Decisión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <Link
                          href={`/products/${product.id}`}
                          className="flex items-center gap-3"
                        >
                          <Thumb src={product.images[0]} alt={product.name} />
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {product.name}
                            </p>
                            {product.mla && (
                              <p className="text-xs text-muted-foreground">
                                {product.mla}
                              </p>
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category ?? '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <ProductDecision
                          id={product.id}
                          status={product.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Mobile cards */}
            <div className="grid gap-3 md:hidden">
              {products.map((product) => (
                <Card key={product.id} className="flex flex-col gap-3 p-3">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex flex-row items-center gap-3"
                  >
                    <Thumb src={product.images[0]} alt={product.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category ?? 'Sin categoría'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={product.status} />
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </Link>
                  <ProductDecision
                    id={product.id}
                    status={product.status}
                    className="justify-stretch [&>button]:flex-1"
                  />
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

function Thumb({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <ImageOff className="size-4" />
      </div>
    )
  }
  return (
    <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-muted">
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        fill
        sizes="44px"
        className="object-cover"
      />
    </div>
  )
}
