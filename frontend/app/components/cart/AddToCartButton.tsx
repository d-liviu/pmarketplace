'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getApiBaseUrl } from '../../lib/apiBase'
import { getLocaleFromPathname, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

type AddToCartButtonProps = {
    pluginId: string | number
    label?: string
}

export default function AddToCartButton({
    pluginId,
    label
}: AddToCartButtonProps) {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'owned'>('idle')
    const [message, setMessage] = useState('')

    const handleClick = async () => {
        setStatus('loading')
        setMessage('')
        try {
            const res = await fetch(`${getApiBaseUrl()}/cart/add`, {
                method: 'POST',
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

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                if (res.status === 409) {
                    setStatus('owned')
                    setMessage(
                        data?.message ||
                            pickLocaleText(locale, {
                                en: 'Already owned',
                                fr: 'Déjà possédé',
                                es: 'Ya lo tienes',
                                'pt-br': 'Você já possui',
                                de: 'Bereits in deinem Besitz'
                            })
                    )
                    return
                }
                throw new Error(
                    data?.message ||
                        pickLocaleText(locale, {
                            en: 'Failed to add to cart',
                            fr: 'Impossible d’ajouter au panier',
                            es: 'No se pudo añadir al carrito',
                            'pt-br': 'Falha ao adicionar ao carrinho',
                            de: 'Hinzufügen zum Warenkorb fehlgeschlagen'
                        })
                )
            }

            setStatus('done')
        } catch (error) {
            console.error(error)
            setStatus('idle')
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
                className="btn-primary"
                onClick={handleClick}
                type="button"
                disabled={status === 'loading'}
            >
                {status === 'done'
                    ? pickLocaleText(locale, {
                          en: 'Added',
                          fr: 'Ajouté',
                          es: 'Añadido',
                          'pt-br': 'Adicionado',
                          de: 'Hinzugefügt'
                      })
                    : status === 'owned'
                      ? pickLocaleText(locale, {
                            en: 'Owned',
                            fr: 'Possédé',
                            es: 'Comprado',
                            'pt-br': 'Já adquirido',
                            de: 'Bereits gekauft'
                        })
                      : label ||
                        pickLocaleText(locale, {
                            en: 'Add to cart',
                            fr: 'Ajouter au panier',
                            es: 'Añadir al carrito',
                            'pt-br': 'Adicionar ao carrinho',
                            de: 'In den Warenkorb'
                        })}
            </button>
            {message && <span className="helper-text">{message}</span>}
        </div>
    )
}
