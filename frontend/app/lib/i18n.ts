export const SUPPORTED_LOCALES = [
    'en',
    'fr',
    'es',
    'pt-br',
    'de',
    'it',
    'nl',
    'pl',
    'ru'
] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'pmarketplace_locale'

const HREF_LANG_BY_LOCALE: Record<Locale, string> = {
    en: 'en',
    fr: 'fr',
    es: 'es',
    'pt-br': 'pt-BR',
    de: 'de',
    it: 'it',
    nl: 'nl',
    pl: 'pl',
    ru: 'ru'
}

const OPEN_GRAPH_LOCALE_BY_LOCALE: Record<Locale, string> = {
    en: 'en_US',
    fr: 'fr_FR',
    es: 'es_ES',
    'pt-br': 'pt_BR',
    de: 'de_DE',
    it: 'it_IT',
    nl: 'nl_NL',
    pl: 'pl_PL',
    ru: 'ru_RU'
}

const FRENCH_COUNTRIES = new Set([
    'FR',
    'BE',
    'LU',
    'MC',
    'SN',
    'CI',
    'MA',
    'DZ',
    'TN'
])

const SPANISH_COUNTRIES = new Set([
    'ES',
    'MX',
    'AR',
    'CL',
    'CO',
    'PE',
    'VE',
    'UY',
    'PY',
    'BO',
    'EC',
    'GT',
    'HN',
    'NI',
    'SV',
    'CR',
    'PA',
    'DO',
    'PR'
])

const PORTUGUESE_COUNTRIES = new Set(['BR', 'PT', 'AO', 'MZ'])
const GERMAN_COUNTRIES = new Set(['DE', 'AT'])
const ITALIAN_COUNTRIES = new Set(['IT', 'SM', 'VA'])
const DUTCH_COUNTRIES = new Set(['NL'])
const POLISH_COUNTRIES = new Set(['PL'])
const RUSSIAN_COUNTRIES = new Set(['RU'])

function getLocaleFromPathSegment(segment: string | undefined): Locale | null {
    if (!segment) {
        return null
    }

    const lower = segment.toLowerCase()
    if (lower === 'pt-br' || lower === 'pt_br' || lower === 'pt') {
        return 'pt-br'
    }

    if (
        lower === 'en' ||
        lower === 'fr' ||
        lower === 'es' ||
        lower === 'de' ||
        lower === 'it' ||
        lower === 'nl' ||
        lower === 'pl' ||
        lower === 'ru'
    ) {
        return lower
    }

    return null
}

export function isSupportedLocale(value: string | null | undefined): value is Locale {
    return (
        value === 'en' ||
        value === 'fr' ||
        value === 'es' ||
        value === 'pt-br' ||
        value === 'de' ||
        value === 'it' ||
        value === 'nl' ||
        value === 'pl' ||
        value === 'ru'
    )
}

export function normalizeLocale(value: string | null | undefined): Locale {
    if (!value) {
        return DEFAULT_LOCALE
    }

    const lower = value.toLowerCase()
    if (lower.startsWith('fr')) {
        return 'fr'
    }
    if (lower.startsWith('es')) {
        return 'es'
    }
    if (lower.startsWith('de')) {
        return 'de'
    }
    if (lower.startsWith('it')) {
        return 'it'
    }
    if (lower.startsWith('nl')) {
        return 'nl'
    }
    if (lower.startsWith('pl')) {
        return 'pl'
    }
    if (lower.startsWith('ru')) {
        return 'ru'
    }
    if (lower.startsWith('pt')) {
        return 'pt-br'
    }
    if (lower.startsWith('en')) {
        return 'en'
    }

    return DEFAULT_LOCALE
}

export function getLocaleHrefLang(locale: Locale): string {
    return HREF_LANG_BY_LOCALE[locale]
}

export function getOpenGraphLocale(locale: Locale): string {
    return OPEN_GRAPH_LOCALE_BY_LOCALE[locale]
}

export function getLocaleFromAcceptLanguage(
    acceptLanguage: string | null | undefined
): Locale | null {
    if (!acceptLanguage) {
        return null
    }

    const entries = acceptLanguage
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)

    for (const entry of entries) {
        const [language] = entry.split(';')
        const normalized = normalizeLocale(language)
        if (isSupportedLocale(normalized)) {
            return normalized
        }
    }

    return null
}

export function getLocaleFromCountry(country: string | null | undefined): Locale | null {
    if (!country) {
        return null
    }

    const normalizedCountry = country.toUpperCase()
    if (PORTUGUESE_COUNTRIES.has(normalizedCountry)) {
        return 'pt-br'
    }
    if (GERMAN_COUNTRIES.has(normalizedCountry)) {
        return 'de'
    }
    if (ITALIAN_COUNTRIES.has(normalizedCountry)) {
        return 'it'
    }
    if (DUTCH_COUNTRIES.has(normalizedCountry)) {
        return 'nl'
    }
    if (POLISH_COUNTRIES.has(normalizedCountry)) {
        return 'pl'
    }
    if (RUSSIAN_COUNTRIES.has(normalizedCountry)) {
        return 'ru'
    }
    if (FRENCH_COUNTRIES.has(normalizedCountry)) {
        return 'fr'
    }
    if (SPANISH_COUNTRIES.has(normalizedCountry)) {
        return 'es'
    }

    return null
}

export function stripLocaleFromPathname(pathname: string): {
    locale: Locale | null
    pathname: string
} {
    const segments = pathname.split('/').filter(Boolean)
    const locale = getLocaleFromPathSegment(segments[0])

    if (!locale) {
        return {
            locale: null,
            pathname
        }
    }

    const rest = segments.slice(1).join('/')

    return {
        locale,
        pathname: rest ? `/${rest}` : '/'
    }
}

export function getLocaleFromPathname(pathname: string | null | undefined): Locale {
    if (!pathname) {
        return DEFAULT_LOCALE
    }

    const { locale } = stripLocaleFromPathname(pathname)
    return locale ?? DEFAULT_LOCALE
}

export function withLocalePath(pathname: string, locale: Locale): string {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
    if (normalizedPath === '/') {
        return `/${locale}`
    }
    return `/${locale}${normalizedPath}`
}
