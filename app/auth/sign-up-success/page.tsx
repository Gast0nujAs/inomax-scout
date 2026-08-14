import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <MailCheck className="size-6" />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Revisá tu email
        </h2>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Te enviamos un enlace de confirmación. Confirmá tu cuenta desde ese
          correo y después vas a poder iniciar sesión.
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full"
        render={<Link href="/auth/login" />}
      >
        Volver a iniciar sesión
      </Button>
    </div>
  )
}
