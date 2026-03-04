'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getApiBaseUrl } from '../../lib/apiBase'
import { getLocaleFromPathname, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

type PurchaseButtonProps = {
    pluginId: string | number
}

export default function PurchaseButton({ pluginId }: PurchaseButtonProps) {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error' | 'owned'>(
        'idle'
    )
    const [message, setMessage] = useState('')

    const handlePurchase = async () => {
        setStatus('loading')
        setMessage('')
        try {
            const res = await fetch(`${getApiBaseUrl()}/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ pluginId })
            })

            if (res.status === 401) {
                window.location.assign(
                    `${withLocalePath('/login', locale)}?returnTo=${encodeURIComponent(withLocalePath('/account', locale))}`
                )
                return
            }

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                if (res.status === 409) {
                    setStatus('owned')
                    setMessage(
                        data?.message ||
                            pickLocaleText(locale, {
                                en: 'Already purchased',
                                fr: 'Déjà acheté',
                                es: 'Ya comprado',
                                'pt-br': 'Já comprado',
                                de: 'Bereits gekauft'
                            })
                    )
                    return
                }
                setStatus('error')
                setMessage(
                    data?.message ||
                        pickLocaleText(locale, {
                            en: 'Purchase failed',
                            fr: 'Achat échoué',
                            es: 'La compra falló',
                            'pt-br': 'A compra falhou',
                            de: 'Kauf fehlgeschlagen'
                        })
                )
                return
            }

            setStatus('done')
            window.location.assign(withLocalePath('/account', locale))
        } catch (error) {
            console.error(error)
            setStatus('error')
            setMessage(
                pickLocaleText(locale, {
                    en: 'Try again shortly.',
                    fr: 'Réessayez dans un instant.',
                    es: 'Vuelve a intentarlo en un momento.',
                    'pt-br': 'Tente novamente em instantes.',
                    de: 'Bitte in Kürze erneut versuchen.'
                })
            )
        }
    }

    return (
        <div className="button-stack">
            <button
                className="btn-primary"
                type="button"
                onClick={handlePurchase}
                disabled={status === 'loading'}
            >
                {status === 'loading'
                    ? pickLocaleText(locale, {
                          en: 'Processing...',
                          fr: 'Traitement...',
                          es: 'Procesando...',
                          'pt-br': 'Processando...',
                          de: 'Wird verarbeitet...'
                      })
                    : status === 'owned'
                      ? pickLocaleText(locale, {
                            en: 'Already owned',
                            fr: 'Déjà possédé',
                            es: 'Ya lo tienes',
                            'pt-br': 'Você já possui',
                            de: 'Bereits im Besitz'
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
                              en: 'Buy now',
                              fr: 'Acheter maintenant',
                              es: 'Comprar ahora',
                              'pt-br': 'Comprar agora',
                              de: 'Jetzt kaufen'
                          })}
            </button>
            {status === 'owned' && (
                <a className="text-link" href={withLocalePath('/account', locale)}>
                    {pickLocaleText(locale, {
                        en: 'Go to my account',
                        fr: 'Aller à mon compte',
                        es: 'Ir a mi cuenta',
                        'pt-br': 'Ir para minha conta',
                        de: 'Zu meinem Konto'
                    })}
                </a>
            )}
            {message && status !== 'owned' && (
                <span className="helper-text">{message}</span>
            )}
        </div>
    )
}
