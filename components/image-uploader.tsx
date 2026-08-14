'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[]
  onChange: (images: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error ?? 'No se pudo subir la imagen.')
          continue
        }
        uploaded.push(data.url)
      } catch {
        toast.error('Error de red al subir la imagen.')
      }
    }

    if (uploaded.length) {
      onChange([...value, ...uploaded])
      toast.success(
        uploaded.length === 1
          ? 'Imagen subida.'
          : `${uploaded.length} imágenes subidas.`,
      )
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeImage(url: string) {
    onChange(value.filter((v) => v !== url))
  }

  return (
    <div className="space-y-3">
      {/* Hidden inputs so the URLs are submitted with the form */}
      {value.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}

      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="group relative size-24 overflow-hidden rounded-lg border border-border bg-muted"
          >
            <Image
              src={url || '/placeholder.svg'}
              alt="Imagen del producto"
              fill
              sizes="96px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
              aria-label="Eliminar imagen"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary',
            uploading && 'pointer-events-none opacity-60',
          )}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <UploadCloud className="size-5" />
          )}
          <span>{uploading ? 'Subiendo…' : 'Subir'}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG, WEBP o GIF. Hasta 8 MB por imagen.
      </p>
    </div>
  )
}
