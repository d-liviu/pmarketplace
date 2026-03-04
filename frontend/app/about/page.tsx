import type { Metadata } from 'next'
import { withLocalePath } from '../lib/i18n'
import { pickLocaleText } from '../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../lib/requestLocale'

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const canonical = withLocalePath('/about', locale)

    return {
        title: pickLocaleText(locale, {
            en: 'About PMHub | PocketMine Plugin Marketplace',
            fr: 'À propos de PMHub | Marketplace de plugins PocketMine',
            es: 'Sobre PMHub | Marketplace de plugins PocketMine',
            'pt-br': 'Sobre a PMHub | Marketplace de plugins PocketMine',
            de: 'Über PMHub | PocketMine-Plugin-Marktplatz'
        }),
        description: pickLocaleText(locale, {
            en: 'Learn how PMHub helps the PocketMine community find free and premium plugins for Minecraft Bedrock servers.',
            fr: 'Découvrez comment PMHub aide la communauté PocketMine à trouver des plugins gratuits et premium pour serveurs Minecraft Bedrock.',
            es: 'Descubre cómo PMHub ayuda a la comunidad PocketMine a encontrar plugins gratis y premium para servidores Minecraft Bedrock.',
            'pt-br':
                'Descubra como a PMHub ajuda a comunidade PocketMine a encontrar plugins gratuitos e premium para servidores Minecraft Bedrock.',
            de: 'Erfahre, wie PMHub der PocketMine-Community hilft, kostenlose und Premium-Plugins für Minecraft-Bedrock-Server zu finden.'
        }),
        keywords: [
            'PocketMine community',
            'PocketMine plugin marketplace',
            'Minecraft Bedrock server plugins',
            'free and premium PocketMine plugins'
        ],
        alternates: {
            canonical,
            ...getLocaleAlternates('/about')
        }
    }
}

export default async function AboutPage() {
    const locale = await getRequestLocale()

    return (
        <>
            <section className="page-hero">
                <div className="container">
                    <span className="hero-badge">
                        {pickLocaleText(locale, {
                            en: 'About',
                            fr: 'À propos',
                            es: 'Sobre nosotros',
                            'pt-br': 'Sobre',
                            de: 'Über uns'
                        })}
                    </span>
                    <h1 className="page-title">
                        {pickLocaleText(locale, {
                            en: 'Built for serious PocketMine servers.',
                            fr: 'Conçu pour les serveurs PocketMine ambitieux.',
                            es: 'Diseñado para servidores PocketMine serios.',
                            'pt-br': 'Feito para servidores PocketMine de verdade.',
                            de: 'Gemacht für ernsthafte PocketMine-Server.'
                        })}
                    </h1>
                    <p className="page-subtitle">
                        {pickLocaleText(locale, {
                            en: 'PMHub helps Minecraft Bedrock server owners find secure, reliable, and maintainable PocketMine-MP plugins.',
                            fr: 'PMHub aide les propriétaires de serveurs Minecraft Bedrock à trouver des plugins PocketMine-MP sûrs, fiables et maintenables.',
                            es: 'PMHub ayuda a dueños de servidores Minecraft Bedrock a encontrar plugins PocketMine-MP seguros, fiables y mantenibles.',
                            'pt-br':
                                'A PMHub ajuda donos de servidores Minecraft Bedrock a encontrar plugins PocketMine-MP seguros, confiáveis e fáceis de manter.',
                            de: 'PMHub hilft Minecraft-Bedrock-Serverbetreibern, sichere, zuverlässige und wartbare PocketMine-MP-Plugins zu finden.'
                        })}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container detail-grid">
                    <div className="card">
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'Our mission',
                                fr: 'Notre mission',
                                es: 'Nuestra misión',
                                'pt-br': 'Nossa missão',
                                de: 'Unsere Mission'
                            })}
                        </h2>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Help the PocketMine community access both free and premium plugins that keep Bedrock servers stable and communities growing.',
                                fr: 'Aider la communauté PocketMine à accéder à des plugins gratuits et premium qui rendent les serveurs Bedrock stables et les communautés plus solides.',
                                es: 'Ayudar a la comunidad PocketMine a acceder a plugins gratis y premium que mantengan servidores Bedrock estables y comunidades en crecimiento.',
                                'pt-br':
                                    'Ajudar a comunidade PocketMine a acessar plugins gratuitos e premium que mantenham servidores Bedrock estáveis e comunidades em crescimento.',
                                de: 'Der PocketMine-Community Zugang zu kostenlosen und Premium-Plugins geben, die Bedrock-Server stabil halten und Communities wachsen lassen.'
                            })}
                        </p>
                    </div>
                    <div className="card">
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'What we value',
                                fr: 'Nos valeurs',
                                es: 'Lo que valoramos',
                                'pt-br': 'Nossos valores',
                                de: 'Unsere Werte'
                            })}
                        </h2>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Security, long-term reliability, and plugin quality that supports real-world PocketMine-MP operations.',
                                fr: 'La sécurité, la fiabilité long terme et une qualité de plugin adaptée aux vraies opérations PocketMine-MP.',
                                es: 'Seguridad, fiabilidad a largo plazo y calidad de plugin para operaciones reales en PocketMine-MP.',
                                'pt-br':
                                    'Segurança, confiabilidade de longo prazo e qualidade de plugin para operações reais em PocketMine-MP.',
                                de: 'Sicherheit, langfristige Zuverlässigkeit und Plugin-Qualität für echte PocketMine-MP-Operationen.'
                            })}
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}
