import type { MetadataRoute } from 'next'
import { SUPPORTED_LOCALES } from './lib/i18n'

export default function robots(): MetadataRoute.Robots {
    const utilityPaths = ['/login', '/account', '/cart', '/checkout', '/admin']
    const localizedUtilityPaths = SUPPORTED_LOCALES.flatMap((locale) =>
        utilityPaths.map((path) => `/${locale}${path}`)
    )

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    ...utilityPaths,
                    ...localizedUtilityPaths
                ]
            }
        ],
        sitemap: 'https://pmarketplace.com/sitemap.xml',
        host: 'https://pmarketplace.com'
    }
}
