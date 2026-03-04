import type { Metadata } from 'next'
import Link from 'next/link'
import { withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../../lib/requestLocale'

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const canonical = withLocalePath('/checkout/confirmation', locale)

    return {
        title: pickLocaleText(locale, {
            en: 'Order confirmed | PMHub',
            fr: 'Commande confirmée | PMHub',
            es: 'Pedido confirmado | PMHub',
            'pt-br': 'Pedido confirmado | PMHub',
            de: 'Bestellung bestätigt | PMHub'
        }),
        description: pickLocaleText(locale, {
            en: 'Your PocketMine plugin order has been confirmed.',
            fr: 'Votre commande de plugin PocketMine a été confirmée.',
            es: 'Tu pedido de plugin PocketMine ha sido confirmado.',
            'pt-br': 'Seu pedido de plugin PocketMine foi confirmado.',
            de: 'Deine PocketMine-Plugin-Bestellung wurde bestätigt.'
        }),
        robots: {
            index: false,
            follow: false
        },
        alternates: {
            canonical,
            ...getLocaleAlternates('/checkout/confirmation')
        }
    }
}

export default async function CheckoutConfirmationPage() {
    const locale = await getRequestLocale()

    return (
        <section className="section">
            <div className="container confirmation-card">
                <div className="card">
                    <span className="hero-badge">
                        {pickLocaleText(locale, {
                            en: 'Order confirmed',
                            fr: 'Commande confirmée',
                            es: 'Pedido confirmado',
                            'pt-br': 'Pedido confirmado',
                            de: 'Bestellung bestätigt'
                        })}
                    </span>
                    <h1 className="page-title">
                        {pickLocaleText(locale, {
                            en: 'Thanks for your purchase',
                            fr: 'Merci pour votre achat',
                            es: 'Gracias por tu compra',
                            'pt-br': 'Obrigado pela sua compra',
                            de: 'Danke für deinen Einkauf'
                        })}
                    </h1>
                    <p className="page-subtitle">
                        {pickLocaleText(locale, {
                            en: 'Your plugins are now available in your account, including all versions and downloads.',
                            fr: 'Vos plugins sont maintenant disponibles dans votre compte, avec toutes les versions et téléchargements.',
                            es: 'Tus plugins ya están disponibles en tu cuenta, incluidas todas las versiones y descargas.',
                            'pt-br':
                                'Seus plugins agora estão disponíveis na sua conta, com todas as versões e downloads.',
                            de: 'Deine Plugins sind jetzt in deinem Konto verfügbar, inklusive aller Versionen und Downloads.'
                        })}
                    </p>
                    <div className="hero-actions">
                        <Link
                            href={withLocalePath('/account', locale)}
                            className="btn-primary"
                        >
                            {pickLocaleText(locale, {
                                en: 'My account',
                                fr: 'Mon compte',
                                es: 'Mi cuenta',
                                'pt-br': 'Minha conta',
                                de: 'Mein Konto'
                            })}
                        </Link>
                        <Link
                            href={withLocalePath('/plugins', locale)}
                            className="btn-secondary"
                        >
                            {pickLocaleText(locale, {
                                en: 'Keep browsing',
                                fr: 'Continuer à parcourir',
                                es: 'Seguir explorando',
                                'pt-br': 'Continuar navegando',
                                de: 'Weiter stöbern'
                            })}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
