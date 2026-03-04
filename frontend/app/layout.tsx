import './globals.css'
import type { Metadata, Viewport } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import { Manrope, Space_Grotesk } from 'next/font/google'
import LanguageDropdown from './components/nav/LanguageDropdown'
import {
    type Locale,
    getOpenGraphLocale,
    stripLocaleFromPathname,
    withLocalePath
} from './lib/i18n'
import { getLocaleAlternates, getRequestLocale } from './lib/requestLocale'

const bodyFont = Manrope({
    subsets: ['latin'],
    variable: '--font-body',
    weight: ['400', '500', '600', '700']
})

const displayFont = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-display',
    weight: ['500', '600', '700']
})

function getCopy(locale: Locale) {
    if (locale === 'fr') {
        return {
            title: 'Plugins PocketMine pour serveurs Minecraft Bedrock | PMarketplace',
            description:
                'Découvrez des plugins PocketMine-MP gratuits et premium pour serveurs Minecraft Bedrock.',
            keywords: [
                'plugins pocketmine',
                'plugins pocketmine-mp',
                'plugins minecraft bedrock',
                'plugins pocketmine gratuits',
                'plugins pocketmine payants',
                'marketplace pocketmine'
            ],
            nav: {
                home: 'Accueil',
                browse: 'Parcourir les plugins',
                contact: 'Contact',
                about: 'À propos',
                cart: 'Panier',
                account: 'Mon compte',
                signin: 'Connexion'
            },
            footer: {
                contact: 'Contact',
                plugins: 'Plugins',
                cart: 'Panier'
            }
        }
    }

    if (locale === 'es') {
        return {
            title: 'Plugins PocketMine para servidores Minecraft Bedrock | PMarketplace',
            description:
                'Descubre plugins PocketMine-MP gratuitos y premium para servidores Minecraft Bedrock.',
            keywords: [
                'plugins pocketmine',
                'plugins pocketmine-mp',
                'plugins minecraft bedrock',
                'plugins pocketmine gratis',
                'plugins pocketmine premium',
                'marketplace pocketmine'
            ],
            nav: {
                home: 'Inicio',
                browse: 'Explorar plugins',
                contact: 'Contacto',
                about: 'Sobre nosotros',
                cart: 'Carrito',
                account: 'Mi cuenta',
                signin: 'Iniciar sesión'
            },
            footer: {
                contact: 'Contacto',
                plugins: 'Plugins',
                cart: 'Carrito'
            }
        }
    }

    if (locale === 'pt-br') {
        return {
            title: 'Plugins PocketMine para servidores Minecraft Bedrock | PMarketplace',
            description:
                'Descubra plugins PocketMine-MP gratuitos e premium para servidores Minecraft Bedrock.',
            keywords: [
                'plugins pocketmine',
                'plugins pocketmine-mp',
                'plugins minecraft bedrock',
                'plugins pocketmine gratis',
                'plugins pocketmine premium',
                'marketplace pocketmine'
            ],
            nav: {
                home: 'Início',
                browse: 'Explorar plugins',
                contact: 'Contato',
                about: 'Sobre nós',
                cart: 'Carrinho',
                account: 'Minha conta',
                signin: 'Entrar'
            },
            footer: {
                contact: 'Contato',
                plugins: 'Plugins',
                cart: 'Carrinho'
            }
        }
    }

    if (locale === 'de') {
        return {
            title: 'PocketMine-Plugins für Minecraft-Bedrock-Server | PMarketplace',
            description:
                'Entdecke kostenlose und Premium-PocketMine-MP-Plugins für Minecraft-Bedrock-Server.',
            keywords: [
                'pocketmine plugins',
                'pocketmine-mp plugins',
                'minecraft bedrock plugins',
                'kostenlose pocketmine plugins',
                'premium pocketmine plugins',
                'pocketmine marketplace'
            ],
            nav: {
                home: 'Startseite',
                browse: 'Plugins durchsuchen',
                contact: 'Kontakt',
                about: 'Über uns',
                cart: 'Warenkorb',
                account: 'Mein Konto',
                signin: 'Anmelden'
            },
            footer: {
                contact: 'Kontakt',
                plugins: 'Plugins',
                cart: 'Warenkorb'
            }
        }
    }

    if (locale === 'it') {
        return {
            title: 'Plugin PocketMine per server Minecraft Bedrock | PMarketplace',
            description:
                'Scopri plugin PocketMine-MP gratuiti e premium per server Minecraft Bedrock.',
            keywords: [
                'plugin pocketmine',
                'plugin pocketmine-mp',
                'plugin minecraft bedrock',
                'plugin pocketmine gratis',
                'plugin pocketmine premium',
                'marketplace pocketmine'
            ],
            nav: {
                home: 'Home',
                browse: 'Esplora plugin',
                contact: 'Contatto',
                about: 'Chi siamo',
                cart: 'Carrello',
                account: 'Il mio account',
                signin: 'Accedi'
            },
            footer: {
                contact: 'Contatto',
                plugins: 'Plugin',
                cart: 'Carrello'
            }
        }
    }

    if (locale === 'nl') {
        return {
            title: 'PocketMine-plugins voor Minecraft Bedrock-servers | PMarketplace',
            description:
                'Ontdek gratis en premium PocketMine-MP-plugins voor Minecraft Bedrock-servers.',
            keywords: [
                'pocketmine plugins',
                'pocketmine-mp plugins',
                'minecraft bedrock plugins',
                'gratis pocketmine plugins',
                'premium pocketmine plugins',
                'pocketmine marketplace'
            ],
            nav: {
                home: 'Home',
                browse: 'Plugins bekijken',
                contact: 'Contact',
                about: 'Over ons',
                cart: 'Winkelwagen',
                account: 'Mijn account',
                signin: 'Inloggen'
            },
            footer: {
                contact: 'Contact',
                plugins: 'Plugins',
                cart: 'Winkelwagen'
            }
        }
    }

    if (locale === 'pl') {
        return {
            title: 'Pluginy PocketMine dla serwerów Minecraft Bedrock | PMarketplace',
            description:
                'Odkrywaj darmowe i premium pluginy PocketMine-MP dla serwerów Minecraft Bedrock.',
            keywords: [
                'pluginy pocketmine',
                'pluginy pocketmine-mp',
                'pluginy minecraft bedrock',
                'darmowe pluginy pocketmine',
                'premium pluginy pocketmine',
                'marketplace pocketmine'
            ],
            nav: {
                home: 'Start',
                browse: 'Przeglądaj pluginy',
                contact: 'Kontakt',
                about: 'O nas',
                cart: 'Koszyk',
                account: 'Moje konto',
                signin: 'Zaloguj się'
            },
            footer: {
                contact: 'Kontakt',
                plugins: 'Pluginy',
                cart: 'Koszyk'
            }
        }
    }

    if (locale === 'ru') {
        return {
            title: 'Плагины PocketMine для серверов Minecraft Bedrock | PMarketplace',
            description:
                'Откройте бесплатные и премиум плагины PocketMine-MP для серверов Minecraft Bedrock.',
            keywords: [
                'плагины pocketmine',
                'плагины pocketmine-mp',
                'плагины minecraft bedrock',
                'бесплатные плагины pocketmine',
                'премиум плагины pocketmine',
                'marketplace pocketmine'
            ],
            nav: {
                home: 'Главная',
                browse: 'Каталог плагинов',
                contact: 'Контакты',
                about: 'О нас',
                cart: 'Корзина',
                account: 'Мой аккаунт',
                signin: 'Войти'
            },
            footer: {
                contact: 'Контакты',
                plugins: 'Плагины',
                cart: 'Корзина'
            }
        }
    }

    return {
        title: 'PocketMine Plugin Marketplace for Minecraft Bedrock | PMarketplace',
        description:
            'Buy PocketMine-MP plugins from independent creators or sell your own plugins to Minecraft Bedrock server owners.',
        keywords: [
            'PocketMine plugins',
            'PocketMine-MP plugins',
            'Minecraft Bedrock server plugins',
            'free PocketMine plugins',
            'premium PocketMine plugins',
            'PocketMine plugin marketplace',
            'sell PocketMine plugins',
            'PocketMine creator marketplace',
            'plugins pocketmine gratuits',
            'plugins pocketmine payants'
        ],
        nav: {
            home: 'Home',
            browse: 'Browse plugins',
            contact: 'Contact',
            about: 'About us',
            cart: 'Cart',
            account: 'My account',
            signin: 'Sign in'
        },
        footer: {
            contact: 'Contact',
            plugins: 'Plugins',
            cart: 'Cart'
        }
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const copy = getCopy(locale)
    const canonical = withLocalePath('/', locale)

    return {
        title: {
            default: copy.title,
            template: '%s | PMarketplace'
        },
        description: copy.description,
        keywords: copy.keywords,
        applicationName: 'PMarketplace',
        metadataBase: new URL('https://pmarketplace.com'),
        alternates: {
            canonical,
            ...getLocaleAlternates('/')
        },
        openGraph: {
            type: 'website',
            url: `https://pmarketplace.com${canonical}`,
            siteName: 'PMarketplace',
            title: copy.title,
            description: copy.description,
            locale: getOpenGraphLocale(locale)
        },
        twitter: {
            card: 'summary_large_image',
            title: copy.title,
            description: copy.description
        }
    }
}

export const viewport: Viewport = {
    themeColor: '#11131A'
}

export default async function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const locale = await getRequestLocale()
    const copy = getCopy(locale)
    const cookieStore = await cookies()
    const isLoggedIn = Boolean(cookieStore.get('token')?.value)
    const headerStore = await headers()
    const currentPath = headerStore.get('x-pmarketplace-pathname') || `/${locale}`
    const currentWithoutLocale = stripLocaleFromPathname(currentPath).pathname
    const languageLabel =
        locale === 'fr'
            ? 'Langue'
            : locale === 'es'
              ? 'Idioma'
              : locale === 'pt-br'
                ? 'Idioma'
                : locale === 'de'
                  ? 'Sprache'
                  : locale === 'it'
                    ? 'Lingua'
                    : locale === 'nl'
                      ? 'Taal'
                      : locale === 'pl'
                        ? 'Język'
                        : locale === 'ru'
                          ? 'Язык'
                  : 'Language'
    const languageOptions = [
        {
            locale: 'en' as const,
            name: 'English',
            flag: '🇬🇧',
            href: withLocalePath(currentWithoutLocale, 'en')
        },
        {
            locale: 'fr' as const,
            name: 'Français',
            flag: '🇫🇷',
            href: withLocalePath(currentWithoutLocale, 'fr')
        },
        {
            locale: 'es' as const,
            name: 'Español',
            flag: '🇪🇸',
            href: withLocalePath(currentWithoutLocale, 'es')
        },
        {
            locale: 'pt-br' as const,
            name: 'Português (BR)',
            flag: '🇧🇷',
            href: withLocalePath(currentWithoutLocale, 'pt-br')
        },
        {
            locale: 'de' as const,
            name: 'Deutsch',
            flag: '🇩🇪',
            href: withLocalePath(currentWithoutLocale, 'de')
        },
        {
            locale: 'it' as const,
            name: 'Italiano',
            flag: '🇮🇹',
            href: withLocalePath(currentWithoutLocale, 'it')
        },
        {
            locale: 'nl' as const,
            name: 'Nederlands',
            flag: '🇳🇱',
            href: withLocalePath(currentWithoutLocale, 'nl')
        },
        {
            locale: 'pl' as const,
            name: 'Polski',
            flag: '🇵🇱',
            href: withLocalePath(currentWithoutLocale, 'pl')
        },
        {
            locale: 'ru' as const,
            name: 'Русский',
            flag: '🇷🇺',
            href: withLocalePath(currentWithoutLocale, 'ru')
        }
    ]

    return (
        <html lang={locale}>
            <body className={`${bodyFont.variable} ${displayFont.variable}`}>
                <div className="site-wrapper">
                    <header className="navbar">
                        <div className="container nav-inner">
                            <Link
                                href={withLocalePath('/', locale)}
                                className="logo"
                                aria-label="PMarketplace"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="PMarketplace Logo"
                                    width={34}
                                    height={34}
                                    className="logo-mark"
                                    priority
                                />
                                <span>PMarketplace</span>
                            </Link>

                            <nav className="nav-links" aria-label="Primary">
                                <Link href={withLocalePath('/', locale)}>
                                    {copy.nav.home}
                                </Link>
                                <Link href={withLocalePath('/plugins', locale)}>
                                    {copy.nav.browse}
                                </Link>
                                <Link href={withLocalePath('/contact', locale)}>
                                    {copy.nav.contact}
                                </Link>
                                <Link href={withLocalePath('/about', locale)}>
                                    {copy.nav.about}
                                </Link>
                                <Link href={withLocalePath('/cart', locale)}>
                                    {copy.nav.cart}
                                </Link>
                                {isLoggedIn ? (
                                    <Link
                                        href={withLocalePath('/account', locale)}
                                        className="account-link"
                                    >
                                        {copy.nav.account}
                                    </Link>
                                ) : (
                                    <Link
                                        href={withLocalePath('/login', locale)}
                                        className="account-link"
                                    >
                                        {copy.nav.signin}
                                    </Link>
                                )}
                                <LanguageDropdown
                                    locale={locale}
                                    options={languageOptions}
                                    label={languageLabel}
                                />
                            </nav>
                        </div>
                    </header>

                    <main className="main-content">{children}</main>

                    <footer className="footer">
                        <div className="container footer-inner">
                            <span>© {new Date().getFullYear()} PMarketplace</span>
                            <div className="footer-links">
                                <Link href={withLocalePath('/contact', locale)}>
                                    {copy.footer.contact}
                                </Link>
                                <Link href={withLocalePath('/plugins', locale)}>
                                    {copy.footer.plugins}
                                </Link>
                                <Link href={withLocalePath('/cart', locale)}>
                                    {copy.footer.cart}
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}
