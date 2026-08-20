'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Plus, X, Loader2 } from 'lucide-react'
import type { ProductActionState } from '@/app/(app)/products/actions'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  type Product,
} from '@/lib/products'
import { ImageUploader } from '@/components/image-uploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Action = (
  prev: ProductActionState,
  formData: FormData,
) => Promise<ProductActionState>

export function ProductForm({
  action,
  product,
  cancelHref,
}: {
  action: Action
  product?: Product
  cancelHref: string
}) {
  const [state, formAction] = useActionState<ProductActionState, FormData>(
    action,
    {},
  )

  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [characteristics, setCharacteristics] = useState<string[]>(
    product?.characteristics?.length ? product.characteristics : [''],
  )

  function updateCharacteristic(index: number, val: string) {
    setCharacteristics((prev) =>
      prev.map((c, i) => (i === index ? val : c)),
    )
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-3">
      {/* Main details */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">
              Información del producto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={product?.name}
                placeholder="Ej. Auriculares inalámbricos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={product?.description ?? ''}
                placeholder="Detalles, notas de relevamiento, observaciones…"
              />
            </div>

            <div className="space-y-2">
              <Label>Características</Label>
              <div className="space-y-2">
                {characteristics.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      name="characteristics"
                      value={c}
                      onChange={(e) => updateCharacteristic(i, e.target.value)}
                      placeholder="Ej. Bluetooth 5.3"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setCharacteristics((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      aria-label="Quitar característica"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCharacteristics((prev) => [...prev, ''])
                }
              >
                <Plus className="size-4" />
                Agregar característica
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Imágenes</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader value={images} onChange={setImages} />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar: meta */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Clasificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select name="category" defaultValue={product?.category ?? undefined}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar…" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                name="status"
                defaultValue={product?.status ?? 'Pendiente'}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (ARS)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price ?? ''}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">MercadoLibre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="mercadolibre_url">URL de publicación</Label>
              <Input
                id="mercadolibre_url"
                name="mercadolibre_url"
                type="url"
                defaultValue={product?.mercadolibre_url ?? ''}
                placeholder="https://articulo.mercadolibre.com.ar/…"
              />
            </div>
          </CardContent>
        </Card>

        {state.error && (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-2">
          <SubmitButton isEdit={Boolean(product)} />
          <Button variant="outline" render={<Link href={cancelHref} />}>
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  )
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="flex-1">
      {pending && <Loader2 className="size-4 animate-spin" />}
      {isEdit ? 'Guardar cambios' : 'Crear producto'}
    </Button>
  )
}
