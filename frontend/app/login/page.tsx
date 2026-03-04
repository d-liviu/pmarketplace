import type { Metadata } from 'next'
import AuthForm from '../components/auth/AuthForm'
import MediaImage from '../components/plugins/MediaImage'
import { withLocalePath } from '../lib/i18n'
import { pickLocaleText } from '../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../lib/requestLocale'

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const canonical = withLocalePath('/login', locale)

    return {
        title: pickLocaleText(locale, {
            en: 'Sign in | PMarketplace',
            fr: 'Connexion | PMarketplace',
            es: 'Iniciar sesión | PMarketplace',
            'pt-br': 'Entrar | PMarketplace',
            de: 'Anmelden | PMarketplace'
        }),
        description: pickLocaleText(locale, {
            en: 'Sign in to manage your marketplace purchases and plugin listings.',
            fr: 'Connectez-vous pour gérer vos achats de plugins PocketMine.',
            es: 'Inicia sesión para gestionar tus compras de plugins PocketMine.',
            'pt-br': 'Entre para gerenciar suas compras de plugins PocketMine.',
            de: 'Melde dich an, um deine PocketMine-Plugin-Käufe zu verwalten.'
        }),
        robots: {
            index: false,
            follow: false
        },
        alternates: {
            canonical,
            ...getLocaleAlternates('/login')
        }
    }
}

export default async function LoginPage() {
    const locale = await getRequestLocale()

    return (
        <>
            <section className="page-hero">
                <div className="container">
                    <span className="hero-badge">
                        {pickLocaleText(locale, {
                            en: 'Account',
                            fr: 'Compte',
                            es: 'Cuenta',
                            'pt-br': 'Conta',
                            de: 'Konto'
                        })}
                    </span>
                    <h1 className="page-title">
                        {pickLocaleText(locale, {
                            en: 'Welcome back',
                            fr: 'Bon retour',
                            es: 'Bienvenido de nuevo',
                            'pt-br': 'Bem-vindo de volta',
                            de: 'Willkommen zurück'
                        })}
                    </h1>
                    <p className="page-subtitle">
                        {pickLocaleText(locale, {
                            en: 'Sign in to access purchases, licenses, downloads, and creator tools.',
                            fr: 'Connectez-vous pour accéder à vos achats et téléchargements.',
                            es: 'Inicia sesión para acceder a tus compras y descargas.',
                            'pt-br':
                                'Entre para acessar suas compras e downloads.',
                            de: 'Melde dich an, um auf deine Käufe und Downloads zuzugreifen.'
                        })}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container auth-grid">
                    <AuthForm />
                    <div className="card">
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'Why sign in',
                                fr: 'Pourquoi se connecter',
                                es: 'Por qué iniciar sesión',
                                'pt-br': 'Por que entrar',
                                de: 'Warum anmelden'
                            })}
                        </h2>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Manage licenses, track orders, and publish plugin listings from one account.',
                                fr: 'Gérez vos licences, téléchargez les mises à jour et gardez vos plugins PocketMine organisés.',
                                es: 'Gestiona licencias, descarga actualizaciones y mantén tus plugins PocketMine organizados.',
                                'pt-br':
                                    'Gerencie licenças, baixe atualizações e mantenha seus plugins PocketMine organizados.',
                                de: 'Verwalte Lizenzen, lade Updates herunter und halte deine PocketMine-Plugins organisiert.'
                            })}
                        </p>
                        <MediaImage
                            src="/hero.jpeg"
                            fallbackSrc="/images/plugin-fallback.svg"
                            alt={pickLocaleText(locale, {
                                en: 'Account preview',
                                fr: 'Aperçu du compte',
                                es: 'Vista previa de la cuenta',
                                'pt-br': 'Prévia da conta',
                                de: 'Kontovorschau'
                            })}
                            className="media-image"
                        />
                    </div>
                </div>
            </section>
        </>
    )
}
