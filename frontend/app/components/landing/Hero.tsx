import Link from 'next/link'
import { type Locale, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

const TAG_OPTIONS = ['economy', 'factions', 'utilities', 'moderation', 'minigames']
const VERSION_OPTIONS = ['5.x', '4.x', '3.x']

export default function Hero({ locale = 'en' }: { locale?: Locale }) {
    const quickLinks = pickLocaleText(locale, {
        en: [
            { label: 'Economy', href: '/plugins?tag=economy' },
            { label: 'Factions', href: '/plugins?tag=factions' },
            { label: 'Utilities', href: '/plugins?tag=utilities' },
            { label: 'Moderation', href: '/plugins?tag=moderation' }
        ],
        fr: [
            { label: 'Économie', href: '/plugins?tag=economy' },
            { label: 'Factions', href: '/plugins?tag=factions' },
            { label: 'Utilitaires', href: '/plugins?tag=utilities' },
            { label: 'Modération', href: '/plugins?tag=moderation' }
        ],
        es: [
            { label: 'Economía', href: '/plugins?tag=economy' },
            { label: 'Facciones', href: '/plugins?tag=factions' },
            { label: 'Utilidades', href: '/plugins?tag=utilities' },
            { label: 'Moderación', href: '/plugins?tag=moderation' }
        ],
        'pt-br': [
            { label: 'Economia', href: '/plugins?tag=economy' },
            { label: 'Facções', href: '/plugins?tag=factions' },
            { label: 'Utilitários', href: '/plugins?tag=utilities' },
            { label: 'Moderação', href: '/plugins?tag=moderation' }
        ],
        de: [
            { label: 'Wirtschaft', href: '/plugins?tag=economy' },
            { label: 'Fraktionen', href: '/plugins?tag=factions' },
            { label: 'Utilities', href: '/plugins?tag=utilities' },
            { label: 'Moderation', href: '/plugins?tag=moderation' }
        ]
    })
    const searchTitle = pickLocaleText(locale, {
        en: 'Search and browse plugins built by other creators.',
        fr: 'Recherchez et parcourez des plugins créés par la communauté.',
        es: 'Busca y explora plugins creados por la comunidad.',
        'pt-br': 'Busque e explore plugins criados pela comunidade.',
        de: 'Suche und entdecke Plugins, die von der Community erstellt wurden.'
    })
    const searchDescription = pickLocaleText(locale, {
        en: 'Use filters for tags, pricing, and PocketMine versions to find the right plugin fast.',
        fr: 'Utilisez les filtres par tags, prix et versions PocketMine pour trouver rapidement le bon plugin.',
        es: 'Usa filtros por etiquetas, precio y versión de PocketMine para encontrar el plugin ideal rápidamente.',
        'pt-br':
            'Use filtros por tags, preço e versão do PocketMine para encontrar o plugin certo rapidamente.',
        de: 'Nutze Filter für Tags, Preis und PocketMine-Versionen, um schnell das richtige Plugin zu finden.'
    })
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

    return (
        <section className="hero">
            <div className="container hero-inner hero-inner--browser">
                <div className="hero-copy">
                    <span className="hero-badge">
                        {pickLocaleText(locale, {
                            en: 'Community Marketplace',
                            fr: 'Marketplace communautaire',
                            es: 'Marketplace de la comunidad',
                            'pt-br': 'Marketplace da comunidade',
                            de: 'Community-Marktplatz'
                        })}
                    </span>
                    <h1>{searchTitle}</h1>
                    <p>{searchDescription}</p>

                    <form
                        className="search-panel hero-search-panel"
                        action={withLocalePath('/plugins', locale)}
                        method="GET"
                    >
                        <div className="search-bar hero-search-bar">
                            <input
                                type="search"
                                name="search"
                                placeholder={pickLocaleText(locale, {
                                    en: 'Search plugins, tags, or creator names',
                                    fr: 'Rechercher des plugins, tags, ou noms de créateurs',
                                    es: 'Buscar plugins, etiquetas o nombres de creadores',
                                    'pt-br':
                                        'Buscar plugins, tags ou nomes de criadores',
                                    de: 'Plugins, Tags oder Creator-Namen suchen'
                                })}
                            />
                            <button className="btn-primary" type="submit">
                                {pickLocaleText(locale, {
                                    en: 'Search Marketplace',
                                    fr: 'Rechercher',
                                    es: 'Buscar',
                                    'pt-br': 'Buscar',
                                    de: 'Suchen'
                                })}
                            </button>
                        </div>
                        <div className="filter-row hero-filter-row">
                            <label>
                                {pickLocaleText(locale, {
                                    en: 'Tag',
                                    fr: 'Tag',
                                    es: 'Etiqueta',
                                    'pt-br': 'Tag',
                                    de: 'Tag'
                                })}
                                <select name="tag" defaultValue="">
                                    <option value="">
                                        {pickLocaleText(locale, {
                                            en: 'All tags',
                                            fr: 'Tous les tags',
                                            es: 'Todas las etiquetas',
                                            'pt-br': 'Todas as tags',
                                            de: 'Alle Tags'
                                        })}
                                    </option>
                                    {TAG_OPTIONS.map((tag) => (
                                        <option key={tag} value={tag}>
                                            {tag}
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
                                <select name="price" defaultValue="">
                                    {priceOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                PocketMine
                                <select name="version" defaultValue="">
                                    <option value="">
                                        {pickLocaleText(locale, {
                                            en: 'All versions',
                                            fr: 'Toutes versions',
                                            es: 'Todas las versiones',
                                            'pt-br': 'Todas as versões',
                                            de: 'Alle Versionen'
                                        })}
                                    </option>
                                    {VERSION_OPTIONS.map((version) => (
                                        <option key={version} value={version}>
                                            {version}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </form>

                    <div className="chip-row">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={withLocalePath(item.href, locale)}
                                className="chip chip-link"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="hero-panel">
                    <div className="hero-card hero-browser-card">
                        <div className="hero-card-body">
                            <div className="badge-row">
                                <span className="pill">
                                    {pickLocaleText(locale, {
                                        en: 'Quick Browse',
                                        fr: 'Navigation rapide',
                                        es: 'Exploración rápida',
                                        'pt-br': 'Navegação rápida',
                                        de: 'Schnellsuche'
                                    })}
                                </span>
                                <span className="hero-tag">PocketMine-MP</span>
                            </div>
                            <h3>
                                {pickLocaleText(locale, {
                                    en: 'Jump straight into popular categories.',
                                    fr: 'Allez directement vers les catégories populaires.',
                                    es: 'Ve directo a las categorías populares.',
                                    'pt-br':
                                        'Acesse direto as categorias mais populares.',
                                    de: 'Direkt zu beliebten Kategorien springen.'
                                })}
                            </h3>
                            <div className="hero-browse-list">
                                {quickLinks.map((item) => (
                                    <Link
                                        key={`browse-${item.href}`}
                                        href={withLocalePath(item.href, locale)}
                                        className="hero-browse-item"
                                    >
                                        <span>{item.label}</span>
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="hero-card-footer">
                                <Link
                                    className="text-link"
                                    href={withLocalePath('/plugins', locale)}
                                >
                                    {pickLocaleText(locale, {
                                        en: 'Browse full catalog',
                                        fr: 'Voir le catalogue',
                                        es: 'Ver catálogo',
                                        'pt-br': 'Ver catálogo',
                                        de: 'Gesamten Katalog ansehen'
                                    })}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
