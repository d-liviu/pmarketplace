import Link from 'next/link'
import MediaImage from '../plugins/MediaImage'
import { getApiBaseUrl } from '../../lib/apiBase'
import { resolveMediaUrl } from '../../lib/media'
import { toSlug } from '../../lib/slug'
import { type Locale, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

type Plugin = {
    id: string | number
    name: string
    slug?: string
    short_description?: string
    price?: number | string
    is_free?: boolean
    featured?: boolean | number
    media?: { url: string }[]
}

const apiBaseUrl = getApiBaseUrl()
const fallbackImage = '/images/plugin-fallback.svg'

async function getHeroPlugin() {
    try {
        const res = await fetch(`${apiBaseUrl}/plugins`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return null
        }

        const data = await res.json()
        const plugins = Array.isArray(data) ? (data as Plugin[]) : []
        if (!plugins.length) {
            return null
        }

        return plugins.find((plugin) => Boolean(plugin.featured)) || plugins[0]
    } catch (error) {
        console.error('Failed to load hero plugin', error)
        return null
    }
}

function getPluginHref(plugin: Plugin) {
    if (plugin.slug) {
        return `/plugins/${plugin.slug}`
    }

    const fromName = plugin.name ? toSlug(plugin.name) : ''
    return fromName ? `/plugins/${fromName}` : `/plugins/${plugin.id}`
}

function formatPrice(plugin: Plugin | null, locale: Locale) {
    if (!plugin) {
        return '$49'
    }

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

export default async function Hero({ locale = 'en' }: { locale?: Locale }) {
    const heroPlugin = await getHeroPlugin()
    const heroTitle =
        heroPlugin?.name ||
        pickLocaleText(locale, {
            en: 'Security Essentials Pack',
            fr: 'Pack Essentiel Sécurité',
            es: 'Paquete Esencial de Seguridad',
            'pt-br': 'Pacote Essencial de Segurança',
            de: 'Security Essentials Paket'
        })
    const heroDescription =
        heroPlugin?.short_description ||
        pickLocaleText(locale, {
            en: 'Hardened permissions, safe configs, and logs.',
            fr: 'Permissions renforcées, configs sûres et journaux.',
            es: 'Permisos reforzados, configuraciones seguras y registros.',
            'pt-br': 'Permissões reforçadas, configs seguras e logs.',
            de: 'Abgesicherte Berechtigungen, sichere Konfigurationen und Logs.'
        })
    const heroPrice = formatPrice(heroPlugin, locale)
    const heroHref = heroPlugin ? getPluginHref(heroPlugin) : '/plugins'
    const heroImage = resolveMediaUrl(heroPlugin?.media?.[0]?.url) || fallbackImage
    const highlightChips = pickLocaleText(locale, {
        en: ['Free & premium plugins', 'PocketMine-MP ready', 'Built for Bedrock servers'],
        fr: [
            'Plugins gratuits et premium',
            'Compatible PocketMine-MP',
            'Optimisé serveurs Bedrock'
        ],
        es: [
            'Plugins gratis y premium',
            'Compatible con PocketMine-MP',
            'Optimizado para servidores Bedrock'
        ],
        'pt-br': [
            'Plugins gratuitos e premium',
            'Compatível com PocketMine-MP',
            'Otimizado para servidores Bedrock'
        ],
        de: [
            'Kostenlose und Premium-Plugins',
            'PocketMine-MP kompatibel',
            'Für Bedrock-Server optimiert'
        ]
    })
    const quickStats = pickLocaleText(locale, {
        en: [
            {
                title: 'For server owners',
                detail: 'Find plugins for economy, factions, moderation, and core gameplay.'
            },
            {
                title: 'For communities',
                detail: 'Launch reliable Minecraft Bedrock server experiences with less friction.'
            }
        ],
        fr: [
            {
                title: 'Pour les propriétaires',
                detail: 'Trouvez des plugins économie, factions, modération et gameplay.'
            },
            {
                title: 'Pour les communautés',
                detail: 'Lancez des serveurs Minecraft Bedrock stables plus rapidement.'
            }
        ],
        es: [
            {
                title: 'Para dueños de servidores',
                detail: 'Encuentra plugins de economía, facciones, moderación y jugabilidad.'
            },
            {
                title: 'Para comunidades',
                detail: 'Lanza experiencias Bedrock estables con menos fricción.'
            }
        ],
        'pt-br': [
            {
                title: 'Para donos de servidores',
                detail: 'Encontre plugins de economia, facções, moderação e gameplay.'
            },
            {
                title: 'Para comunidades',
                detail: 'Lance servidores Bedrock estáveis com menos atrito.'
            }
        ],
        de: [
            {
                title: 'Für Serverbetreiber',
                detail: 'Finde Plugins für Wirtschaft, Fraktionen, Moderation und Gameplay.'
            },
            {
                title: 'Für Communities',
                detail: 'Starte stabile Bedrock-Server-Erlebnisse mit weniger Aufwand.'
            }
        ]
    })

    return (
        <section className="hero">
            <div className="container hero-inner">
                <div className="hero-copy">
                    <span className="hero-badge">
                        {pickLocaleText(locale, {
                            en: 'PocketMine Plugins for Minecraft Bedrock Servers',
                            fr: 'Plugins PocketMine pour serveurs Minecraft Bedrock',
                            es: 'Plugins PocketMine para servidores Minecraft Bedrock',
                            'pt-br':
                                'Plugins PocketMine para servidores Minecraft Bedrock',
                            de: 'PocketMine-Plugins für Minecraft-Bedrock-Server'
                        })}
                    </span>
                    <h1>
                        {pickLocaleText(locale, {
                            en: 'Get free and premium PocketMine plugins that just work.',
                            fr: 'Obtenez des plugins PocketMine gratuits et premium qui fonctionnent vraiment.',
                            es: 'Consigue plugins PocketMine gratis y premium que realmente funcionan.',
                            'pt-br':
                                'Obtenha plugins PocketMine gratuitos e premium que realmente funcionam.',
                            de: 'Hol dir kostenlose und Premium-PocketMine-Plugins, die wirklich funktionieren.'
                        })}
                    </h1>
                    <p>
                        {pickLocaleText(locale, {
                            en: 'PMHub is a focused marketplace for the PocketMine community. Discover secure, high-performance PocketMine-MP plugins for Minecraft Bedrock server networks of any size.',
                            fr: 'PMHub est une marketplace dédiée à la communauté PocketMine. Découvrez des plugins PocketMine-MP sécurisés et performants pour des serveurs Minecraft Bedrock de toute taille.',
                            es: 'PMHub es un marketplace centrado en la comunidad PocketMine. Descubre plugins PocketMine-MP seguros y de alto rendimiento para redes de servidores Minecraft Bedrock.',
                            'pt-br':
                                'PMHub é um marketplace focado na comunidade PocketMine. Descubra plugins PocketMine-MP seguros e de alto desempenho para redes Minecraft Bedrock de qualquer tamanho.',
                            de: 'PMHub ist ein fokussierter Marktplatz für die PocketMine-Community. Entdecke sichere und leistungsstarke PocketMine-MP-Plugins für Minecraft-Bedrock-Server jeder Größe.'
                        })}
                    </p>
                    <div className="hero-actions">
                        <Link
                            href={withLocalePath('/plugins', locale)}
                            className="btn-primary"
                        >
                            {pickLocaleText(locale, {
                                en: 'Browse plugins',
                                fr: 'Voir les plugins',
                                es: 'Explorar plugins',
                                'pt-br': 'Explorar plugins',
                                de: 'Plugins durchsuchen'
                            })}
                        </Link>
                        <a href="#features" className="btn-secondary">
                            {pickLocaleText(locale, {
                                en: 'See benefits',
                                fr: 'Voir les avantages',
                                es: 'Ver ventajas',
                                'pt-br': 'Ver benefícios',
                                de: 'Vorteile ansehen'
                            })}
                        </a>
                    </div>
                    <div className="chip-row">
                        {highlightChips.map((chip) => (
                            <span key={chip} className="chip">
                                {chip}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="hero-panel">
                    <div className="hero-card">
                        <MediaImage
                            src={heroImage}
                            fallbackSrc={fallbackImage}
                            alt={pickLocaleText(locale, {
                                en: 'Featured PocketMine plugin',
                                fr: 'Plugin PocketMine mis en avant',
                                es: 'Plugin PocketMine destacado',
                                'pt-br': 'Plugin PocketMine em destaque',
                                de: 'Empfohlenes PocketMine-Plugin'
                            })}
                            className="media-image media-image--tall"
                        />
                        <div className="hero-card-body">
                            <div className="badge-row">
                                <span className="pill">
                                    {pickLocaleText(locale, {
                                        en: 'Featured',
                                        fr: 'En vedette',
                                        es: 'Destacado',
                                        'pt-br': 'Destaque',
                                        de: 'Empfohlen'
                                    })}
                                </span>
                                <span className="hero-tag">PocketMine-MP</span>
                            </div>
                            <h3>{heroTitle}</h3>
                            <p>{heroDescription}</p>
                            <div className="hero-card-footer">
                                <span className="price">{heroPrice}</span>
                                <Link
                                    className="text-link"
                                    href={withLocalePath(heroHref, locale)}
                                >
                                    {pickLocaleText(locale, {
                                        en: 'View details',
                                        fr: 'Voir les détails',
                                        es: 'Ver detalles',
                                        'pt-br': 'Ver detalhes',
                                        de: 'Details ansehen'
                                    })}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="hero-mini-grid">
                        {quickStats.map((stat) => (
                            <div key={stat.title} className="mini-card">
                                <h4>{stat.title}</h4>
                                <p>{stat.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
