import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/page-header'
import { ProductForm } from '@/components/product-form'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products'
import { updateProduct } from '../../actions'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
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
  const updateAction = updateProduct.bind(null, id)

  return (
    <>
      <PageHeader
        title="Editar producto"
        description={product.name}
        action={
          <Button variant="outline" render={<Link href={`/products/${id}`} />}>
            <ArrowLeft className="size-4" />
            Volver
          </Button>
        }
      />
      <div className="p-6">
        <ProductForm
          action={updateAction}
          product={product}
          cancelHref={`/products/${id}`}
        />
      </div>
    </>
  )
}
