import PluginCard from '../plugins/PluginCard'
import { getApiBaseUrl } from '../../lib/apiBase'
import { toSlug } from '../../lib/slug'
import { type Locale, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

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
    media?: { url: string }[]
}

async function getFeaturedPlugins() {
    try {
        const res = await fetch(`${apiBaseUrl}/plugins`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return []
        }

        const data = await res.json()
        const list = Array.isArray(data) ? (data as Plugin[]) : []
        const featured = list.filter((plugin) => Boolean(plugin.featured))
        const source = featured.length > 0 ? featured : list
        return source.slice(0, 3)
    } catch (error) {
        console.error('Failed to load featured plugins', error)
        return []
    }
}

function getPluginHref(plugin: Plugin) {
    if (plugin.slug) {
        return `/plugins/${plugin.slug}`
    }

    const fromName = plugin.name ? toSlug(plugin.name) : ''
    return fromName ? `/plugins/${fromName}` : `/plugins/${plugin.id}`
}

export default async function FeaturedPlugins({
    locale = 'en'
}: {
    locale?: Locale
}) {
    const plugins = await getFeaturedPlugins()

    if (!plugins.length) {
        return null
    }

    return (
        <section className="section">
            <div className="container">
                <div className="section-heading">
                    <span>
                        {pickLocaleText(locale, {
                            en: 'Featured',
                            fr: 'En vedette',
                            es: 'Destacados',
                            'pt-br': 'Destaques',
                            de: 'Empfohlen'
                        })}
                    </span>
                    <h2>
                        {pickLocaleText(locale, {
                            en: 'Top PocketMine plugins right now.',
                            fr: 'Les meilleurs plugins PocketMine du moment.',
                            es: 'Los mejores plugins PocketMine ahora mismo.',
                            'pt-br': 'Os melhores plugins PocketMine no momento.',
                            de: 'Die besten PocketMine-Plugins aktuell.'
                        })}
                    </h2>
                    <p>
                        {pickLocaleText(locale, {
                            en: 'Handpicked PocketMine-MP releases for Minecraft Bedrock server stability, security, and growth.',
                            fr: 'Des sorties PocketMine-MP sélectionnées pour la stabilité, la sécurité et la croissance de votre serveur Bedrock.',
                            es: 'Lanzamientos PocketMine-MP seleccionados para estabilidad, seguridad y crecimiento de tu servidor Bedrock.',
                            'pt-br':
                                'Lançamentos PocketMine-MP escolhidos para estabilidade, segurança e crescimento do seu servidor Bedrock.',
                            de: 'Ausgewählte PocketMine-MP-Releases für Stabilität, Sicherheit und Wachstum deines Bedrock-Servers.'
                        })}
                    </p>
                </div>
                <div className="catalog-grid">
                    {plugins.map((plugin) => (
                        <PluginCard
                            key={plugin.id}
                            plugin={plugin}
                            href={withLocalePath(getPluginHref(plugin), locale)}
                            locale={locale}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
