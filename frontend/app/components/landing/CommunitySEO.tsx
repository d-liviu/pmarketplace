import { type Locale } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

export default function CommunitySEO({ locale = 'en' }: { locale?: Locale }) {
    return (
        <section className="section section-soft">
            <div className="container">
                <div className="section-heading">
                    <span>
                        {pickLocaleText(locale, {
                            en: 'Marketplace community focus',
                            fr: 'Focus communauté PocketMine',
                            es: 'Enfoque en la comunidad PocketMine',
                            'pt-br': 'Foco na comunidade PocketMine',
                            de: 'Fokus auf die PocketMine-Community'
                        })}
                    </span>
                    <h2>
                        {pickLocaleText(locale, {
                            en: 'A PocketMine marketplace for creators and buyers.',
                            fr: 'Des plugins PocketMine pensés pour les serveurs Minecraft Bedrock.',
                            es: 'Plugins PocketMine creados para servidores Minecraft Bedrock.',
                            'pt-br':
                                'Plugins PocketMine feitos para servidores Minecraft Bedrock.',
                            de: 'PocketMine-Plugins für Minecraft-Bedrock-Server.'
                        })}
                    </h2>
                    <p>
                        {pickLocaleText(locale, {
                            en: 'PMarketplace helps creators sell confidently and helps buyers find reliable plugins for real Bedrock production servers.',
                            fr: 'PMarketplace aide les propriétaires de serveurs à comparer des plugins PocketMine gratuits et premium, choisir plus vite, et gérer des communautés Bedrock plus stables.',
                            es: 'PMarketplace ayuda a dueños de servidores a comparar plugins PocketMine gratis y premium, elegir más rápido y mantener comunidades Bedrock más estables.',
                            'pt-br':
                                'PMarketplace ajuda donos de servidores a comparar plugins PocketMine gratuitos e premium, escolher mais rápido e manter comunidades Bedrock mais estáveis.',
                            de: 'PMarketplace hilft Serverbetreibern, kostenlose und Premium-PocketMine-Plugins zu vergleichen, schneller zu wählen und stabilere Bedrock-Communities zu betreiben.'
                        })}
                    </p>
                </div>

                <div className="detail-grid">
                    <div className="card">
                        <h3>
                            {pickLocaleText(locale, {
                                en: 'For buyers',
                                fr: 'Plugins PocketMine gratuits',
                                es: 'Plugins PocketMine gratis',
                                'pt-br': 'Plugins PocketMine gratuitos',
                                de: 'Kostenlose PocketMine-Plugins'
                            })}
                        </h3>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Explore free and paid listings, compare features quickly, and purchase directly from independent creators.',
                                fr: 'Commencez avec des plugins gratuits pour lancer votre stack PocketMine-MP, tester des idées gameplay et améliorer la base de votre serveur Bedrock.',
                                es: 'Empieza con plugins gratis para lanzar tu stack PocketMine-MP, probar ideas de gameplay y mejorar la base de tu servidor Bedrock.',
                                'pt-br':
                                    'Comece com plugins gratuitos para lançar sua stack PocketMine-MP, testar ideias de gameplay e melhorar a base do seu servidor Bedrock.',
                                de: 'Starte mit kostenlosen Plugins, teste Gameplay-Ideen und verbessere die Basis deines Minecraft-Bedrock-Servers.'
                            })}
                        </p>
                    </div>
                    <div className="card">
                        <h3>
                            {pickLocaleText(locale, {
                                en: 'For creators',
                                fr: 'Plugins PocketMine premium',
                                es: 'Plugins PocketMine premium',
                                'pt-br': 'Plugins PocketMine premium',
                                de: 'Premium-PocketMine-Plugins'
                            })}
                        </h3>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'List your plugin, publish updates, and grow revenue from a global audience of PocketMine server owners.',
                                fr: 'Passez à des plugins payants quand vous avez besoin de fonctions avancées, d’un support durable et d’une fiabilité prête pour la prod.',
                                es: 'Escala con plugins de pago cuando necesites funciones avanzadas, soporte duradero y fiabilidad para producción.',
                                'pt-br':
                                    'Escale com plugins pagos quando precisar de recursos avançados, suporte de longo prazo e confiabilidade para produção.',
                                de: 'Skaliere mit kostenpflichtigen Plugins, wenn du erweiterte Funktionen, langfristigen Support und produktionsreife Stabilität brauchst.'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
