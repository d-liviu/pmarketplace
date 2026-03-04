'use client'

import { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getApiBaseUrl } from '../../lib/apiBase'
import {
    getLocaleFromPathname,
    stripLocaleFromPathname,
    withLocalePath
} from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'
import styles from './AuthForm.module.css'

type Mode = 'login' | 'register'

export default function AuthForm() {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const searchParams = useSearchParams()
    const requestedReturnTo = searchParams.get('returnTo')
    const returnTo =
        requestedReturnTo && requestedReturnTo.startsWith('/')
            ? (stripLocaleFromPathname(requestedReturnTo).locale
                  ? requestedReturnTo
                  : withLocalePath(requestedReturnTo, locale))
            : withLocalePath('/account', locale)
    const [mode, setMode] = useState<Mode>('login')
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>(
        'idle'
    )
    const [message, setMessage] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setStatus('loading')
        setMessage('')

        const formData = new FormData(event.currentTarget)
        const payload = Object.fromEntries(formData.entries())

        try {
            const res = await fetch(
                `${getApiBaseUrl()}/auth/${
                    mode === 'login' ? 'login' : 'register'
                }`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                }
            )

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                setMessage(
                    data?.message ||
                        pickLocaleText(locale, {
                            en: 'Authentication failed',
                            fr: 'Échec de l’authentification',
                            es: 'Error de autenticación',
                            'pt-br': 'Falha na autenticação',
                            de: 'Authentifizierung fehlgeschlagen'
                        })
                )
                setStatus('error')
                return
            }

            setStatus('done')
            window.location.assign(returnTo)
        } catch (error) {
            console.error(error)
            setMessage(
                pickLocaleText(locale, {
                    en: 'Network error, please try again',
                    fr: 'Erreur réseau, veuillez réessayer',
                    es: 'Error de red, inténtalo de nuevo',
                    'pt-br': 'Erro de rede, tente novamente',
                    de: 'Netzwerkfehler, bitte erneut versuchen'
                })
            )
            setStatus('error')
        }
    }

    return (
        <div className="card form-grid">
            <div className={styles.toggleRow}>
                <button
                    type="button"
                    className={`${styles.toggleButton} ${
                        mode === 'login' ? styles.toggleButtonActive : ''
                    }`}
                    onClick={() => setMode('login')}
                >
                    {pickLocaleText(locale, {
                        en: 'Sign in',
                        fr: 'Connexion',
                        es: 'Iniciar sesión',
                        'pt-br': 'Entrar',
                        de: 'Anmelden'
                    })}
                </button>
                <button
                    type="button"
                    className={`${styles.toggleButton} ${
                        mode === 'register' ? styles.toggleButtonActive : ''
                    }`}
                    onClick={() => setMode('register')}
                >
                    {pickLocaleText(locale, {
                        en: 'Create account',
                        fr: 'Créer un compte',
                        es: 'Crear cuenta',
                        'pt-br': 'Criar conta',
                        de: 'Konto erstellen'
                    })}
                </button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
                {mode === 'register' && (
                    <div className="field">
                        <label htmlFor="username">
                            {pickLocaleText(locale, {
                                en: 'Username',
                                fr: 'Nom d’utilisateur',
                                es: 'Nombre de usuario',
                                'pt-br': 'Nome de usuário',
                                de: 'Benutzername'
                            })}
                        </label>
                        <input
                            id="username"
                            name="username"
                            placeholder={
                                pickLocaleText(locale, {
                                    en: 'Your username',
                                    fr: 'Votre nom d’utilisateur',
                                    es: 'Tu nombre de usuario',
                                    'pt-br': 'Seu nome de usuário',
                                    de: 'Dein Benutzername'
                                })
                            }
                            required
                        />
                    </div>
                )}
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        required
                    />
                </div>
                <div className="field">
                    <label htmlFor="password">
                        {pickLocaleText(locale, {
                            en: 'Password',
                            fr: 'Mot de passe',
                            es: 'Contraseña',
                            'pt-br': 'Senha',
                            de: 'Passwort'
                        })}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <div className={`form-actions ${styles.submitRow}`}>
                    <button className="btn-primary" type="submit">
                        {status === 'loading'
                            ? pickLocaleText(locale, {
                                  en: 'Submitting...',
                                  fr: 'Envoi...',
                                  es: 'Enviando...',
                                  'pt-br': 'Enviando...',
                                  de: 'Wird gesendet...'
                              })
                            : mode === 'login'
                              ? pickLocaleText(locale, {
                                    en: 'Sign in',
                                    fr: 'Connexion',
                                    es: 'Iniciar sesión',
                                    'pt-br': 'Entrar',
                                    de: 'Anmelden'
                                })
                              : pickLocaleText(locale, {
                                    en: 'Create account',
                                    fr: 'Créer un compte',
                                    es: 'Crear cuenta',
                                    'pt-br': 'Criar conta',
                                    de: 'Konto erstellen'
                                })}
                    </button>
                </div>
                {status === 'error' && (
                    <p className={styles.errorText} role="alert">
                        {message ||
                            pickLocaleText(locale, {
                                en: 'Try again',
                                fr: 'Réessayez',
                                es: 'Inténtalo de nuevo',
                                'pt-br': 'Tente novamente',
                                de: 'Bitte erneut versuchen'
                            })}
                    </p>
                )}
            </form>
        </div>
    )
}
