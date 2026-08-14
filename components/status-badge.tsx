import { cn } from '@/lib/utils'
import { STATUS_STYLES, type ProductStatus } from '@/lib/products'

export function StatusBadge({
  status,
  className,
}: {
  status: ProductStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status] ?? STATUS_STYLES.Pendiente,
        className,
      )}
    >
      {status}
    </span>
  )
}
