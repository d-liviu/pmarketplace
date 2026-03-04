import Image from 'next/image'
import Link from 'next/link'
import { type Locale, withLocalePath } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

export default function FeaturedPlugins({ locale = 'en' }: { locale?: Locale }) {
    const categories = pickLocaleText(locale, {
        en: [
            {
                title: 'Economy Systems',
                description:
                    'Shops, currencies, jobs, and trading plugins for long-term server progression.',
                image: '/images/category-economy.svg',
                href: '/plugins?tag=economy'
            },
            {
                title: 'Factions & PvP',
                description:
                    'Land claims, alliances, and war-focused plugins for competitive communities.',
                image: '/images/category-factions.svg',
                href: '/plugins?tag=factions'
            },
            {
                title: 'Utilities & Tools',
                description:
                    'Moderation helpers, performance tools, and admin-quality automation plugins.',
                image: '/images/category-utilities.svg',
                href: '/plugins?tag=utilities'
            }
        ],
        fr: [
            {
                title: 'Systèmes économie',
                description: 'Plugins de boutique, monnaie et trading pour votre progression.',
                image: '/images/category-economy.svg',
                href: '/plugins?tag=economy'
            },
            {
                title: 'Factions & PvP',
                description:
                    'Claims, alliances et plugins orientés combat pour serveurs compétitifs.',
                image: '/images/category-factions.svg',
                href: '/plugins?tag=factions'
            },
            {
                title: 'Utilitaires',
                description:
                    'Outils de modération, performances et automatisation pour admins.',
                image: '/images/category-utilities.svg',
                href: '/plugins?tag=utilities'
            }
        ],
        es: [
            {
                title: 'Sistemas de economía',
                description: 'Plugins de tiendas, monedas y comercio para progresión del servidor.',
                image: '/images/category-economy.svg',
                href: '/plugins?tag=economy'
            },
            {
                title: 'Facciones y PvP',
                description:
                    'Claims, alianzas y plugins de guerra para comunidades competitivas.',
                image: '/images/category-factions.svg',
                href: '/plugins?tag=factions'
            },
            {
                title: 'Utilidades y herramientas',
                description:
                    'Moderación, rendimiento y automatizaciones para administradores.',
                image: '/images/category-utilities.svg',
                href: '/plugins?tag=utilities'
            }
        ],
        'pt-br': [
            {
                title: 'Sistemas de economia',
                description:
                    'Lojas, moedas e plugins de comércio para progressão no servidor.',
                image: '/images/category-economy.svg',
                href: '/plugins?tag=economy'
            },
            {
                title: 'Facções e PvP',
                description:
                    'Claims, alianças e plugins de guerra para comunidades competitivas.',
                image: '/images/category-factions.svg',
                href: '/plugins?tag=factions'
            },
            {
                title: 'Utilitários e ferramentas',
                description:
                    'Moderação, performance e automações para administradores.',
                image: '/images/category-utilities.svg',
                href: '/plugins?tag=utilities'
            }
        ],
        de: [
            {
                title: 'Wirtschaftssysteme',
                description:
                    'Shop-, Währungs- und Handels-Plugins für langfristige Server-Progression.',
                image: '/images/category-economy.svg',
                href: '/plugins?tag=economy'
            },
            {
                title: 'Fraktionen & PvP',
                description:
                    'Claims, Allianzen und Kriegs-Plugins für kompetitive Communities.',
                image: '/images/category-factions.svg',
                href: '/plugins?tag=factions'
            },
            {
                title: 'Utilities & Tools',
                description:
                    'Moderations-, Performance- und Automatisierungs-Plugins für Admins.',
                image: '/images/category-utilities.svg',
                href: '/plugins?tag=utilities'
            }
        ]
    })

    return (
        <section className="section section-soft">
            <div className="container">
                <div className="section-heading">
                    <span>
                        {pickLocaleText(locale, {
                            en: 'Browse Categories',
                            fr: 'Parcourir les catégories',
                            es: 'Explorar categorías',
                            'pt-br': 'Explorar categorias',
                            de: 'Kategorien durchsuchen'
                        })}
                    </span>
                    <h2>
                        {pickLocaleText(locale, {
                            en: 'Start with the plugin type you need.',
                            fr: 'Commencez par le type de plugin dont vous avez besoin.',
                            es: 'Empieza por el tipo de plugin que necesitas.',
                            'pt-br': 'Comece pelo tipo de plugin que você precisa.',
                            de: 'Starte mit dem Plugin-Typ, den du brauchst.'
                        })}
                    </h2>
                    <p>
                        {pickLocaleText(locale, {
                            en: 'Instead of spotlighting single products, explore the marketplace by use case and server goal.',
                            fr: 'Au lieu de mettre un seul produit en avant, parcourez la marketplace par besoin et objectif serveur.',
                            es: 'En lugar de destacar un único producto, explora el marketplace por caso de uso y objetivo del servidor.',
                            'pt-br':
                                'Em vez de destacar um único produto, explore o marketplace por caso de uso e objetivo do servidor.',
                            de: 'Statt einzelne Produkte hervorzuheben, entdecke den Marktplatz nach Einsatzzweck und Server-Ziel.'
                        })}
                    </p>
                </div>
                <div className="category-grid">
                    {categories.map((category) => (
                        <article key={category.title} className="category-card">
                            <Image
                                src={category.image}
                                alt={category.title}
                                width={360}
                                height={200}
                                className="category-media"
                            />
                            <h3>{category.title}</h3>
                            <p>{category.description}</p>
                            <Link
                                href={withLocalePath(category.href, locale)}
                                className="btn-secondary btn-small"
                            >
                                {pickLocaleText(locale, {
                                    en: 'Browse category',
                                    fr: 'Voir la catégorie',
                                    es: 'Ver categoría',
                                    'pt-br': 'Ver categoria',
                                    de: 'Kategorie ansehen'
                                })}
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
