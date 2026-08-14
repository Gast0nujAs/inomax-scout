import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Algo salió mal
        </h2>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          No pudimos completar la autenticación. El enlace puede haber expirado
          o ya haber sido utilizado.
        </p>
      </div>
      <Button className="w-full" render={<Link href="/auth/login" />}>
        Volver a iniciar sesión
      </Button>
    </div>
  )
}
