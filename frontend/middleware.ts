import { NextResponse, type NextRequest } from 'next/server'
import {
    DEFAULT_LOCALE,
    LOCALE_COOKIE,
    getLocaleFromAcceptLanguage,
    getLocaleFromCountry,
    isSupportedLocale,
    stripLocaleFromPathname,
    withLocalePath
} from './app/lib/i18n'

const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

function shouldSkip(pathname: string) {
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico' ||
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml'
    ) {
        return true
    }

    return /\.[^/]+$/.test(pathname)
}

function detectLocale(request: NextRequest) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
    if (isSupportedLocale(cookieLocale)) {
        return cookieLocale
    }

    const fromLanguage = getLocaleFromAcceptLanguage(
        request.headers.get('accept-language')
    )
    if (fromLanguage) {
        return fromLanguage
    }

    const country =
        request.headers.get('x-vercel-ip-country') ||
        request.headers.get('cf-ipcountry')
    const fromCountry = getLocaleFromCountry(country)
    if (fromCountry) {
        return fromCountry
    }

    return DEFAULT_LOCALE
}

function setLocaleCookie(response: NextResponse, locale: string) {
    response.cookies.set({
        name: LOCALE_COOKIE,
        value: locale,
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
        sameSite: 'lax'
    })
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (shouldSkip(pathname)) {
        return NextResponse.next()
    }

    const stripped = stripLocaleFromPathname(pathname)
    if (stripped.locale) {
        const rewriteUrl = request.nextUrl.clone()
        rewriteUrl.pathname = stripped.pathname

        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-pmhub-locale', stripped.locale)
        requestHeaders.set('x-pmhub-pathname', pathname)

        const response = NextResponse.rewrite(rewriteUrl, {
            request: {
                headers: requestHeaders
            }
        })
        setLocaleCookie(response, stripped.locale)
        return response
    }

    const locale = detectLocale(request)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = withLocalePath(pathname, locale)

    const response = NextResponse.redirect(redirectUrl)
    setLocaleCookie(response, locale)
    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)']
}
