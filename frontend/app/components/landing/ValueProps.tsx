import { type Locale } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

export default function ValueProps({ locale = 'en' }: { locale?: Locale }) {
    const benefits = pickLocaleText(locale, {
        en: [
            {
                title: 'Security first',
                description:
                    'PocketMine plugins built with permission-safe defaults for Bedrock server admins.'
            },
            {
                title: 'Rock-solid reliability',
                description:
                    'Stable plugin releases you can trust in production Minecraft Bedrock communities.'
            },
            {
                title: 'Maintainable core',
                description:
                    'Clean plugin architecture and readable configs for long-term PocketMine maintenance.'
            },
            {
                title: 'Performance tuned',
                description:
                    'Optimized logic that helps keep tick times low on active Bedrock servers.'
            }
        ],
        fr: [
            {
                title: 'Sécurité d’abord',
                description:
                    'Plugins PocketMine conçus avec des permissions sûres pour les admins Bedrock.'
            },
            {
                title: 'Fiabilité solide',
                description:
                    'Des releases stables pour vos communautés Minecraft Bedrock en production.'
            },
            {
                title: 'Maintenance simple',
                description:
                    'Architecture propre et configs lisibles pour une maintenance PocketMine durable.'
            },
            {
                title: 'Performance optimisée',
                description:
                    'Logique optimisée pour garder de bons tick times sur des serveurs actifs.'
            }
        ],
        es: [
            {
                title: 'Seguridad primero',
                description:
                    'Plugins PocketMine con permisos seguros para administradores Bedrock.'
            },
            {
                title: 'Fiabilidad real',
                description:
                    'Releases estables para comunidades Minecraft Bedrock en producción.'
            },
            {
                title: 'Mantenimiento simple',
                description:
                    'Arquitectura limpia y configuraciones legibles para PocketMine a largo plazo.'
            },
            {
                title: 'Rendimiento optimizado',
                description:
                    'Lógica optimizada para mantener buenos tick times en servidores activos.'
            }
        ],
        'pt-br': [
            {
                title: 'Segurança em primeiro lugar',
                description:
                    'Plugins PocketMine com permissões seguras para admins Bedrock.'
            },
            {
                title: 'Confiabilidade sólida',
                description:
                    'Releases estáveis para comunidades Minecraft Bedrock em produção.'
            },
            {
                title: 'Manutenção simples',
                description:
                    'Arquitetura limpa e configs legíveis para manutenção PocketMine duradoura.'
            },
            {
                title: 'Desempenho ajustado',
                description:
                    'Lógica otimizada para manter bom tick time em servidores ativos.'
            }
        ],
        de: [
            {
                title: 'Sicherheit zuerst',
                description:
                    'PocketMine-Plugins mit sicheren Standard-Berechtigungen für Bedrock-Admins.'
            },
            {
                title: 'Stabile Zuverlässigkeit',
                description:
                    'Stabile Releases für produktive Minecraft-Bedrock-Communities.'
            },
            {
                title: 'Wartbarer Kern',
                description:
                    'Saubere Architektur und lesbare Konfigurationen für langfristige Pflege.'
            },
            {
                title: 'Performance optimiert',
                description:
                    'Optimierte Logik für niedrige Tickzeiten auf aktiven Bedrock-Servern.'
            }
        ]
    })

    return (
        <section id="features" className="section">
            <div className="container">
                <div className="section-heading">
                    <span>
                        {pickLocaleText(locale, {
                            en: 'Why PocketMine admins choose PMHub',
                            fr: 'Pourquoi les admins PocketMine choisissent PMHub',
                            es: 'Por qué los admins de PocketMine eligen PMHub',
                            'pt-br': 'Por que admins de PocketMine escolhem a PMHub',
                            de: 'Warum PocketMine-Admins PMHub wählen'
                        })}
                    </span>
                    <h2>
                        {pickLocaleText(locale, {
                            en: 'Built for real PocketMine-MP server operations.',
                            fr: 'Conçu pour des opérations PocketMine-MP réelles.',
                            es: 'Diseñado para operaciones reales de PocketMine-MP.',
                            'pt-br': 'Feito para operações reais de servidores PocketMine-MP.',
                            de: 'Entwickelt für echte PocketMine-MP-Server-Operationen.'
                        })}
                    </h2>
                    <p>
                        {pickLocaleText(locale, {
                            en: 'Everything is designed to help Minecraft Bedrock server owners compare free and premium plugins quickly and deploy with confidence.',
                            fr: 'Tout est pensé pour aider les propriétaires de serveurs Minecraft Bedrock à comparer des plugins gratuits et premium rapidement, puis déployer en confiance.',
                            es: 'Todo está diseñado para ayudar a dueños de servidores Minecraft Bedrock a comparar plugins gratis y premium rápido, y desplegar con confianza.',
                            'pt-br':
                                'Tudo foi pensado para ajudar donos de servidores Minecraft Bedrock a comparar plugins gratuitos e premium rapidamente e implantar com confiança.',
                            de: 'Alles ist darauf ausgelegt, Minecraft-Bedrock-Serverbetreibern den schnellen Vergleich kostenloser und Premium-Plugins zu ermöglichen und sicher auszurollen.'
                        })}
                    </p>
                </div>

                <div className="benefit-grid">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="benefit-card">
                            <div className="benefit-icon" aria-hidden="true" />
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
