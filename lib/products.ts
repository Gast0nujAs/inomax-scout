export type ProductStatus =
  | 'Pendiente'
  | 'En revisión'
  | 'Sugerencia de Compra'
  | 'Aprobado'
  | 'Descartado'

export const PRODUCT_STATUSES: ProductStatus[] = [
  'Pendiente',
  'En revisión',
  'Sugerencia de Compra',
  'Aprobado',
  'Descartado',
]

export const PRODUCT_CATEGORIES = [
  'Muebles y Jardin',
  'Construcción',
  'Herramientas',
  'Industrias y Oficinas',
  'Arte, Libreria y Merceria',
  'Accesorios para Vehiculos',
  'Deportes y Fitness',
  'Ropa y Accesorios',
  'Otros',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export interface Product {
  id: string
  name: string
  description: string | null
  category: string | null
  status: ProductStatus
  price: number | null
  mla: string | null
  mercadolibre_url: string | null
  characteristics: string[]
  images: string[]
  created_by: string | null
  created_at: string
  updated_at: string
}

// Tailwind classes per status for badges.
export const STATUS_STYLES: Record<ProductStatus, string> = {
  Pendiente: 'bg-muted text-muted-foreground border-border',
  'En revisión':
    'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200',
  Aprobado:
    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200',
  Descartado:
    'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200',
  'Sugerencia de Compra':
    'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-200',
}

export function formatPrice(price: number | null): string {
  if (price == null) return '—'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
