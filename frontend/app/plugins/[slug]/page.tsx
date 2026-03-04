import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Script from 'next/script'
import { toSlug } from '../../lib/slug'
import AddToCartButton from '../../components/cart/AddToCartButton'
import PurchaseButton from '../../components/plugins/PurchaseButton'
import VersionAccordion from '../../components/plugins/VersionAccordion'
import { getApiBaseUrl } from '../../lib/apiBase'
import MediaImage from '../../components/plugins/MediaImage'
import { apiFetch } from '../../lib/api'
import { type Locale, getOpenGraphLocale, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../../lib/requestLocale'
import { resolveMediaUrl } from '../../lib/media'

const apiBaseUrl = getApiBaseUrl()

const fallbackImage = '/images/plugin-fallback.svg'

type Plugin = {
    id?: string | number
    name: string
    slug?: string
    short_description?: string
    full_description?: string
    price?: number | string
    is_free?: boolean
    tags?: string[]
    featured?: boolean | number
}

type Version = {
    id: string | number
    version: string
    changelog?: string
    pocketmine_version?: string
    created_at?: string
}

type Media = {
    id: string | number
    type: 'image' | 'video'
    url: string
    position: number
}

async function fetchPluginBySlug(slug: string): Promise<Plugin | null> {
    try {
        const res = await fetch(`${apiBaseUrl}/plugins/${slug}`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return null
        }

        return await res.json()
    } catch (error) {
        console.error('Failed to load plugin', error)
        return null
    }
}

async function fetchPlugins(): Promise<Plugin[]> {
    try {
        const res = await fetch(`${apiBaseUrl}/plugins`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return []
        }

        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Failed to load plugins', error)
        return []
    }
}

async function fetchVersions(pluginId?: string | number) {
    if (!pluginId) {
        return []
    }

    try {
        const res = await fetch(`${apiBaseUrl}/plugins/${pluginId}/versions`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return []
        }

        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Failed to load versions', error)
        return []
    }
}

async function fetchMedia(pluginId?: string | number) {
    if (!pluginId) {
        return []
    }

    try {
        const res = await fetch(`${apiBaseUrl}/plugins/${pluginId}/media`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return []
        }

        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Failed to load media', error)
        return []
    }
}

async function getPlugin(slug: string): Promise<Plugin | null> {
    const direct = await fetchPluginBySlug(slug)
    if (direct) {
        return direct
    }

    const normalizedSlug = toSlug(slug)
    if (!normalizedSlug) {
        return null
    }

    const list = await fetchPlugins()

    const match = list.find((plugin) => {
        if (plugin.slug && toSlug(plugin.slug) === normalizedSlug) {
            return true
        }

        if (plugin.name && toSlug(plugin.name) === normalizedSlug) {
            return true
        }

        if (plugin.id !== undefined && String(plugin.id) === slug) {
            return true
        }

        return false
    })

    if (!match) {
        return null
    }

    if (match.slug && match.slug !== slug) {
        const bySlug = await fetchPluginBySlug(match.slug)
        return bySlug ?? match
    }

    return match
}

function formatPrice(plugin: Plugin, locale: Locale) {
    if (plugin.is_free) {
        return pickLocaleText(locale, {
            en: 'Free',
            fr: 'Gratuit',
            es: 'Gratis',
            'pt-br': 'Gratuito',
            de: 'Kostenlos'
        })
    }

    if (plugin.price !== undefined && plugin.price !== null) {
        const numericPrice = Number(plugin.price)
        if (!Number.isNaN(numericPrice)) {
            return `$${numericPrice.toFixed(2)}`
        }
    }

    return pickLocaleText(locale, {
        en: 'Custom',
        fr: 'Sur mesure',
        es: 'Personalizado',
        'pt-br': 'Personalizado',
        de: 'Individuell'
    })
}

function getOfferSchema(plugin: Plugin) {
    if (plugin.is_free) {
        return {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    }

    const numericPrice = Number(plugin.price)
    if (!Number.isNaN(numericPrice) && numericPrice >= 0) {
        return {
            '@type': 'Offer',
            price: numericPrice.toFixed(2),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
        }
    }

    return undefined
}

function toAbsoluteUrl(pathOrUrl: string) {
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl
    }

    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
    return `https://pocketminehub.com${path}`
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const locale = await getRequestLocale()
    const { slug } = await params
    const plugin = await getPlugin(slug)

    if (!plugin) {
        const canonical = withLocalePath(`/plugins/${slug}`, locale)
        return {
            title: pickLocaleText(locale, {
                en: 'PocketMine Plugin Not Found | PMHub',
                fr: 'Plugin PocketMine introuvable | PMHub',
                es: 'Plugin PocketMine no encontrado | PMHub',
                'pt-br': 'Plugin PocketMine não encontrado | PMHub',
                de: 'PocketMine-Plugin nicht gefunden | PMHub'
            }),
            description: pickLocaleText(locale, {
                en: 'Browse free and premium PocketMine plugins for Minecraft Bedrock servers on PMHub.',
                fr: 'Parcourez des plugins PocketMine gratuits et premium pour serveurs Minecraft Bedrock sur PMHub.',
                es: 'Explora plugins PocketMine gratis y premium para servidores Minecraft Bedrock en PMHub.',
                'pt-br':
                    'Explore plugins PocketMine gratuitos e premium para servidores Minecraft Bedrock na PMHub.',
                de: 'Durchsuche kostenlose und Premium-PocketMine-Plugins für Minecraft-Bedrock-Server auf PMHub.'
            }),
            alternates: {
                canonical,
                ...getLocaleAlternates(`/plugins/${slug}`)
            }
        }
    }

    const canonicalSlug = plugin.slug ?? slug
    const baseDescription =
        plugin.short_description ??
        plugin.full_description ??
        `${plugin.name} plugin for PocketMine-MP servers.`
    const description = pickLocaleText(locale, {
        en: `${baseDescription} Compatible with Minecraft Bedrock servers running PocketMine-MP.`,
        fr: `${baseDescription} Compatible avec les serveurs Minecraft Bedrock sous PocketMine-MP.`,
        es: `${baseDescription} Compatible con servidores Minecraft Bedrock que usan PocketMine-MP.`,
        'pt-br': `${baseDescription} Compatível com servidores Minecraft Bedrock rodando PocketMine-MP.`,
        de: `${baseDescription} Kompatibel mit Minecraft-Bedrock-Servern auf PocketMine-MP.`
    })
    const tagKeywords = Array.isArray(plugin.tags)
        ? plugin.tags.map((tag) => `${tag} PocketMine plugin`)
        : []
    const canonical = withLocalePath(`/plugins/${canonicalSlug}`, locale)

    return {
        title: pickLocaleText(locale, {
            en: `${plugin.name} PocketMine Plugin | PMHub`,
            fr: `${plugin.name} Plugin PocketMine | PMHub`,
            es: `${plugin.name} Plugin PocketMine | PMHub`,
            'pt-br': `${plugin.name} Plugin PocketMine | PMHub`,
            de: `${plugin.name} PocketMine-Plugin | PMHub`
        }),
        description,
        keywords: [
            `${plugin.name} PocketMine plugin`,
            'PocketMine-MP plugin',
            'Minecraft Bedrock server plugin',
            plugin.is_free ? 'free PocketMine plugin' : 'premium PocketMine plugin',
            ...tagKeywords
        ],
        alternates: {
            canonical,
            ...getLocaleAlternates(`/plugins/${canonicalSlug}`)
        },
        openGraph: {
            title: pickLocaleText(locale, {
                en: `${plugin.name} PocketMine Plugin | PMHub`,
                fr: `${plugin.name} Plugin PocketMine | PMHub`,
                es: `${plugin.name} Plugin PocketMine | PMHub`,
                'pt-br': `${plugin.name} Plugin PocketMine | PMHub`,
                de: `${plugin.name} PocketMine-Plugin | PMHub`
            }),
            description,
            url: `https://pocketminehub.com${canonical}`,
            type: 'article',
            locale: getOpenGraphLocale(locale)
        },
        twitter: {
            card: 'summary',
            title: pickLocaleText(locale, {
                en: `${plugin.name} PocketMine Plugin | PMHub`,
                fr: `${plugin.name} Plugin PocketMine | PMHub`,
                es: `${plugin.name} Plugin PocketMine | PMHub`,
                'pt-br': `${plugin.name} Plugin PocketMine | PMHub`,
                de: `${plugin.name} PocketMine-Plugin | PMHub`
            }),
            description
        }
    }
}

export default async function PluginPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const locale = await getRequestLocale()
    const { slug } = await params
    const plugin = await getPlugin(slug)

    if (!plugin) {
        notFound()
    }

    const [versions, media] = await Promise.all([
        fetchVersions(plugin.id),
        fetchMedia(plugin.id)
    ])

    const price = formatPrice(plugin, locale)
    const tags = Array.isArray(plugin.tags) ? plugin.tags : []
    const featured = Boolean(plugin.featured)
    const cookieStore = await cookies()
    const isLoggedIn = Boolean(cookieStore.get('token')?.value)
    const orderedMedia = [...media].sort((a: Media, b: Media) => {
        const left = Number(a.position || 0)
        const right = Number(b.position || 0)
        return left - right
    })
    const imageMedia = orderedMedia.filter((item: Media) => item.type === 'image')
    const videoMedia = orderedMedia.filter((item: Media) => item.type === 'video')
    const primaryMedia = imageMedia[0]
    const secondaryImages = imageMedia.slice(1)
    const imageSrc = resolveMediaUrl(primaryMedia?.url) || fallbackImage
    const canonicalSlug = plugin.slug ?? slug
    const localizedPluginPath = withLocalePath(`/plugins/${canonicalSlug}`, locale)
    const absolutePluginUrl = `https://pocketminehub.com${localizedPluginPath}`
    const offerSchema = getOfferSchema(plugin)
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: pickLocaleText(locale, {
                            en: 'Home',
                            fr: 'Accueil',
                            es: 'Inicio',
                            'pt-br': 'Início',
                            de: 'Startseite'
                        }),
                        item: `https://pocketminehub.com${withLocalePath('/', locale)}`
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: pickLocaleText(locale, {
                            en: 'Plugins',
                            fr: 'Plugins',
                            es: 'Plugins',
                            'pt-br': 'Plugins',
                            de: 'Plugins'
                        }),
                        item: `https://pocketminehub.com${withLocalePath('/plugins', locale)}`
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: plugin.name,
                        item: absolutePluginUrl
                    }
                ]
            },
            {
                '@type': 'Product',
                name: plugin.name,
                description:
                    plugin.short_description ??
                    plugin.full_description ??
                    `${plugin.name} plugin for PocketMine-MP servers.`,
                image: toAbsoluteUrl(imageSrc),
                category: 'PocketMine-MP Plugin',
                brand: {
                    '@type': 'Brand',
                    name: 'PocketMine-MP'
                },
                url: absolutePluginUrl,
                keywords: tags.join(', '),
                ...(offerSchema ? { offers: offerSchema } : {})
            }
        ]
    }

    let ownsPlugin = false
    if (isLoggedIn && plugin.id) {
        const licenseRes = await apiFetch(`/licenses/${plugin.id}`)
        ownsPlugin = licenseRes.ok
    }

    return (
        <>
            <section className="page-hero">
                <div className="container plugin-hero">
                    <div>
                        <span className="hero-badge">
                            {pickLocaleText(locale, {
                                en: 'PocketMine plugin for Minecraft Bedrock servers',
                                fr: 'Plugin PocketMine pour serveurs Minecraft Bedrock',
                                es: 'Plugin PocketMine para servidores Minecraft Bedrock',
                                'pt-br':
                                    'Plugin PocketMine para servidores Minecraft Bedrock',
                                de: 'PocketMine-Plugin für Minecraft-Bedrock-Server'
                            })}
                        </span>
                        <h1 className="page-title">{plugin.name}</h1>
                        <p className="page-subtitle">
                            {plugin.short_description ??
                                pickLocaleText(locale, {
                                    en: 'A PocketMine-MP plugin built for secure, reliable Minecraft Bedrock gameplay.',
                                    fr: 'Un plugin PocketMine-MP conçu pour un gameplay Minecraft Bedrock fiable et sécurisé.',
                                    es: 'Un plugin PocketMine-MP creado para un gameplay seguro y fiable en Minecraft Bedrock.',
                                    'pt-br':
                                        'Um plugin PocketMine-MP criado para um gameplay seguro e confiável no Minecraft Bedrock.',
                                    de: 'Ein PocketMine-MP-Plugin für sicheres und zuverlässiges Minecraft-Bedrock-Gameplay.'
                                })}
                        </p>
                        <div className="chip-row">
                            {featured && (
                                <span className="chip">
                                    {pickLocaleText(locale, {
                                        en: 'Featured',
                                        fr: 'En vedette',
                                        es: 'Destacado',
                                        'pt-br': 'Destaque',
                                        de: 'Empfohlen'
                                    })}
                                </span>
                            )}
                            {tags.map((tag) => (
                                <span key={tag} className="chip">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="hero-actions">
                            {isLoggedIn ? (
                                ownsPlugin ? (
                                    <div className="owned-banner">
                                        <span>
                                            {pickLocaleText(locale, {
                                                en: 'Plugin already owned.',
                                                fr: 'Plugin déjà possédé.',
                                                es: 'Ya tienes este plugin.',
                                                'pt-br': 'Você já possui este plugin.',
                                                de: 'Plugin bereits in deinem Besitz.'
                                            })}
                                        </span>
                                        <a
                                            href={withLocalePath('/account', locale)}
                                            className="text-link"
                                        >
                                            {pickLocaleText(locale, {
                                                en: 'Go to my account',
                                                fr: 'Aller à mon compte',
                                                es: 'Ir a mi cuenta',
                                                'pt-br': 'Ir para minha conta',
                                                de: 'Zu meinem Konto'
                                            })}
                                        </a>
                                    </div>
                                ) : (
                                    <>
                                        {plugin.id ? (
                                            <AddToCartButton pluginId={plugin.id} />
                                        ) : (
                                            <a
                                                href={withLocalePath('/cart', locale)}
                                                className="btn-primary"
                                            >
                                                {pickLocaleText(locale, {
                                                    en: 'Add to cart',
                                                    fr: 'Ajouter au panier',
                                                    es: 'Añadir al carrito',
                                                    'pt-br': 'Adicionar ao carrinho',
                                                    de: 'In den Warenkorb'
                                                })}
                                            </a>
                                        )}
                                        {plugin.id ? (
                                            <PurchaseButton pluginId={plugin.id} />
                                        ) : (
                                            <a
                                                href={withLocalePath('/checkout', locale)}
                                                className="btn-secondary"
                                            >
                                                {pickLocaleText(locale, {
                                                    en: 'Buy now',
                                                    fr: 'Acheter maintenant',
                                                    es: 'Comprar ahora',
                                                    'pt-br': 'Comprar agora',
                                                    de: 'Jetzt kaufen'
                                                })}
                                            </a>
                                        )}
                                    </>
                                )
                            ) : (
                                <>
                                    <a
                                        href={`${withLocalePath('/login', locale)}?returnTo=${encodeURIComponent(withLocalePath(`/plugins/${plugin.slug ?? slug}`, locale))}`}
                                        className="btn-primary"
                                    >
                                        {pickLocaleText(locale, {
                                            en: 'Sign in to buy',
                                            fr: 'Connectez-vous pour acheter',
                                            es: 'Inicia sesión para comprar',
                                            'pt-br': 'Entre para comprar',
                                            de: 'Zum Kaufen anmelden'
                                        })}
                                    </a>
                                    <a
                                        href={withLocalePath('/login', locale)}
                                        className="btn-secondary"
                                    >
                                        {pickLocaleText(locale, {
                                            en: 'Sign in',
                                            fr: 'Connexion',
                                            es: 'Iniciar sesión',
                                            'pt-br': 'Entrar',
                                            de: 'Anmelden'
                                        })}
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="card">
                        <MediaImage
                            src={imageSrc}
                            fallbackSrc={fallbackImage}
                            alt={plugin.name}
                            className="media-image media-image--tall"
                        />
                        <div className="catalog-meta">
                            <h3>
                                {pickLocaleText(locale, {
                                    en: 'Price',
                                    fr: 'Prix',
                                    es: 'Precio',
                                    'pt-br': 'Preço',
                                    de: 'Preis'
                                })}
                            </h3>
                            <span className="price-badge">{price}</span>
                        </div>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Instant access after checkout, with clear documentation and updates.',
                                fr: 'Accès instantané après paiement, avec documentation claire et mises à jour.',
                                es: 'Acceso instantáneo tras el pago, con documentación clara y actualizaciones.',
                                'pt-br':
                                    'Acesso instantâneo após o checkout, com documentação clara e atualizações.',
                                de: 'Sofortiger Zugriff nach dem Checkout mit klarer Dokumentation und Updates.'
                            })}
                        </p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container detail-stack">
                    <div className="card">
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'Full description',
                                fr: 'Description complète',
                                es: 'Descripción completa',
                                'pt-br': 'Descrição completa',
                                de: 'Vollständige Beschreibung'
                            })}
                        </h2>
                        <p>
                            {plugin.full_description ??
                                pickLocaleText(locale, {
                                    en: 'Solid architecture, clean configs, and reliable updates for your PocketMine-MP Minecraft Bedrock server.',
                                    fr: 'Architecture solide, configs propres et mises à jour fiables pour votre serveur PocketMine-MP Minecraft Bedrock.',
                                    es: 'Arquitectura sólida, configuraciones limpias y actualizaciones fiables para tu servidor PocketMine-MP Minecraft Bedrock.',
                                    'pt-br':
                                        'Arquitetura sólida, configs limpas e atualizações confiáveis para o seu servidor PocketMine-MP Minecraft Bedrock.',
                                    de: 'Solide Architektur, saubere Konfigurationen und zuverlässige Updates für deinen PocketMine-MP-Minecraft-Bedrock-Server.'
                                })}
                        </p>
                        {secondaryImages.length > 0 && (
                            <div className="plugin-media-block">
                                <h3>
                                    {pickLocaleText(locale, {
                                        en: 'Screenshots',
                                        fr: "Captures d'écran",
                                        es: 'Capturas',
                                        'pt-br': 'Capturas de tela',
                                        de: 'Screenshots'
                                    })}
                                </h3>
                                <div className="plugin-media-grid">
                                    {secondaryImages.map((item) => {
                                        const mediaUrl = resolveMediaUrl(item.url)
                                        if (!mediaUrl) {
                                            return null
                                        }

                                        return (
                                            <MediaImage
                                                key={item.id}
                                                src={mediaUrl}
                                                fallbackSrc={fallbackImage}
                                                alt={`${plugin.name} screenshot`}
                                                className="media-image"
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        {videoMedia.length > 0 && (
                            <div className="plugin-media-block">
                                <h3>
                                    {pickLocaleText(locale, {
                                        en: 'Demo videos',
                                        fr: 'Vidéos de démo',
                                        es: 'Videos de demostración',
                                        'pt-br': 'Vídeos de demonstração',
                                        de: 'Demo-Videos'
                                    })}
                                </h3>
                                <div className="detail-list">
                                    {videoMedia.map((item, index) => {
                                        const mediaUrl = resolveMediaUrl(item.url)
                                        if (!mediaUrl) {
                                            return null
                                        }

                                        return (
                                            <a
                                                key={item.id}
                                                href={mediaUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="detail-item"
                                            >
                                                {pickLocaleText(locale, {
                                                    en: `Watch video ${index + 1}`,
                                                    fr: `Voir la vidéo ${index + 1}`,
                                                    es: `Ver video ${index + 1}`,
                                                    'pt-br': `Assistir vídeo ${index + 1}`,
                                                    de: `Video ${index + 1} ansehen`
                                                })}
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="card">
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'Changelog',
                                fr: 'Journal des changements',
                                es: 'Registro de cambios',
                                'pt-br': 'Changelog',
                                de: 'Änderungsprotokoll'
                            })}
                        </h2>
                        <VersionAccordion versions={versions as Version[]} />
                    </div>
                </div>
            </section>
            <Script
                id="plugin-product-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
        </>
    )
}
