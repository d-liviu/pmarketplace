import { cookies, headers } from 'next/headers'
import {
    DEFAULT_LOCALE,
    LOCALE_COOKIE,
    SUPPORTED_LOCALES,
    type Locale,
    getLocaleHrefLang,
    normalizeLocale,
    stripLocaleFromPathname,
    withLocalePath
} from './i18n'

export async function getRequestLocale(): Promise<Locale> {
    const headerStore = await headers()

    const pathnameHeader = headerStore.get('x-pmhub-pathname')
    if (pathnameHeader) {
        const { locale: localeFromPath } = stripLocaleFromPathname(pathnameHeader)
        if (localeFromPath) {
            return localeFromPath
        }
    }

    const localeHeader = headerStore.get('x-pmhub-locale')
    if (localeHeader) {
        return normalizeLocale(localeHeader)
    }

    const cookieStore = await cookies()
    const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value
    if (localeCookie) {
        return normalizeLocale(localeCookie)
    }

    return DEFAULT_LOCALE
}

export function getLocaleAlternates(pathname: string) {
    const languages = SUPPORTED_LOCALES.reduce<Record<string, string>>(
        (acc, locale) => {
            acc[getLocaleHrefLang(locale)] = `https://pocketminehub.com${withLocalePath(pathname, locale)}`
            return acc
        },
        {}
    )

    languages['x-default'] = `https://pocketminehub.com${withLocalePath(pathname, DEFAULT_LOCALE)}`

    return {
        languages
    }
}
