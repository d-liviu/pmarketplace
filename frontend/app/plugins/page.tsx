import type { Metadata } from 'next'
import Script from 'next/script'
import PluginCard from '../components/plugins/PluginCard'
import { toSlug } from '../lib/slug'
import { getApiBaseUrl } from '../lib/apiBase'
import { getOpenGraphLocale, withLocalePath } from '../lib/i18n'
import { pickLocaleText } from '../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../lib/requestLocale'

const apiBaseUrl = getApiBaseUrl()

type Plugin = {
    id: string | number
    name: string
    slug?: string
    short_description?: string
    price?: number | string
    is_free?: boolean
    tags?: string[]
    featured?: boolean | number
    pocketmine_version?: string
}

async function getPlugins(searchParams: { [key: string]: string | undefined }) {
    try {
        const query = new URLSearchParams()
        if (searchParams.search) {
            query.set('search', searchParams.search)
        }
        if (searchParams.tag) {
            query.set('tag', searchParams.tag)
        }
        if (searchParams.price) {
            query.set('price', searchParams.price)
        }
        if (searchParams.version) {
            query.set('version', searchParams.version)
        }

        const queryString = query.toString()
        const res = await fetch(
            `${apiBaseUrl}/plugins${queryString ? `?${queryString}` : ''}`,
            {
                cache: 'no-store'
            }
        )

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

function getPluginHref(plugin: {
    slug?: string | null
    name?: string | null
    id?: string | number | null
}) {
    const fromSlug = plugin.slug?.trim()
    if (fromSlug) {
        return `/plugins/${fromSlug}`
    }

    const fromName = plugin.name ? toSlug(plugin.name) : ''
    if (fromName) {
        return `/plugins/${fromName}`
    }

    return `/plugins/${plugin.id ?? ''}`
}

function getSchemaOffer(plugin: Plugin) {
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

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const canonical = withLocalePath('/plugins', locale)
    const title = pickLocaleText(locale, {
        en: 'PocketMine Plugins (Free & Premium) | PMHub',
        fr: 'Plugins PocketMine (Gratuits & Premium) | PMHub',
        es: 'Plugins PocketMine (Gratis y Premium) | PMHub',
        'pt-br': 'Plugins PocketMine (Gratuitos e Premium) | PMHub',
        de: 'PocketMine-Plugins (Kostenlos & Premium) | PMHub'
    })
    const description = pickLocaleText(locale, {
        en: 'Browse free and premium PocketMine plugins for Minecraft Bedrock servers. Filter by tag, PocketMine version, and budget to find the right plugin fast.',
        fr: 'Parcourez des plugins PocketMine gratuits et premium pour serveurs Minecraft Bedrock. Filtrez par tag, version PocketMine et budget pour trouver rapidement le bon plugin.',
        es: 'Explora plugins PocketMine gratis y premium para servidores Minecraft Bedrock. Filtra por etiqueta, versión de PocketMine y presupuesto para encontrar el plugin correcto.',
        'pt-br':
            'Explore plugins PocketMine gratuitos e premium para servidores Minecraft Bedrock. Filtre por tag, versão do PocketMine e orçamento para encontrar o plugin ideal.',
        de: 'Durchsuche kostenlose und Premium-PocketMine-Plugins für Minecraft-Bedrock-Server. Filtere nach Tag, PocketMine-Version und Budget, um schnell das richtige Plugin zu finden.'
    })

    return {
        title,
        description,
        keywords: [
            'PocketMine plugins',
            'free PocketMine plugins',
            'premium PocketMine plugins',
            'PocketMine plugin marketplace',
            'Minecraft Bedrock server plugins',
            'PocketMine-MP economy plugin',
            'PocketMine factions plugin',
            'plugins pocketmine gratuits',
            'plugins pocketmine payants'
        ],
        openGraph: {
            title,
            description,
            url: `https://pocketminehub.com${canonical}`,
            type: 'website',
            locale: getOpenGraphLocale(locale)
        },
        alternates: {
            canonical,
            ...getLocaleAlternates('/plugins')
        }
    }
}

const tagOptions = ['Economy', 'Factions', 'Utilities', 'Moderation', 'Minigames']
const versionOptions = ['5.x', '4.x', '3.x']

export default async function PluginsPage({
    searchParams
}: {
    searchParams: Promise<{
        search?: string
        tag?: string
        price?: string
        version?: string
    }>
}) {
    const locale = await getRequestLocale()
    const resolvedParams = await searchParams
    const search = resolvedParams.search ?? ''
    const tag = resolvedParams.tag ?? ''
    const price = resolvedParams.price ?? ''
    const version = resolvedParams.version ?? ''
    const priceOptions = pickLocaleText(locale, {
        en: [
            { label: 'All prices', value: '' },
            { label: 'Free', value: 'free' },
            { label: 'Under $20', value: 'under-20' },
            { label: 'Under $50', value: 'under-50' },
            { label: '$50+', value: '50-plus' }
        ],
        fr: [
            { label: 'Tous les prix', value: '' },
            { label: 'Gratuit', value: 'free' },
            { label: 'Moins de 20 $', value: 'under-20' },
            { label: 'Moins de 50 $', value: 'under-50' },
            { label: '50 $+', value: '50-plus' }
        ],
        es: [
            { label: 'Todos los precios', value: '' },
            { label: 'Gratis', value: 'free' },
            { label: 'Menos de $20', value: 'under-20' },
            { label: 'Menos de $50', value: 'under-50' },
            { label: '$50+', value: '50-plus' }
        ],
        'pt-br': [
            { label: 'Todos os preços', value: '' },
            { label: 'Gratuito', value: 'free' },
            { label: 'Abaixo de $20', value: 'under-20' },
            { label: 'Abaixo de $50', value: 'under-50' },
            { label: '$50+', value: '50-plus' }
        ],
        de: [
            { label: 'Alle Preise', value: '' },
            { label: 'Kostenlos', value: 'free' },
            { label: 'Unter $20', value: 'under-20' },
            { label: 'Unter $50', value: 'under-50' },
            { label: '$50+', value: '50-plus' }
        ]
    })

    const plugins = await getPlugins({ search, tag, price, version })
    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: pickLocaleText(locale, {
            en: 'PocketMine Plugins Catalog',
            fr: 'Catalogue de plugins PocketMine',
            es: 'Catálogo de plugins PocketMine',
            'pt-br': 'Catálogo de plugins PocketMine',
            de: 'PocketMine-Plugin-Katalog'
        }),
        url: `https://pocketminehub.com${withLocalePath('/plugins', locale)}`,
        numberOfItems: plugins.length,
        itemListElement: plugins.map((plugin: Plugin, index: number) => {
            const href = getPluginHref(plugin)
            const offer = getSchemaOffer(plugin)

            return {
                '@type': 'ListItem',
                position: index + 1,
                url: `https://pocketminehub.com${withLocalePath(href, locale)}`,
                item: {
                    '@type': 'Product',
                    name: plugin.name,
                    description:
                        plugin.short_description ??
                        `${plugin.name} plugin for PocketMine-MP Bedrock servers.`,
                    category: 'PocketMine-MP Plugin',
                    keywords: plugin.tags?.join(', '),
                    ...(offer ? { offers: offer } : {})
                }
            }
        })
    }

    return (
        <>
            <section className="page-hero">
                <div className="container">
                    <span className="hero-badge">
                        {pickLocaleText(locale, {
                            en: 'Plugin catalog',
                            fr: 'Catalogue de plugins',
                            es: 'Catálogo de plugins',
                            'pt-br': 'Catálogo de plugins',
                            de: 'Plugin-Katalog'
                        })}
                    </span>
                    <h1 className="page-title">
                        {pickLocaleText(locale, {
                            en: 'All PocketMine plugins',
                            fr: 'Tous les plugins PocketMine',
                            es: 'Todos los plugins PocketMine',
                            'pt-br': 'Todos os plugins PocketMine',
                            de: 'Alle PocketMine-Plugins'
                        })}
                    </h1>
                    <p className="page-subtitle">
                        {pickLocaleText(locale, {
                            en: 'Discover free and paid PocketMine-MP plugins for Minecraft Bedrock servers, from economy systems to moderation and minigames.',
                            fr: 'Découvrez des plugins PocketMine-MP gratuits et payants pour serveurs Minecraft Bedrock, des systèmes d’économie à la modération et aux mini-jeux.',
                            es: 'Descubre plugins PocketMine-MP gratis y de pago para servidores Minecraft Bedrock, desde economía hasta moderación y minijuegos.',
                            'pt-br':
                                'Descubra plugins PocketMine-MP gratuitos e pagos para servidores Minecraft Bedrock, de economia a moderação e minigames.',
                            de: 'Entdecke kostenlose und kostenpflichtige PocketMine-MP-Plugins für Minecraft-Bedrock-Server, von Wirtschaft bis Moderation und Minigames.'
                        })}
                    </p>
                    <form
                        className="search-panel"
                        action={withLocalePath('/plugins', locale)}
                        method="GET"
                    >
                        <div className="search-bar">
                            <input
                                type="search"
                                name="search"
                                placeholder={
                                    pickLocaleText(locale, {
                                        en: 'Search PocketMine plugins, tags, or features',
                                        fr: 'Rechercher des plugins PocketMine, tags ou fonctionnalités',
                                        es: 'Buscar plugins PocketMine, etiquetas o funciones',
                                        'pt-br':
                                            'Buscar plugins PocketMine, tags ou funcionalidades',
                                        de: 'PocketMine-Plugins, Tags oder Funktionen suchen'
                                    })
                                }
                                defaultValue={search}
                            />
                            <button className="btn-primary" type="submit">
                                {pickLocaleText(locale, {
                                    en: 'Search',
                                    fr: 'Rechercher',
                                    es: 'Buscar',
                                    'pt-br': 'Buscar',
                                    de: 'Suchen'
                                })}
                            </button>
                        </div>
                        <div className="filter-row">
                            <label>
                                {pickLocaleText(locale, {
                                    en: 'Tag',
                                    fr: 'Tag',
                                    es: 'Etiqueta',
                                    'pt-br': 'Tag',
                                    de: 'Tag'
                                })}
                                <select name="tag" defaultValue={tag}>
                                    <option value="">
                                        {pickLocaleText(locale, {
                                            en: 'All tags',
                                            fr: 'Tous les tags',
                                            es: 'Todas las etiquetas',
                                            'pt-br': 'Todas as tags',
                                            de: 'Alle Tags'
                                        })}
                                    </option>
                                    {tagOptions.map((option) => (
                                        <option key={option} value={option.toLowerCase()}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                {pickLocaleText(locale, {
                                    en: 'Price',
                                    fr: 'Prix',
                                    es: 'Precio',
                                    'pt-br': 'Preço',
                                    de: 'Preis'
                                })}
                                <select name="price" defaultValue={price}>
                                    {priceOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                PocketMine
                                <select name="version" defaultValue={version}>
                                    <option value="">
                                        {pickLocaleText(locale, {
                                            en: 'All versions',
                                            fr: 'Toutes versions',
                                            es: 'Todas las versiones',
                                            'pt-br': 'Todas as versões',
                                            de: 'Alle Versionen'
                                        })}
                                    </option>
                                    {versionOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button className="btn-secondary" type="submit">
                                {pickLocaleText(locale, {
                                    en: 'Apply filters',
                                    fr: 'Appliquer les filtres',
                                    es: 'Aplicar filtros',
                                    'pt-br': 'Aplicar filtros',
                                    de: 'Filter anwenden'
                                })}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {plugins.length === 0 ? (
                        <div className="empty-state">
                            {pickLocaleText(locale, {
                                en: 'No plugins available right now. Please check back soon.',
                                fr: 'Aucun plugin disponible pour le moment. Revenez bientôt.',
                                es: 'No hay plugins disponibles por ahora. Vuelve pronto.',
                                'pt-br':
                                    'Nenhum plugin disponível no momento. Volte em breve.',
                                de: 'Derzeit sind keine Plugins verfügbar. Schau bald wieder vorbei.'
                            })}
                        </div>
                    ) : (
                        <div className="catalog-grid">
                            {plugins.map((plugin: Plugin) => (
                                <PluginCard
                                    key={plugin.id}
                                    plugin={plugin}
                                    href={withLocalePath(getPluginHref(plugin), locale)}
                                    locale={locale}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Script
                id="plugins-itemlist-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schemaData)
                }}
            />
        </>
    )
}
