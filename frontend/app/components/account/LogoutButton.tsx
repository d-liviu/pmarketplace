'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getApiBaseUrl } from '../../lib/apiBase'
import { getLocaleFromPathname, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

export default function LogoutButton() {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleLogout = async () => {
        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch(`${getApiBaseUrl()}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                setStatus('error')
                setMessage(
                    data?.message ||
                        pickLocaleText(locale, {
                            en: 'Unable to sign out',
                            fr: 'Impossible de se déconnecter',
                            es: 'No se pudo cerrar sesión',
                            'pt-br': 'Não foi possível sair da conta',
                            de: 'Abmeldung fehlgeschlagen'
                        })
                )
                return
            }

            window.location.assign(withLocalePath('/login', locale))
        } catch (error) {
            console.error(error)
            setStatus('error')
            setMessage(
                pickLocaleText(locale, {
                    en: 'Network error, please try again',
                    fr: 'Erreur réseau, veuillez réessayer',
                    es: 'Error de red, inténtalo de nuevo',
                    'pt-br': 'Erro de rede, tente novamente',
                    de: 'Netzwerkfehler, bitte erneut versuchen'
                })
            )
        }
    }

    return (
        <div className="form-grid">
            <button
                type="button"
                className="btn-secondary btn-small"
                onClick={handleLogout}
                disabled={status === 'loading'}
            >
                {status === 'loading'
                    ? pickLocaleText(locale, {
                          en: 'Signing out...',
                          fr: 'Déconnexion...',
                          es: 'Cerrando sesión...',
                          'pt-br': 'Saindo...',
                          de: 'Abmeldung...'
                      })
                    : pickLocaleText(locale, {
                          en: 'Sign out',
                          fr: 'Déconnexion',
                          es: 'Cerrar sesión',
                          'pt-br': 'Sair',
                          de: 'Abmelden'
                      })}
            </button>
            {status === 'error' && <span className="chip">{message}</span>}
        </div>
    )
}
