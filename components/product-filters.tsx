'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '@/lib/products'

const ALL = 'all'

export function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value || value === ALL) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router, searchParams],
  )

  // Debounce the free-text search.
  useEffect(() => {
    const handle = setTimeout(() => {
      if ((searchParams.get('q') ?? '') !== query) {
        updateParam('q', query || null)
      }
    }, 300)
    return () => clearTimeout(handle)
  }, [query, searchParams, updateParam])

  const category = searchParams.get('category') ?? ALL
  const status = searchParams.get('status') ?? ALL
  const hasFilters =
    query || category !== ALL || status !== ALL

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, MLA o descripción…"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Select
        value={category}
        onValueChange={(v) => updateParam('category', v)}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue>
            {(value) =>
              value === ALL ? 'Todas las categorías' : (value as string)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas las categorías</SelectItem>
          {PRODUCT_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => updateParam('status', v)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue>
            {(value) =>
              value === ALL ? 'Todos los estados' : (value as string)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos los estados</SelectItem>
          {PRODUCT_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQuery('')
            startTransition(() => router.replace(pathname))
          }}
        >
          <X className="size-4" />
          Limpiar
        </Button>
      )}
    </div>
  )
}
