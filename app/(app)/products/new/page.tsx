import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ProductForm } from '@/components/product-form'
import { Button } from '@/components/ui/button'
import { createProduct } from '../actions'

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        title="Nuevo producto"
        description="Cargá los datos del producto que estás relevando."
        action={
          <Button variant="outline" render={<Link href="/products" />}>
            <ArrowLeft className="size-4" />
            Volver
          </Button>
        }
      />
      <div className="p-6">
        <ProductForm action={createProduct} cancelHref="/products" />
      </div>
    </>
  )
}
