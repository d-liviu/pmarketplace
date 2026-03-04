import type { Metadata } from 'next'
import MediaImage from '../components/plugins/MediaImage'
import { withLocalePath } from '../lib/i18n'
import { pickLocaleText } from '../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../lib/requestLocale'

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const canonical = withLocalePath('/contact', locale)

    return {
        title: pickLocaleText(locale, {
            en: 'Contact | PMarketplace',
            fr: 'Contact | PMarketplace',
            es: 'Contacto | PMarketplace',
            'pt-br': 'Contato | PMarketplace',
            de: 'Kontakt | PMarketplace'
        }),
        description: pickLocaleText(locale, {
            en: 'Contact PMarketplace for seller onboarding, listing questions, billing issues, or purchase support.',
            fr: 'Contactez PMarketplace pour vos questions sur les plugins PocketMine-MP, des recommandations gratuites/premium, et du support serveur Minecraft Bedrock.',
            es: 'Contacta con PMarketplace para dudas sobre plugins PocketMine-MP, recomendaciones gratis y premium, y soporte para servidores Minecraft Bedrock.',
            'pt-br':
                'Fale com a PMarketplace para dúvidas sobre plugins PocketMine-MP, recomendações gratuitas e premium, e suporte para servidores Minecraft Bedrock.',
            de: 'Kontaktiere PMarketplace bei Fragen zu PocketMine-MP-Plugins, kostenlosen und Premium-Empfehlungen sowie Support für Minecraft-Bedrock-Server.'
        }),
        keywords: [
            'PocketMine marketplace support',
            'PocketMine-MP contact',
            'sell PocketMine plugins',
            'Minecraft Bedrock plugin marketplace'
        ],
        alternates: {
            canonical,
            ...getLocaleAlternates('/contact')
        }
    }
}

export default async function ContactPage() {
    const locale = await getRequestLocale()

    return (
        <>
            <section className="page-hero">
                <div className="container">
                    <span className="hero-badge">Contact</span>
                    <h1 className="page-title">
                        {pickLocaleText(locale, {
                            en: 'Need help buying or selling plugins?',
                            fr: 'Construisons votre prochain plugin.',
                            es: 'Construyamos tu próximo plugin.',
                            'pt-br': 'Vamos criar seu próximo plugin.',
                            de: 'Lass uns dein nächstes Plugin bauen.'
                        })}
                    </h1>
                    <p className="page-subtitle">
                        {pickLocaleText(locale, {
                            en: 'Get fast support for marketplace accounts, plugin listings, payouts, and purchases.',
                            fr: 'Questions courtes, réponses rapides, et un plan clair de livraison pour votre serveur PocketMine-MP Minecraft Bedrock.',
                            es: 'Preguntas cortas, respuestas rápidas y un plan claro para tu servidor PocketMine-MP Minecraft Bedrock.',
                            'pt-br':
                                'Perguntas curtas, respostas rápidas e um plano claro para o seu servidor PocketMine-MP Minecraft Bedrock.',
                            de: 'Kurze Fragen, schnelle Antworten und ein klarer Lieferplan für deinen PocketMine-MP-Minecraft-Bedrock-Server.'
                        })}
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container contact-grid">
                    <div className="card contact-card">
                        <h2>
                            {pickLocaleText(locale, {
                                en: 'PMarketplace support',
                                fr: 'Support PMarketplace',
                                es: 'Soporte PMarketplace',
                                'pt-br': 'Suporte PMarketplace',
                                de: 'PMarketplace-Support'
                            })}
                        </h2>
                        <p>
                            {pickLocaleText(locale, {
                                en: 'We help creators publish listings and help buyers with orders, licenses, and marketplace account issues.',
                                fr: 'Nous aidons les propriétaires de serveurs PocketMine à choisir les bons plugins gratuits/premium, ou à livrer du sur-mesure rapidement.',
                                es: 'Ayudamos a dueños de servidores PocketMine a elegir plugins gratis o premium correctos, o a entregar desarrollos personalizados rápido.',
                                'pt-br':
                                    'Ajudamos donos de servidores PocketMine a escolher plugins gratuitos ou premium ideais, ou entregar soluções personalizadas rapidamente.',
                                de: 'Wir helfen PocketMine-Serverbetreibern, die richtigen kostenlosen oder Premium-Plugins auszuwählen oder individuelle Lösungen schnell zu liefern.'
                            })}
                        </p>
                        <div className="contact-points">
                            <div className="mini-card">
                                <h4>
                                    {pickLocaleText(locale, {
                                        en: 'Response time',
                                        fr: 'Délai de réponse',
                                        es: 'Tiempo de respuesta',
                                        'pt-br': 'Tempo de resposta',
                                        de: 'Antwortzeit'
                                    })}
                                </h4>
                                <p>
                                    {pickLocaleText(locale, {
                                        en: 'Usually within 24 hours.',
                                        fr: 'Généralement sous 24 heures.',
                                        es: 'Normalmente en menos de 24 horas.',
                                        'pt-br': 'Normalmente em até 24 horas.',
                                        de: 'In der Regel innerhalb von 24 Stunden.'
                                    })}
                                </p>
                            </div>
                            <div className="mini-card">
                                <h4>
                                    {pickLocaleText(locale, {
                                        en: 'Best for',
                                        fr: 'Idéal pour',
                                        es: 'Ideal para',
                                        'pt-br': 'Ideal para',
                                        de: 'Ideal für'
                                    })}
                                </h4>
                                <p>
                                    {pickLocaleText(locale, {
                                        en: 'Seller onboarding, billing, and listing help.',
                                        fr: 'Sécurité, fiabilité, maintenance.',
                                        es: 'Seguridad, fiabilidad y mantenimiento.',
                                        'pt-br': 'Segurança, confiabilidade e manutenção.',
                                        de: 'Sicherheit, Zuverlässigkeit, Wartung.'
                                    })}
                                </p>
                            </div>
                        </div>
                        <MediaImage
                            src="/hero.jpeg"
                            fallbackSrc="/images/plugin-fallback.svg"
                            alt={pickLocaleText(locale, {
                                en: 'PMarketplace support',
                                fr: 'Support PMarketplace',
                                es: 'Soporte PMarketplace',
                                'pt-br': 'Suporte PMarketplace',
                                de: 'PMarketplace-Support'
                            })}
                            className="media-image"
                        />
                    </div>

                    <div
                        className="card form-grid"
                        aria-label={pickLocaleText(locale, {
                            en: 'Contact form',
                            fr: 'Formulaire de contact',
                            es: 'Formulario de contacto',
                            'pt-br': 'Formulário de contato',
                            de: 'Kontaktformular'
                        })}
                    >
                        <div className="field">
                            <label htmlFor="name">
                                {pickLocaleText(locale, {
                                    en: 'Name',
                                    fr: 'Nom',
                                    es: 'Nombre',
                                    'pt-br': 'Nome',
                                    de: 'Name'
                                })}
                            </label>
                            <input
                                id="name"
                                name="name"
                                placeholder={pickLocaleText(locale, {
                                    en: 'Your name',
                                    fr: 'Votre nom',
                                    es: 'Tu nombre',
                                    'pt-br': 'Seu nome',
                                    de: 'Dein Name'
                                })}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@email.com"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="topic">
                                {pickLocaleText(locale, {
                                    en: 'Topic',
                                    fr: 'Sujet',
                                    es: 'Tema',
                                    'pt-br': 'Assunto',
                                    de: 'Thema'
                                })}
                            </label>
                            <select id="topic" name="topic" defaultValue="general">
                                <option value="general">
                                    {pickLocaleText(locale, {
                                        en: 'General question',
                                        fr: 'Question générale',
                                        es: 'Pregunta general',
                                        'pt-br': 'Pergunta geral',
                                        de: 'Allgemeine Frage'
                                    })}
                                </option>
                                <option value="plugins">
                                    {pickLocaleText(locale, {
                                        en: 'Buying plugins',
                                        fr: 'Catalogue de plugins',
                                        es: 'Catálogo de plugins',
                                        'pt-br': 'Catálogo de plugins',
                                        de: 'Plugin-Katalog'
                                    })}
                                </option>
                                <option value="seller">
                                    {pickLocaleText(locale, {
                                        en: 'Seller onboarding',
                                        fr: 'Développement sur mesure',
                                        es: 'Desarrollo a medida',
                                        'pt-br': 'Desenvolvimento sob medida',
                                        de: 'Individuelle Entwicklung'
                                    })}
                                </option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="message">
                                {pickLocaleText(locale, {
                                    en: 'Message',
                                    fr: 'Message',
                                    es: 'Mensaje',
                                    'pt-br': 'Mensagem',
                                    de: 'Nachricht'
                                })}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder={
                                    pickLocaleText(locale, {
                                        en: 'Tell us what you are trying to buy, sell, or publish.',
                                        fr: 'Parlez-nous de votre serveur et de vos objectifs.',
                                        es: 'Cuéntanos sobre tu servidor y tus objetivos.',
                                        'pt-br':
                                            'Conte para nós sobre seu servidor e seus objetivos.',
                                        de: 'Erzähl uns von deinem Server und deinen Zielen.'
                                    })
                                }
                            />
                        </div>
                        <div className="form-actions">
                            <button className="btn-primary" type="button">
                                {pickLocaleText(locale, {
                                    en: 'Send message',
                                    fr: 'Envoyer le message',
                                    es: 'Enviar mensaje',
                                    'pt-br': 'Enviar mensagem',
                                    de: 'Nachricht senden'
                                })}
                            </button>
                            <button className="btn-secondary" type="button">
                                {pickLocaleText(locale, {
                                    en: 'View seller guide',
                                    fr: 'Télécharger le catalogue',
                                    es: 'Descargar catálogo',
                                    'pt-br': 'Baixar catálogo',
                                    de: 'Katalog herunterladen'
                                })}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
