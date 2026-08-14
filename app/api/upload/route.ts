import { NextResponse, type NextRequest } from 'next/server'
import type { UploadApiResponse } from 'cloudinary'
import { createClient } from '@/lib/supabase/server'
import { cloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  // Only authenticated team members can upload.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          'Cloudinary no está configurado. Falta definir las variables de entorno.',
      },
      { status: 503 },
    )
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'No se recibió ningún archivo.' },
      { status: 400 },
    )
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: 'Formato no permitido. Usá JPG, PNG, WEBP o GIF.' },
      { status: 400 },
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'La imagen supera el límite de 8 MB.' },
      { status: 400 },
    )
  }

  const bytes = Buffer.from(await file.arrayBuffer())

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'inomax-product-scout', resource_type: 'image' },
          (error, res) => {
            if (error || !res) reject(error ?? new Error('Upload failed'))
            else resolve(res)
          },
        )
        .end(bytes)
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.log('[v0] cloudinary upload error:', error)
    return NextResponse.json(
      { error: 'No se pudo subir la imagen. Intentá nuevamente.' },
      { status: 500 },
    )
  }
}
