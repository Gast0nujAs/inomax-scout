'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const SWIPE_THRESHOLD = 50

export function ProductGallery({
  images,
  name,
}: {
  images: string[]
  name: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const isOpen = openIndex !== null
  const total = images.length

  const goTo = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) =>
        current === null ? current : (current + direction + total) % total,
      )
    },
    [total],
  )

  useEffect(() => {
    if (!isOpen || total < 2) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') goTo(1)
      if (event.key === 'ArrowLeft') goTo(-1)
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [isOpen, total, goTo])

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null || total < 2) return
    const deltaX = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return
    goTo(deltaX < 0 ? 1 : -1)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Ampliar imagen ${index + 1} de ${total}`}
            className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-lg border border-border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Image
              src={url || '/placeholder.svg'}
              alt={`${name} - imagen ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 200px"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <span className="absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-md bg-background/80 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100">
              <Expand className="size-3.5" />
            </span>
          </button>
        ))}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null)
        }}
      >
        <DialogContent
          className="max-w-[calc(100%-1rem)] gap-0 overflow-hidden p-0 sm:max-w-4xl"
          showCloseButton
        >
          <DialogTitle className="sr-only">{name}</DialogTitle>
          {openIndex !== null && (
            <div
              className="relative h-[75vh] w-full bg-muted"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX
              }}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                key={images[openIndex]}
                src={images[openIndex] || '/placeholder.svg'}
                alt={`${name} - imagen ${openIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
                priority
              />

              {total > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => goTo(-1)}
                    aria-label="Imagen anterior"
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => goTo(1)}
                    aria-label="Imagen siguiente"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 text-xs font-medium tabular-nums text-foreground shadow-sm">
                    {openIndex + 1} / {total}
                  </span>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}