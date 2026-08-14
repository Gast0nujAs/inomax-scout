import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Pencil, ExternalLink, ImageOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { DeleteProductButton } from '@/components/delete-product-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate, type Product } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!data) notFound()

  const product = data as Product

  return (
    <>
      <PageHeader
        title={product.name}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" render={<Link href="/products" />}>
              <ArrowLeft className="size-4" />
              Volver
            </Button>
            <Button render={<Link href={`/products/${id}/edit`} />}>
              <Pencil className="size-4" />
              Editar
            </Button>
            <DeleteProductButton id={id} name={product.name} />
          </div>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-muted-foreground">
                  <ImageOff className="size-6" />
                  <p className="text-sm">Sin imágenes</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {product.images.map((url) => (
                    <div
                      key={url}
                      className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      <Image
                        src={url || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              {product.description ? (
                <p className="whitespace-pre-wrap text-pretty leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin descripción.
                </p>
              )}

              {product.characteristics.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="mb-3 text-sm font-medium">Características</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {product.characteristics.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="size-1.5 rounded-full bg-primary" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Meta sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-5">
              <Row label="Estado">
                <StatusBadge status={product.status} />
              </Row>
              <Separator />
              <Row label="Categoría">
                <span>{product.category ?? '—'}</span>
              </Row>
              <Separator />
              <Row label="Precio">
                <span className="font-serif text-lg font-semibold tabular-nums">
                  {formatPrice(product.price)}
                </span>
              </Row>
              <Separator />
              <Row label="Código MLA">
                <span className="tabular-nums">{product.mla ?? '—'}</span>
              </Row>
              <Separator />
              <Row label="Creado">
                <span>{formatDate(product.created_at)}</span>
              </Row>
              <Row label="Actualizado">
                <span>{formatDate(product.updated_at)}</span>
              </Row>
            </CardContent>
          </Card>

          {product.mercadolibre_url && (
            <Button
              variant="outline"
              className="w-full"
              render={
                <a
                  href={product.mercadolibre_url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLink className="size-4" />
              Ver en MercadoLibre
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right text-sm">{children}</div>
    </div>
  )
}
