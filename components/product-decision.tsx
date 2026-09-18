'use client'

import { useTransition } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { setProductStatus } from '@/app/(app)/products/actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProductStatus } from '@/lib/products'

export function ProductDecision({
  id,
  status,
  className,
}: {
  id: string
  status: ProductStatus
  className?: string
}) {
  const [isPending, startTransition] = useTransition()

  const isApproved = status === 'Aprobado'
  const isDiscarded = status === 'Descartado'

  function decide(next: ProductStatus) {
    startTransition(async () => {
      const result = await setProductStatus(id, next)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(
          next === 'Aprobado' ? 'Producto aprobado' : 'Producto descartado',
        )
      }
    })
  }

  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <Button
        type="button"
        size="sm"
        variant={isApproved ? 'default' : 'outline'}
        disabled={isPending}
        aria-pressed={isApproved}
        onClick={() => decide('Aprobado')}
        className={cn(
          isApproved &&
            'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600',
          !isApproved &&
            'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950',
        )}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
        Aprobar
      </Button>
      <Button
        type="button"
        size="sm"
        variant={isDiscarded ? 'default' : 'outline'}
        disabled={isPending}
        aria-pressed={isDiscarded}
        onClick={() => decide('Descartado')}
        className={cn(
          isDiscarded &&
            'bg-rose-600 text-white hover:bg-rose-700 border-rose-600',
          !isDiscarded &&
            'text-rose-700 hover:text-rose-800 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950',
        )}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <X className="size-4" />
        )}
        Descartar
      </Button>
    </div>
  )
}
