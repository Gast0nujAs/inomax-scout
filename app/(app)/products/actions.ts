'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_STATUSES, type ProductStatus } from '@/lib/products'

export interface ProductActionState {
  error?: string
}

function parseForm(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const category = (formData.get('category') as string)?.trim() || null
  const rawStatus = (formData.get('status') as string)?.trim()
  const status: ProductStatus = PRODUCT_STATUSES.includes(
    rawStatus as ProductStatus,
  )
    ? (rawStatus as ProductStatus)
    : 'Pendiente'
  const mla = (formData.get('mla') as string)?.trim() || null
  const mercadolibre_url =
    (formData.get('mercadolibre_url') as string)?.trim() || null

  const priceRaw = (formData.get('price') as string)?.trim()
  const price = priceRaw ? Number(priceRaw) : null

  const characteristics = (formData.getAll('characteristics') as string[])
    .map((c) => c.trim())
    .filter(Boolean)

  const images = (formData.getAll('images') as string[])
    .map((c) => c.trim())
    .filter(Boolean)

  return {
    name,
    description,
    category,
    status,
    mla,
    mercadolibre_url,
    price,
    characteristics,
    images,
  }
}

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Sesión expirada. Volvé a iniciar sesión.' }

  const values = parseForm(formData)

  if (!values.name) return { error: 'El nombre del producto es obligatorio.' }
  if (values.price != null && (Number.isNaN(values.price) || values.price < 0))
    return { error: 'El precio debe ser un número válido.' }

  const { error } = await supabase
    .from('products')
    .insert({ ...values, created_by: user.id })

  if (error) {
    console.log('[v0] createProduct error:', error.message)
    return { error: 'No se pudo crear el producto. Intentá nuevamente.' }
  }

  revalidatePath('/products')
  revalidatePath('/dashboard')
  redirect('/products')
}

export async function updateProduct(
  id: string,
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Sesión expirada. Volvé a iniciar sesión.' }

  const values = parseForm(formData)

  if (!values.name) return { error: 'El nombre del producto es obligatorio.' }
  if (values.price != null && (Number.isNaN(values.price) || values.price < 0))
    return { error: 'El precio debe ser un número válido.' }

  const { error } = await supabase
    .from('products')
    .update(values)
    .eq('id', id)

  if (error) {
    console.log('[v0] updateProduct error:', error.message)
    return { error: 'No se pudo actualizar el producto. Intentá nuevamente.' }
  }

  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
  revalidatePath('/dashboard')
  redirect(`/products/${id}`)
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    console.log('[v0] deleteProduct error:', error.message)
    return
  }

  revalidatePath('/products')
  revalidatePath('/dashboard')
  redirect('/products')
}
