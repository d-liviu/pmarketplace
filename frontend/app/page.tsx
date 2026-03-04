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
        en: 'Free & Premium PocketMine Plugins for Bedrock Servers | PMHub',
        fr: 'Plugins PocketMine Gratuits & Premium pour serveurs Bedrock | PMHub',
        es: 'Plugins PocketMine Gratis y Premium para servidores Bedrock | PMHub',
        'pt-br':
            'Plugins PocketMine Gratuitos e Premium para servidores Bedrock | PMHub',
        de: 'Kostenlose und Premium-PocketMine-Plugins für Bedrock-Server | PMHub'
    })
    const description = pickLocaleText(locale, {
        en: 'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers. PMHub helps server owners find high-quality plugins for economy, factions, moderation, performance, and gameplay.',
        fr: 'Achetez des plugins PocketMine-MP gratuits et premium pour serveurs Minecraft Bedrock. PMHub aide les propriétaires à trouver des plugins performants pour économie, factions, modération et gameplay.',
        es: 'Compra plugins PocketMine-MP gratis y premium para servidores Minecraft Bedrock. PMHub ayuda a dueños de servidores a encontrar plugins de calidad para economía, facciones, moderación, rendimiento y gameplay.',
        'pt-br':
            'Compre plugins PocketMine-MP gratuitos e premium para servidores Minecraft Bedrock. A PMHub ajuda donos de servidores a encontrar plugins de qualidade para economia, facções, moderação, desempenho e gameplay.',
        de: 'Kaufe kostenlose und Premium-PocketMine-MP-Plugins für Minecraft-Bedrock-Server. PMHub hilft Serverbetreibern, hochwertige Plugins für Wirtschaft, Fraktionen, Moderation, Performance und Gameplay zu finden.'
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
            'plugins pocketmine gratuits',
            'plugins pocketmine payants',
            'serveur minecraft bedrock plugins'
        ],
        openGraph: {
            title,
            description,
            url: `https://pocketminehub.com${canonical}`,
            siteName: 'PMHub',
            images: [
                {
                    url: '/hero.jpeg',
                    width: 1200,
                    height: 630,
                    alt: 'PMHub PocketMine plugins'
                }
            ],
            type: 'website',
            locale: getOpenGraphLocale(locale)
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/hero.jpeg']
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
    const localizedPluginsUrl = `https://pocketminehub.com${withLocalePath('/plugins', locale)}`
    const localizedHomeUrl = `https://pocketminehub.com${withLocalePath('/', locale)}`
    const description = pickLocaleText(locale, {
        en: 'Shop free and premium PocketMine-MP plugins for Minecraft Bedrock servers.',
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
                name: 'PMHub',
                url: localizedHomeUrl,
                description,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${localizedPluginsUrl}?search={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'PMHub',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://pocketminehub.com/logo.png'
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
                    en: 'Browse free and premium PocketMine plugins for Minecraft Bedrock servers.',
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
                                en: 'Yes. PMHub includes both free and premium PocketMine plugins for Minecraft Bedrock servers.',
                                fr: 'Oui. PMHub propose à la fois des plugins PocketMine gratuits et premium pour serveurs Minecraft Bedrock.',
                                es: 'Sí. PMHub incluye plugins PocketMine gratis y premium para servidores Minecraft Bedrock.',
                                'pt-br':
                                    'Sim. A PMHub inclui plugins PocketMine gratuitos e premium para servidores Minecraft Bedrock.',
                                de: 'Ja. PMHub bietet kostenlose und Premium-PocketMine-Plugins für Minecraft-Bedrock-Server.'
                            })
                        }
                    },
                    {
                        '@type': 'Question',
                        name: pickLocaleText(locale, {
                            en: 'Are PMHub plugins made for PocketMine-MP servers?',
                            fr: 'Les plugins PMHub sont-ils conçus pour PocketMine-MP ?',
                            es: '¿Los plugins de PMHub están hechos para PocketMine-MP?',
                            'pt-br':
                                'Os plugins da PMHub são feitos para servidores PocketMine-MP?',
                            de: 'Sind PMHub-Plugins für PocketMine-MP-Server gemacht?'
                        }),
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: pickLocaleText(locale, {
                                en: 'Yes. PMHub focuses on PocketMine-MP plugins built for modern Minecraft Bedrock server communities.',
                                fr: 'Oui. PMHub se concentre sur des plugins PocketMine-MP pour les communautés Minecraft Bedrock modernes.',
                                es: 'Sí. PMHub se centra en plugins PocketMine-MP para comunidades modernas de servidores Minecraft Bedrock.',
                                'pt-br':
                                    'Sim. A PMHub foca em plugins PocketMine-MP para comunidades modernas de servidores Minecraft Bedrock.',
                                de: 'Ja. PMHub konzentriert sich auf PocketMine-MP-Plugins für moderne Minecraft-Bedrock-Communities.'
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
                id="pmhub-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
        </>
    )
}
