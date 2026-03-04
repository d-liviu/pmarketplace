import type { MetadataRoute } from 'next'
import { getApiBaseUrl } from './lib/apiBase'
import { toSlug } from './lib/slug'
import { SUPPORTED_LOCALES, withLocalePath } from './lib/i18n'

const siteUrl = 'https://pmarketplace.com'
const apiBaseUrl = getApiBaseUrl()

type Plugin = {
    id?: string | number
    slug?: string | null
    name?: string | null
    updated_at?: string
}

type PluginRoute = {
    slug: string
    lastModified: Date
}

function buildUrl(pathname: string) {
    return `${siteUrl}${pathname}`
}

async function getPluginRoutes(): Promise<PluginRoute[]> {
    try {
        const res = await fetch(`${apiBaseUrl}/plugins`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            return []
        }

        const data: unknown = await res.json()
        const plugins = Array.isArray(data) ? (data as Plugin[]) : []
        const seen = new Set<string>()

        return plugins
            .map((plugin) => {
                const slug = plugin.slug?.trim() || toSlug(plugin.name ?? '')
                if (!slug || seen.has(slug)) {
                    return null
                }
                seen.add(slug)

                return {
                    slug,
                    lastModified: plugin.updated_at
                        ? new Date(plugin.updated_at)
                        : new Date()
                }
            })
            .filter((entry): entry is PluginRoute => entry !== null)
    } catch (error) {
        console.error('Failed to generate plugin sitemap entries', error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const lastModified = new Date()
    const pluginRoutes = await getPluginRoutes()

    const staticEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) => [
        {
            url: buildUrl(withLocalePath('/', locale)),
            lastModified,
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: buildUrl(withLocalePath('/plugins', locale)),
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.95
        },
        {
            url: buildUrl(withLocalePath('/about', locale)),
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: buildUrl(withLocalePath('/contact', locale)),
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.6
        }
    ])

    const pluginEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) =>
        pluginRoutes.map((plugin) => ({
            url: buildUrl(withLocalePath(`/plugins/${plugin.slug}`, locale)),
            lastModified: plugin.lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.7
        }))
    )

    return [...staticEntries, ...pluginEntries]
}
