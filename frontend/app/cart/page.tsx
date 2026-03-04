import type { Metadata } from 'next'
import Link from 'next/link'
import { apiFetch } from '../lib/api'
import MediaImage from '../components/plugins/MediaImage'
import RemoveFromCartButton from '../components/cart/RemoveFromCartButton'
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
    const canonical = withLocalePath('/cart', locale)

    return {
        title: pickLocaleText(locale, {
            en: 'Cart | PMHub',
            fr: 'Panier | PMHub',
            es: 'Carrito | PMHub',
            'pt-br': 'Carrinho | PMHub',
            de: 'Warenkorb | PMHub'
        }),
        description: pickLocaleText(locale, {
            en: 'Review your PocketMine-MP plugin selections before checkout.',
            fr: 'Vérifiez vos plugins PocketMine-MP avant paiement.',
            es: 'Revisa tus plugins PocketMine-MP antes de pagar.',
            'pt-br': 'Revise seus plugins PocketMine-MP antes do checkout.',
            de: 'Prüfe deine PocketMine-MP-Plugin-Auswahl vor dem Checkout.'
        }),
        robots: {
            index: false,
            follow: false
        },
        alternates: {
            canonical,
            ...getLocaleAlternates('/cart')
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

export default async function CartPage() {
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
                            en: 'Cart',
                            fr: 'Panier',
                            es: 'Carrito',
                            'pt-br': 'Carrinho',
                            de: 'Warenkorb'
                        })}
                    </span>
                    <h1 className="page-title">
                        {pickLocaleText(locale, {
                            en: 'Your cart',
                            fr: 'Votre panier',
                            es: 'Tu carrito',
                            'pt-br': 'Seu carrinho',
                            de: 'Dein Warenkorb'
                        })}
                    </h1>
                    <p className="page-subtitle">
                        {pickLocaleText(locale, {
                            en: 'Quick review, then checkout in seconds.',
                            fr: 'Vérification rapide, puis paiement en quelques secondes.',
                            es: 'Revisión rápida y pago en segundos.',
                            'pt-br': 'Revisão rápida e checkout em segundos.',
                            de: 'Schnelle Prüfung, dann Checkout in Sekunden.'
                        })}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container cart-grid">
                    <div className="card">
                        {!cart ? (
                            <div className="empty-state">
                                {pickLocaleText(locale, {
                                    en: 'Please sign in to view your cart.',
                                    fr: 'Connectez-vous pour voir votre panier.',
                                    es: 'Inicia sesión para ver tu carrito.',
                                    'pt-br': 'Entre para ver seu carrinho.',
                                    de: 'Melde dich an, um deinen Warenkorb zu sehen.'
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
                            </div>
                        ) : items.length === 0 ? (
                            <div className="empty-state">
                                {pickLocaleText(locale, {
                                    en: 'Your cart is empty.',
                                    fr: 'Votre panier est vide.',
                                    es: 'Tu carrito está vacío.',
                                    'pt-br': 'Seu carrinho está vazio.',
                                    de: 'Dein Warenkorb ist leer.'
                                })}
                            </div>
                        ) : (
                            <div className="cart-list">
                                {items.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <MediaImage
                                            src={item.media?.[0]?.url || fallbackImage}
                                            fallbackSrc={fallbackImage}
                                            alt={item.name}
                                            className="media-image"
                                        />
                                        <div className="cart-item-info">
                                            <h3>{item.name}</h3>
                                            <p>{item.short_description}</p>
                                            <span className="price-badge">
                                                {item.is_free
                                                    ? pickLocaleText(locale, {
                                                          en: 'Free',
                                                          fr: 'Gratuit',
                                                          es: 'Gratis',
                                                          'pt-br': 'Gratuito',
                                                          de: 'Kostenlos'
                                                      })
                                                    : `$${Number(item.price).toFixed(2)}`}
                                            </span>
                                            <RemoveFromCartButton pluginId={item.id} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            <strong>
                                {cart ? formatCartTotal(items) : '$0.00'}
                            </strong>
                        </div>
                        <div className="summary-actions">
                            {hasItems && (
                                <Link
                                    href={withLocalePath('/checkout', locale)}
                                    className="btn-primary"
                                >
                                    {pickLocaleText(locale, {
                                        en: 'Continue to checkout',
                                        fr: 'Continuer vers le paiement',
                                        es: 'Continuar al pago',
                                        'pt-br': 'Continuar para checkout',
                                        de: 'Weiter zum Checkout'
                                    })}
                                </Link>
                            )}
                            <Link
                                href={withLocalePath('/plugins', locale)}
                                className="btn-secondary"
                            >
                                {pickLocaleText(locale, {
                                    en: 'Keep shopping',
                                    fr: 'Continuer vos achats',
                                    es: 'Seguir comprando',
                                    'pt-br': 'Continuar comprando',
                                    de: 'Weiter einkaufen'
                                })}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
