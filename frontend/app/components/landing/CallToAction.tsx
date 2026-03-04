import Link from 'next/link'
import { type Locale, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

export default function CallToAction({ locale = 'en' }: { locale?: Locale }) {
    return (
        <section className="section">
            <div className="container">
                <div className="cta">
                    <div>
                        <span className="cta-eyebrow">
                            {pickLocaleText(locale, {
                                en: 'Ready to list or buy',
                                fr: 'Prêt à lancer',
                                es: 'Listo para lanzar',
                                'pt-br': 'Pronto para lançar',
                                de: 'Bereit zum Start'
                            })}
                        </span>
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'Join the PocketMine creator marketplace.',
                                fr: 'Faites évoluer votre serveur PocketMine avec les bons plugins.',
                                es: 'Haz crecer tu servidor PocketMine con los plugins correctos.',
                                'pt-br':
                                    'Escale seu servidor PocketMine com os plugins certos.',
                                de: 'Bringe deinen PocketMine-Server mit den richtigen Plugins voran.'
                            })}
                        </h2>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Buy reliable plugins from independent developers, or publish your own plugin listing and start selling today.',
                                fr: 'Comparez des plugins PocketMine gratuits et premium, vérifiez les prix instantanément, et déployez plus vite sur votre serveur Minecraft Bedrock.',
                                es: 'Compara plugins PocketMine gratis y premium, revisa precios al instante y despliega más rápido en tu servidor Minecraft Bedrock.',
                                'pt-br':
                                    'Compare plugins PocketMine gratuitos e premium, veja preços na hora e faça deploy mais rápido no seu servidor Minecraft Bedrock.',
                                de: 'Vergleiche kostenlose und Premium-PocketMine-Plugins, prüfe Preise sofort und deploye schneller auf deinem Minecraft-Bedrock-Server.'
                            })}
                        </p>
                    </div>
                    <div className="cta-actions">
                        <Link
                            href={withLocalePath('/plugins', locale)}
                            className="btn-primary"
                        >
                            {pickLocaleText(locale, {
                                en: 'Browse marketplace',
                                fr: 'Commencer',
                                es: 'Comenzar',
                                'pt-br': 'Começar',
                                de: 'Jetzt starten'
                            })}
                        </Link>
                        <Link
                            href={withLocalePath('/account', locale)}
                            className="btn-secondary"
                        >
                            {pickLocaleText(locale, {
                                en: 'Sell your plugin',
                                fr: 'Vendre votre plugin',
                                es: 'Vender tu plugin',
                                'pt-br': 'Vender seu plugin',
                                de: 'Plugin verkaufen'
                            })}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
