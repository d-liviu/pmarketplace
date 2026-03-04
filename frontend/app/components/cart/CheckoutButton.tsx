'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getApiBaseUrl } from '../../lib/apiBase'
import { getLocaleFromPathname, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

export default function CheckoutButton() {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
        'idle'
    )
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleCheckout = async () => {
        setStatus('loading')
        setMessage('')
        try {
            const res = await fetch(`${getApiBaseUrl()}/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.status === 401) {
                window.location.assign(
                    `${withLocalePath('/login', locale)}?returnTo=${encodeURIComponent(withLocalePath('/checkout', locale))}`
                )
                return
            }

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                setStatus('error')
                setMessage(
                    data?.message ||
                        pickLocaleText(locale, {
                            en: 'Checkout failed',
                            fr: 'Échec du paiement',
                            es: 'El pago falló',
                            'pt-br': 'Falha no checkout',
                            de: 'Checkout fehlgeschlagen'
                        })
                )
                return
            }

            setStatus('done')
            router.push(withLocalePath('/checkout/confirmation', locale))
        } catch (error) {
            console.error(error)
            setStatus('error')
            setMessage(
                pickLocaleText(locale, {
                    en: 'Try again in a moment.',
                    fr: 'Réessayez dans un instant.',
                    es: 'Inténtalo de nuevo en un momento.',
                    'pt-br': 'Tente novamente em instantes.',
                    de: 'Bitte in einem Moment erneut versuchen.'
                })
            )
        }
    }

    return (
        <div className="button-stack">
            <button
                className="btn-primary checkout-action-button"
                type="button"
                onClick={handleCheckout}
                disabled={status === 'loading'}
            >
                {status === 'done'
                    ? pickLocaleText(locale, {
                          en: 'Order created',
                          fr: 'Commande créée',
                          es: 'Pedido creado',
                          'pt-br': 'Pedido criado',
                          de: 'Bestellung erstellt'
                      })
                    : status === 'error'
                      ? pickLocaleText(locale, {
                            en: 'Try again',
                            fr: 'Réessayer',
                            es: 'Intentar de nuevo',
                            'pt-br': 'Tentar novamente',
                            de: 'Erneut versuchen'
                        })
                      : pickLocaleText(locale, {
                            en: 'Complete purchase',
                            fr: 'Finaliser l’achat',
                            es: 'Completar compra',
                            'pt-br': 'Concluir compra',
                            de: 'Kauf abschließen'
                        })}
            </button>
            {message && <span className="helper-text">{message}</span>}
        </div>
    )
}
