import type { Metadata } from 'next'
import Script from 'next/script'
import CallToAction from './components/landing/CallToAction'
import CommunitySEO from './components/landing/CommunitySEO'
import Hero from './components/landing/Hero'
import ValueProps from './components/landing/ValueProps'
import FeaturedPlugins from './components/landing/FeaturedPlugins'
import { getOpenGraphLocale, withLocalePath } from './lib/i18n'
import { pickLocaleText } from './lib/localeText'
import { getLocaleAlternates, getRequestLocale } from './lib/requestLocale'

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const title = pickLocaleText(locale, {
        en: 'Buy & Sell PocketMine Plugins for Bedrock Servers | PMarketplace',
        fr: 'Plugins PocketMine Gratuits & Premium pour serveurs Bedrock | PMarketplace',
        es: 'Plugins PocketMine Gratis y Premium para servidores Bedrock | PMarketplace',
        'pt-br':
            'Plugins PocketMine Gratuitos e Premium para servidores Bedrock | PMarketplace',
        de: 'Kostenlose und Premium-PocketMine-Plugins für Bedrock-Server | PMarketplace'
    })
    const description = pickLocaleText(locale, {
        en: 'PMarketplace is a creator marketplace where independent developers sell PocketMine-MP plugins and server owners buy trusted releases for Minecraft Bedrock.',
        fr: 'Achetez des plugins PocketMine-MP gratuits et premium pour serveurs Minecraft Bedrock. PMarketplace aide les propriétaires à trouver des plugins performants pour économie, factions, modération et gameplay.',
        es: 'Compra plugins PocketMine-MP gratis y premium para servidores Minecraft Bedrock. PMarketplace ayuda a dueños de servidores a encontrar plugins de calidad para economía, facciones, moderación, rendimiento y gameplay.',
        'pt-br':
            'Compre plugins PocketMine-MP gratuitos e premium para servidores Minecraft Bedrock. A PMarketplace ajuda donos de servidores a encontrar plugins de qualidade para economia, facções, moderação, desempenho e gameplay.',
        de: 'Kaufe kostenlose und Premium-PocketMine-MP-Plugins für Minecraft-Bedrock-Server. PMarketplace hilft Serverbetreibern, hochwertige Plugins für Wirtschaft, Fraktionen, Moderation, Performance und Gameplay zu finden.'
    })
    const canonical = withLocalePath('/', locale)

    return {
        title,
        description,
        keywords: [
            'PocketMine plugins',
            'PocketMine-MP plugins',
            'PocketMine marketplace',
            'PocketMine plugin shop',
            'Bedrock server plugins',
            'Minecraft Bedrock plugins',
            'free PocketMine plugins',
            'premium PocketMine plugins',
            'PocketMine server addons',
            'sell PocketMine plugins',
            'PocketMine creator marketplace',
            'plugins pocketmine gratuits',
            'plugins pocketmine payants',
            'serveur minecraft bedrock plugins'
        ],
        openGraph: {
            title,
            description,
            url: `https://pmarketplace.com${canonical}`,
            siteName: 'PMarketplace',
            images: [
                {
                    url: '/images/marketplace-backdrop.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'PMarketplace community plugin marketplace'
                }
            ],
            type: 'website',
            locale: getOpenGraphLocale(locale)
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/images/marketplace-backdrop.jpg']
        },
        alternates: {
            canonical,
            ...getLocaleAlternates('/')
        },
        robots: {
            index: true,
            follow: true
        }
    }
}

export default async function Home() {
    const locale = await getRequestLocale()
    const localizedPluginsUrl = `https://pmarketplace.com${withLocalePath('/plugins', locale)}`
    const localizedHomeUrl = `https://pmarketplace.com${withLocalePath('/', locale)}`
    const description = pickLocaleText(locale, {
        en: 'Buy from independent PocketMine creators or sell your own PocketMine-MP plugins.',
        fr: 'Achetez des plugins PocketMine-MP gratuits et premium pour serveurs Minecraft Bedrock.',
        es: 'Compra plugins PocketMine-MP gratis y premium para servidores Minecraft Bedrock.',
        'pt-br':
            'Compre plugins PocketMine-MP gratuitos e premium para servidores Minecraft Bedrock.',
        de: 'Kaufe kostenlose und Premium-PocketMine-MP-Plugins für Minecraft-Bedrock-Server.'
    })
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                name: 'PMarketplace',
                url: localizedHomeUrl,
                description,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${localizedPluginsUrl}?search={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'PMarketplace',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://pmarketplace.com/logo.png'
                    }
                }
            },
            {
                '@type': 'CollectionPage',
                name: pickLocaleText(locale, {
                    en: 'PocketMine Plugins Catalog',
                    fr: 'Catalogue de plugins PocketMine',
                    es: 'Catálogo de plugins PocketMine',
                    'pt-br': 'Catálogo de plugins PocketMine',
                    de: 'PocketMine-Plugin-Katalog'
                }),
                url: localizedPluginsUrl,
                description: pickLocaleText(locale, {
                    en: 'Browse PocketMine plugins sold by independent creators for Minecraft Bedrock servers.',
                    fr: 'Parcourez des plugins PocketMine gratuits et premium pour serveurs Minecraft Bedrock.',
                    es: 'Explora plugins PocketMine gratis y premium para servidores Minecraft Bedrock.',
                    'pt-br':
                        'Explore plugins PocketMine gratuitos e premium para servidores Minecraft Bedrock.',
                    de: 'Durchsuche kostenlose und Premium-PocketMine-Plugins für Minecraft-Bedrock-Server.'
                })
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: pickLocaleText(locale, {
                            en: 'Do you offer free PocketMine plugins?',
                            fr: 'Proposez-vous des plugins PocketMine gratuits ?',
                            es: '¿Ofrecen plugins PocketMine gratis?',
                            'pt-br': 'Vocês oferecem plugins PocketMine gratuitos?',
                            de: 'Bietet ihr kostenlose PocketMine-Plugins an?'
                        }),
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: pickLocaleText(locale, {
                                en: 'Yes. Independent creators list both free and premium PocketMine plugins on PMarketplace.',
                                fr: 'Oui. PMarketplace propose à la fois des plugins PocketMine gratuits et premium pour serveurs Minecraft Bedrock.',
                                es: 'Sí. PMarketplace incluye plugins PocketMine gratis y premium para servidores Minecraft Bedrock.',
                                'pt-br':
                                    'Sim. A PMarketplace inclui plugins PocketMine gratuitos e premium para servidores Minecraft Bedrock.',
                                de: 'Ja. PMarketplace bietet kostenlose und Premium-PocketMine-Plugins für Minecraft-Bedrock-Server.'
                            })
                        }
                    },
                    {
                        '@type': 'Question',
                        name: pickLocaleText(locale, {
                            en: 'Can creators sell plugins on PMarketplace?',
                            fr: 'Les créateurs peuvent-ils vendre des plugins sur PMarketplace ?',
                            es: '¿Los creadores pueden vender plugins en PMarketplace?',
                            'pt-br': 'Criadores podem vender plugins na PMarketplace?',
                            de: 'Können Creator Plugins auf PMarketplace verkaufen?'
                        }),
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: pickLocaleText(locale, {
                                en: 'Yes. PMarketplace is built for creator listings, secure checkout, and license delivery for PocketMine-MP plugins.',
                                fr: 'Oui. PMarketplace est conçu pour publier des plugins, encaisser les paiements en sécurité et livrer les licences instantanément.',
                                es: 'Sí. PMarketplace está hecho para publicar plugins, procesar pagos seguros y entregar licencias al instante.',
                                'pt-br':
                                    'Sim. A PMarketplace foi feita para publicar plugins, processar pagamentos com segurança e entregar licenças instantaneamente.',
                                de: 'Ja. PMarketplace ist für Creator-Listings, sicheren Checkout und sofortige Lizenzbereitstellung gebaut.'
                            })
                        }
                    }
                ]
            }
        ]
    }

    return (
        <>
            <Hero locale={locale} />
            <ValueProps locale={locale} />
            <FeaturedPlugins locale={locale} />
            <CommunitySEO locale={locale} />
            <CallToAction locale={locale} />

            <Script
                id="pmarketplace-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
        </>
    )
}
