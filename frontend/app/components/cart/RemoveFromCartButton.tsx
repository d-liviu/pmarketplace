'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getApiBaseUrl } from '../../lib/apiBase'
import { getLocaleFromPathname, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

type RemoveFromCartButtonProps = {
    pluginId: string | number
}

export default function RemoveFromCartButton({ pluginId }: RemoveFromCartButtonProps) {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const [status, setStatus] = useState<'idle' | 'loading'>('idle')
    const router = useRouter()

    const handleRemove = async () => {
        setStatus('loading')
        try {
            const res = await fetch(`${getApiBaseUrl()}/cart/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ pluginId })
            })

            if (res.status === 401) {
                window.location.assign(
                    `${withLocalePath('/login', locale)}?returnTo=${encodeURIComponent(withLocalePath('/cart', locale))}`
                )
                return
            }

            if (!res.ok) {
                throw new Error(
                    pickLocaleText(locale, {
                        en: 'Failed to remove item',
                        fr: 'Suppression impossible',
                        es: 'No se pudo eliminar',
                        'pt-br': 'Falha ao remover',
                        de: 'Entfernen fehlgeschlagen'
                    })
                )
            }

            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setStatus('idle')
        }
    }

    return (
        <button
            type="button"
            className="btn-secondary btn-small"
            onClick={handleRemove}
            disabled={status === 'loading'}
        >
            {status === 'loading'
                ? pickLocaleText(locale, {
                      en: 'Removing...',
                      fr: 'Suppression...',
                      es: 'Eliminando...',
                      'pt-br': 'Removendo...',
                      de: 'Wird entfernt...'
                  })
                : pickLocaleText(locale, {
                      en: 'Remove',
                      fr: 'Supprimer',
                      es: 'Eliminar',
                      'pt-br': 'Remover',
                      de: 'Entfernen'
                  })}
        </button>
    )
}
