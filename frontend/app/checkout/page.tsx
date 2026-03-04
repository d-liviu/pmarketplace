import type { Metadata } from 'next'
import Link from 'next/link'
import { apiFetch } from '../lib/api'
import CheckoutButton from '../components/cart/CheckoutButton'
import MediaImage from '../components/plugins/MediaImage'
import { withLocalePath } from '../lib/i18n'
import { pickLocaleText } from '../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../lib/requestLocale'

type PluginMedia = {
    url: string
}

type CartItem = {
    id: number
    name: string
    slug?: string
    short_description?: string
    price: number | string
    is_free?: boolean | number
    media?: PluginMedia[]
}

type CartData = {
    id: number
    items: CartItem[]
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const canonical = withLocalePath('/checkout', locale)

    return {
        title: pickLocaleText(locale, {
            en: 'Checkout | PMHub',
            fr: 'Paiement | PMHub',
            es: 'Pago | PMHub',
            'pt-br': 'Checkout | PMHub',
            de: 'Checkout | PMHub'
        }),
        description: pickLocaleText(locale, {
            en: 'Complete your PocketMine-MP plugin purchase securely.',
            fr: 'Finalisez votre achat de plugins PocketMine-MP en toute sécurité.',
            es: 'Completa tu compra de plugins PocketMine-MP de forma segura.',
            'pt-br': 'Conclua sua compra de plugins PocketMine-MP com segurança.',
            de: 'Schließe deinen PocketMine-MP-Plugin-Kauf sicher ab.'
        }),
        robots: {
            index: false,
            follow: false
        },
        alternates: {
            canonical,
            ...getLocaleAlternates('/checkout')
        }
    }
}

const fallbackImage = '/images/plugin-fallback.svg'

async function getCart() {
    const res = await apiFetch('/cart')
    if (!res.ok) {
        return null
    }

    const data: unknown = await res.json()
    if (!data || typeof data !== 'object') {
        return null
    }

    const parsed = data as CartData
    if (!Array.isArray(parsed.items)) {
        return null
    }

    return parsed
}

function formatCartTotal(items: CartItem[]) {
    const total = items
        .filter((item) => !Boolean(item.is_free))
        .reduce((sum, item) => sum + Number(item.price || 0), 0)

    return `$${total.toFixed(2)}`
}

export default async function CheckoutPage() {
    const locale = await getRequestLocale()
    const cart = await getCart()
    const items = cart?.items ?? []
    const hasItems = items.length > 0

    return (
        <>
            <section className="page-hero">
                <div className="container">
                    <span className="hero-badge">
                        {pickLocaleText(locale, {
                            en: 'Checkout',
                            fr: 'Paiement',
                            es: 'Pago',
                            'pt-br': 'Checkout',
                            de: 'Checkout'
                        })}
                    </span>
                    <h1 className="page-title">
                        {pickLocaleText(locale, {
                            en: 'Secure checkout',
                            fr: 'Paiement sécurisé',
                            es: 'Pago seguro',
                            'pt-br': 'Checkout seguro',
                            de: 'Sicherer Checkout'
                        })}
                    </h1>
                    <p className="page-subtitle">
                        {pickLocaleText(locale, {
                            en: 'Fast purchase, instant access.',
                            fr: 'Achat rapide, accès instantané.',
                            es: 'Compra rápida, acceso instantáneo.',
                            'pt-br': 'Compra rápida, acesso instantâneo.',
                            de: 'Schneller Kauf, sofortiger Zugriff.'
                        })}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container checkout-grid">
                    <div
                        className="card form-grid"
                        aria-label={pickLocaleText(locale, {
                            en: 'Checkout form',
                            fr: 'Formulaire de paiement',
                            es: 'Formulario de pago',
                            'pt-br': 'Formulário de checkout',
                            de: 'Checkout-Formular'
                        })}
                    >
                        <div className="field">
                            <label htmlFor="full-name">
                                {pickLocaleText(locale, {
                                    en: 'Full name',
                                    fr: 'Nom complet',
                                    es: 'Nombre completo',
                                    'pt-br': 'Nome completo',
                                    de: 'Vollständiger Name'
                                })}
                            </label>
                            <input
                                id="full-name"
                                name="full-name"
                                placeholder={pickLocaleText(locale, {
                                    en: 'Your name',
                                    fr: 'Votre nom',
                                    es: 'Tu nombre',
                                    'pt-br': 'Seu nome',
                                    de: 'Dein Name'
                                })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@email.com"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="server">
                                {pickLocaleText(locale, {
                                    en: 'PocketMine server',
                                    fr: 'Serveur PocketMine',
                                    es: 'Servidor PocketMine',
                                    'pt-br': 'Servidor PocketMine',
                                    de: 'PocketMine-Server'
                                })}
                            </label>
                            <input
                                id="server"
                                name="server"
                                placeholder={
                                    pickLocaleText(locale, {
                                        en: 'Server name or IP',
                                        fr: 'Nom du serveur ou IP',
                                        es: 'Nombre del servidor o IP',
                                        'pt-br': 'Nome do servidor ou IP',
                                        de: 'Servername oder IP'
                                    })
                                }
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="notes">
                                {pickLocaleText(locale, {
                                    en: 'Order notes',
                                    fr: 'Notes de commande',
                                    es: 'Notas del pedido',
                                    'pt-br': 'Notas do pedido',
                                    de: 'Bestellnotizen'
                                })}
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                placeholder={
                                    pickLocaleText(locale, {
                                        en: 'Anything we should know?',
                                        fr: 'Quelque chose à préciser ?',
                                        es: '¿Algo que debamos saber?',
                                        'pt-br': 'Algo que devemos saber?',
                                        de: 'Gibt es etwas, das wir wissen sollten?'
                                    })
                                }
                            />
                        </div>
                        <div className="form-actions checkout-actions">
                            {hasItems ? (
                                <CheckoutButton />
                            ) : (
                                <span className="helper-text">
                                    {pickLocaleText(locale, {
                                        en: 'Add a plugin to your cart to checkout.',
                                        fr: 'Ajoutez un plugin au panier pour passer au paiement.',
                                        es: 'Añade un plugin al carrito para pagar.',
                                        'pt-br':
                                            'Adicione um plugin ao carrinho para finalizar.',
                                        de: 'Füge ein Plugin zum Warenkorb hinzu, um zur Kasse zu gehen.'
                                    })}
                                </span>
                            )}
                            <Link
                                href={withLocalePath('/cart', locale)}
                                className="btn-secondary checkout-action-button"
                            >
                                {pickLocaleText(locale, {
                                    en: 'Back to cart',
                                    fr: 'Retour au panier',
                                    es: 'Volver al carrito',
                                    'pt-br': 'Voltar ao carrinho',
                                    de: 'Zurück zum Warenkorb'
                                })}
                            </Link>
                        </div>
                    </div>

                    <div className="card summary-card">
                        <h3>
                            {pickLocaleText(locale, {
                                en: 'Order summary',
                                fr: 'Résumé de commande',
                                es: 'Resumen del pedido',
                                'pt-br': 'Resumo do pedido',
                                de: 'Bestellübersicht'
                            })}
                        </h3>
                        {!cart ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'Please sign in to continue checkout.',
                                    fr: 'Connectez-vous pour continuer le paiement.',
                                    es: 'Inicia sesión para continuar con el pago.',
                                    'pt-br': 'Entre para continuar o checkout.',
                                    de: 'Melde dich an, um mit dem Checkout fortzufahren.'
                                })}{' '}
                                <Link
                                    href={withLocalePath('/login', locale)}
                                    className="text-link"
                                >
                                    {pickLocaleText(locale, {
                                        en: 'Sign in',
                                        fr: 'Connexion',
                                        es: 'Iniciar sesión',
                                        'pt-br': 'Entrar',
                                        de: 'Anmelden'
                                    })}
                                </Link>
                            </p>
                        ) : items.length === 0 ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'Your cart is empty.',
                                    fr: 'Votre panier est vide.',
                                    es: 'Tu carrito está vacío.',
                                    'pt-br': 'Seu carrinho está vazio.',
                                    de: 'Dein Warenkorb ist leer.'
                                })}
                            </p>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="summary-row">
                                    <span>{item.name}</span>
                                    <strong>
                                        {item.is_free
                                            ? pickLocaleText(locale, {
                                                  en: 'Free',
                                                  fr: 'Gratuit',
                                                  es: 'Gratis',
                                                  'pt-br': 'Gratuito',
                                                  de: 'Kostenlos'
                                              })
                                            : `$${Number(item.price).toFixed(2)}`}
                                    </strong>
                                </div>
                            ))
                        )}
                        <div className="summary-row">
                            <span>
                                {pickLocaleText(locale, {
                                    en: 'Total',
                                    fr: 'Total',
                                    es: 'Total',
                                    'pt-br': 'Total',
                                    de: 'Gesamt'
                                })}
                            </span>
                            <strong>{cart ? formatCartTotal(items) : '$0.00'}</strong>
                        </div>
                        <MediaImage
                            src="/hero.jpeg"
                            fallbackSrc={fallbackImage}
                            alt={pickLocaleText(locale, {
                                en: 'Checkout preview',
                                fr: 'Aperçu du paiement',
                                es: 'Vista previa del pago',
                                'pt-br': 'Prévia do checkout',
                                de: 'Checkout-Vorschau'
                            })}
                            className="media-image media-image--wide"
                        />
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Access details are delivered instantly after payment.',
                                fr: 'Les accès sont livrés instantanément après paiement.',
                                es: 'Los accesos se entregan instantáneamente tras el pago.',
                                'pt-br':
                                    'Os acessos são entregues instantaneamente após o pagamento.',
                                de: 'Die Zugangsdaten werden direkt nach der Zahlung bereitgestellt.'
                            })}
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}
