import MediaImage from './MediaImage'
import { resolveMediaUrl } from '../../lib/media'
import { type Locale } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

type Plugin = {
    id: string | number
    name: string
    short_description?: string
    price?: number | string
    is_free?: boolean
    tags?: string[]
    featured?: boolean | number
    media?: { url: string }[]
}

type PluginCardProps = {
    plugin: Plugin
    href: string
    locale?: Locale
}

const fallbackImage = '/images/plugin-fallback.svg'

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

export default function PluginCard({
    plugin,
    href,
    locale = 'en'
}: PluginCardProps) {
    const price = formatPrice(plugin, locale)
    const tags = Array.isArray(plugin.tags) ? plugin.tags.slice(0, 3) : []
    const isFeatured = Boolean(plugin.featured)
    const imageUrl = resolveMediaUrl(plugin.media?.[0]?.url) || fallbackImage

    return (
        <a href={href} className="card catalog-card">
            <MediaImage
                src={imageUrl}
                fallbackSrc={fallbackImage}
                alt={plugin.name}
                className="media-image"
            />
            <div className="catalog-meta">
                <h3>{plugin.name}</h3>
                <span className="price-badge">{price}</span>
            </div>
            <p className="line-clamp">
                {plugin.short_description ??
                    pickLocaleText(locale, {
                        en: 'Premium PocketMine plugin.',
                        fr: 'Plugin PocketMine premium.',
                        es: 'Plugin PocketMine premium.',
                        'pt-br': 'Plugin PocketMine premium.',
                        de: 'Premium-PocketMine-Plugin.'
                    })}
            </p>
            <div className="card-actions">
                {isFeatured && (
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
                <span className="text-link">
                    {pickLocaleText(locale, {
                        en: 'View details',
                        fr: 'Voir les détails',
                        es: 'Ver detalles',
                        'pt-br': 'Ver detalhes',
                        de: 'Details ansehen'
                    })}
                </span>
            </div>
        </a>
    )
}
