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
                                en: 'Ready to launch',
                                fr: 'Prêt à lancer',
                                es: 'Listo para lanzar',
                                'pt-br': 'Pronto para lançar',
                                de: 'Bereit zum Start'
                            })}
                        </span>
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'Upgrade your PocketMine server with the right plugins.',
                                fr: 'Faites évoluer votre serveur PocketMine avec les bons plugins.',
                                es: 'Haz crecer tu servidor PocketMine con los plugins correctos.',
                                'pt-br':
                                    'Escale seu servidor PocketMine com os plugins certos.',
                                de: 'Bringe deinen PocketMine-Server mit den richtigen Plugins voran.'
                            })}
                        </h2>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'Compare free and premium PocketMine plugins, check pricing instantly, and deploy to your Minecraft Bedrock server faster.',
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
                                en: 'Start shopping',
                                fr: 'Commencer',
                                es: 'Comenzar',
                                'pt-br': 'Começar',
                                de: 'Jetzt starten'
                            })}
                        </Link>
                        <Link
                            href={withLocalePath('/cart', locale)}
                            className="btn-secondary"
                        >
                            {pickLocaleText(locale, {
                                en: 'View cart',
                                fr: 'Voir le panier',
                                es: 'Ver carrito',
                                'pt-br': 'Ver carrinho',
                                de: 'Warenkorb ansehen'
                            })}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
