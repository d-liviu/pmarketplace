import type { Metadata } from 'next'
import { apiFetch } from '../lib/api'
import { getApiBaseUrl } from '../lib/apiBase'
import LicenseKey from '../components/account/LicenseKey'
import LogoutButton from '../components/account/LogoutButton'
import MediaImage from '../components/plugins/MediaImage'
import { type Locale, withLocalePath } from '../lib/i18n'
import { pickLocaleText } from '../lib/localeText'
import { getLocaleAlternates, getRequestLocale } from '../lib/requestLocale'
import styles from './account.module.css'

type License = {
    id: number
    plugin_id: number
    license_key: string
    created_at?: string
    name: string
    slug: string
}

type OrderItem = {
    order_id: number
    plugin_id: number
    price: number | string
    name: string
    slug: string
}

type Order = {
    id: number
    total: number | string
    status: string
    payment_provider?: string | null
    payment_id?: string | null
    created_at?: string
    items?: OrderItem[]
}

type PluginVersion = {
    id: number
    plugin_id: number
    version: string
    changelog?: string
    pocketmine_version?: string | null
    created_at?: string
}

type PluginMedia = {
    id: number
    plugin_id: number
    type: string
    url: string
    position?: number | null
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const canonical = withLocalePath('/account', locale)

    return {
        title: pickLocaleText(locale, {
            en: 'Account | PMHub',
            fr: 'Compte | PMHub',
            es: 'Cuenta | PMHub',
            'pt-br': 'Conta | PMHub',
            de: 'Konto | PMHub'
        }),
        description: pickLocaleText(locale, {
            en: 'Manage your PocketMine plugin licenses and downloads.',
            fr: 'Gérez vos licences et téléchargements de plugins PocketMine.',
            es: 'Gestiona tus licencias y descargas de plugins PocketMine.',
            'pt-br': 'Gerencie suas licenças e downloads de plugins PocketMine.',
            de: 'Verwalte deine PocketMine-Plugin-Lizenzen und Downloads.'
        }),
        robots: {
            index: false,
            follow: false
        },
        alternates: {
            canonical,
            ...getLocaleAlternates('/account')
        }
    }
}

const apiBaseUrl = getApiBaseUrl()
const fallbackImage = '/images/plugin-fallback.svg'

async function getLicenses() {
    const res = await apiFetch('/licenses')
    if (!res.ok) {
        return null
    }

    const data: unknown = await res.json()
    return Array.isArray(data) ? (data as License[]) : null
}

async function getOrders() {
    const res = await apiFetch('/orders')
    if (!res.ok) {
        return null
    }

    const data: unknown = await res.json()
    return Array.isArray(data) ? (data as Order[]) : null
}

async function getPluginVersions(pluginId: number | string) {
    const res = await fetch(`${apiBaseUrl}/plugins/${pluginId}/versions`, {
        cache: 'no-store'
    })

    if (!res.ok) {
        return []
    }

    const data: unknown = await res.json()
    return Array.isArray(data) ? (data as PluginVersion[]) : []
}

async function getPluginMedia(pluginId: number | string) {
    const res = await fetch(`${apiBaseUrl}/plugins/${pluginId}/media`, {
        cache: 'no-store'
    })

    if (!res.ok) {
        return []
    }

    const data: unknown = await res.json()
    return Array.isArray(data) ? (data as PluginMedia[]) : []
}

function formatDate(value: string | undefined, locale: Locale) {
    if (!value) {
        return ''
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
        return ''
    }

    const dateLocale =
        locale === 'fr'
            ? 'fr-FR'
            : locale === 'es'
              ? 'es-ES'
              : locale === 'pt-br'
                ? 'pt-BR'
                : locale === 'de'
                  ? 'de-DE'
                  : locale === 'it'
                    ? 'it-IT'
                    : locale === 'nl'
                      ? 'nl-NL'
                      : locale === 'pl'
                        ? 'pl-PL'
                        : locale === 'ru'
                          ? 'ru-RU'
                  : 'en-US'

    return parsed.toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export default async function AccountPage() {
    const locale = await getRequestLocale()
    const [licenses, orders] = await Promise.all([getLicenses(), getOrders()])
    const licenseList = licenses ?? []

    const uniquePluginIds = Array.from(
        new Set(licenseList.map((license) => license.plugin_id))
    )

    const versionsEntries: Array<[number, PluginVersion[]]> = await Promise.all(
        uniquePluginIds.map(
            async (pluginId): Promise<[number, PluginVersion[]]> => [
                pluginId,
                await getPluginVersions(pluginId)
            ]
        )
    )
    const mediaEntries: Array<[number, PluginMedia[]]> = await Promise.all(
        uniquePluginIds.map(
            async (pluginId): Promise<[number, PluginMedia[]]> => [
                pluginId,
                await getPluginMedia(pluginId)
            ]
        )
    )

    const versionMap = new Map<number, PluginVersion[]>(versionsEntries)
    const mediaMap = new Map<number, PluginMedia[]>(mediaEntries)

    return (
        <>
            <section className="page-hero">
                <div className="container">
                    <div className={styles.heroRow}>
                        <div className={styles.heroContent}>
                            <span className="hero-badge">
                                {pickLocaleText(locale, {
                                    en: 'Account',
                                    fr: 'Compte',
                                    es: 'Cuenta',
                                    'pt-br': 'Conta',
                                    de: 'Konto'
                                })}
                            </span>
                            <h1 className="page-title">
                                {pickLocaleText(locale, {
                                    en: 'Your profile',
                                    fr: 'Votre profil',
                                    es: 'Tu perfil',
                                    'pt-br': 'Seu perfil',
                                    de: 'Dein Profil'
                                })}
                            </h1>
                            <p className="page-subtitle">
                                {pickLocaleText(locale, {
                                    en: 'Track orders, licenses, downloads, and changelogs.',
                                    fr: 'Suivez commandes, licences, téléchargements et changelogs.',
                                    es: 'Sigue pedidos, licencias, descargas y changelogs.',
                                    'pt-br':
                                        'Acompanhe pedidos, licenças, downloads e changelogs.',
                                    de: 'Verfolge Bestellungen, Lizenzen, Downloads und Changelogs.'
                                })}
                            </p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.page}`}>
                    <div className={`card ${styles.sectionCard}`}>
                        <div className={styles.cardHeader}>
                            <h2>
                                {pickLocaleText(locale, {
                                    en: 'Plugins owned',
                                    fr: 'Plugins possédés',
                                    es: 'Plugins comprados',
                                    'pt-br': 'Plugins adquiridos',
                                    de: 'Besessene Plugins'
                                })}
                            </h2>
                            <p className="helper-text">
                                {pickLocaleText(locale, {
                                    en: 'Download any version that belongs to your license.',
                                    fr: 'Téléchargez toute version incluse dans votre licence.',
                                    es: 'Descarga cualquier versión incluida en tu licencia.',
                                    'pt-br':
                                        'Baixe qualquer versão incluída na sua licença.',
                                    de: 'Lade jede Version herunter, die in deiner Lizenz enthalten ist.'
                                })}
                            </p>
                        </div>
                        {!licenses ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'Sign in to view your plugins.',
                                    fr: 'Connectez-vous pour voir vos plugins.',
                                    es: 'Inicia sesión para ver tus plugins.',
                                    'pt-br': 'Entre para ver seus plugins.',
                                    de: 'Melde dich an, um deine Plugins zu sehen.'
                                })}
                            </p>
                        ) : licenseList.length === 0 ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'You do not own any plugins yet.',
                                    fr: 'Vous ne possédez encore aucun plugin.',
                                    es: 'Aún no tienes ningún plugin.',
                                    'pt-br': 'Você ainda não possui nenhum plugin.',
                                    de: 'Du besitzt noch keine Plugins.'
                                })}
                            </p>
                        ) : (
                            <div className={styles.ownedGrid}>
                                {licenseList.map((license) => {
                                    const versions = versionMap.get(license.plugin_id) || []
                                    const media = mediaMap.get(license.plugin_id) || []
                                    const imageUrl = media.find((item) => item.type === 'image')
                                        ?.url

                                    return (
                                        <div key={license.id} className={styles.ownedCard}>
                                            <div className={styles.ownedMedia}>
                                                <MediaImage
                                                    src={imageUrl || fallbackImage}
                                                    fallbackSrc={fallbackImage}
                                                    alt={license.name}
                                                    className={`media-image ${styles.ownedImage}`}
                                                />
                                            </div>
                                            <div className={styles.ownedContent}>
                                                <div className={styles.ownedHeader}>
                                                    <div>
                                                        <strong>{license.name}</strong>
                                                        <span className="helper-text">
                                                            {pickLocaleText(locale, {
                                                                en: 'License active',
                                                                fr: 'Licence active',
                                                                es: 'Licencia activa',
                                                                'pt-br': 'Licença ativa',
                                                                de: 'Lizenz aktiv'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <a
                                                        className="btn-secondary btn-small"
                                                        href={withLocalePath(
                                                            `/plugins/${license.slug}`,
                                                            locale
                                                        )}
                                                    >
                                                        {pickLocaleText(locale, {
                                                            en: 'View plugin',
                                                            fr: 'Voir le plugin',
                                                            es: 'Ver plugin',
                                                            'pt-br': 'Ver plugin',
                                                            de: 'Plugin ansehen'
                                                        })}
                                                    </a>
                                                </div>
                                                <details className={styles.versions} open>
                                                    <summary>
                                                        {pickLocaleText(locale, {
                                                            en: `Releases (${versions.length})`,
                                                            fr: `Versions (${versions.length})`,
                                                            es: `Versiones (${versions.length})`,
                                                            'pt-br': `Versões (${versions.length})`,
                                                            de: `Versionen (${versions.length})`
                                                        })}
                                                    </summary>
                                                    <div className={styles.versionList}>
                                                        {versions.length === 0 ? (
                                                            <span className="helper-text">
                                                                {pickLocaleText(locale, {
                                                                    en: 'No releases yet.',
                                                                    fr: 'Aucune version pour le moment.',
                                                                    es: 'Aún no hay versiones.',
                                                                    'pt-br': 'Ainda não há versões.',
                                                                    de: 'Noch keine Versionen.'
                                                                })}
                                                            </span>
                                                        ) : (
                                                            versions.map((version) => (
                                                                <div
                                                                    key={version.id}
                                                                    className={styles.versionRow}
                                                                >
                                                                    <div>
                                                                        <strong>{version.version}</strong>
                                                                        <span className="helper-text">
                                                                            {version.pocketmine_version
                                                                                ? `PocketMine ${version.pocketmine_version}`
                                                                                : pickLocaleText(locale, {
                                                                                      en: 'PocketMine release',
                                                                                      fr: 'Version PocketMine',
                                                                                      es: 'Versión PocketMine',
                                                                                      'pt-br':
                                                                                          'Versão do PocketMine',
                                                                                      de: 'PocketMine-Version'
                                                                                  })}
                                                                        </span>
                                                                    </div>
                                                                    <a
                                                                        href={`${apiBaseUrl}/download/${license.plugin_id}?versionId=${version.id}`}
                                                                        className="btn-primary btn-small"
                                                                    >
                                                                        {pickLocaleText(locale, {
                                                                            en: 'Download',
                                                                            fr: 'Télécharger',
                                                                            es: 'Descargar',
                                                                            'pt-br': 'Baixar',
                                                                            de: 'Herunterladen'
                                                                        })}
                                                                    </a>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </details>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className={`card ${styles.sectionCard}`}>
                        <div className={styles.cardHeader}>
                            <h2>
                                {pickLocaleText(locale, {
                                    en: 'Orders',
                                    fr: 'Commandes',
                                    es: 'Pedidos',
                                    'pt-br': 'Pedidos',
                                    de: 'Bestellungen'
                                })}
                            </h2>
                            <p className="helper-text">
                                {pickLocaleText(locale, {
                                    en: 'Download a PDF proof for accounting or support.',
                                    fr: 'Téléchargez un justificatif PDF pour la comptabilité ou le support.',
                                    es: 'Descarga un comprobante PDF para contabilidad o soporte.',
                                    'pt-br':
                                        'Baixe um comprovante em PDF para contabilidade ou suporte.',
                                    de: 'Lade einen PDF-Beleg für Buchhaltung oder Support herunter.'
                                })}
                            </p>
                        </div>
                        {!orders ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'Sign in to view your orders.',
                                    fr: 'Connectez-vous pour voir vos commandes.',
                                    es: 'Inicia sesión para ver tus pedidos.',
                                    'pt-br': 'Entre para ver seus pedidos.',
                                    de: 'Melde dich an, um deine Bestellungen zu sehen.'
                                })}
                            </p>
                        ) : orders.length === 0 ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'No orders yet.',
                                    fr: 'Aucune commande pour le moment.',
                                    es: 'Aún no hay pedidos.',
                                    'pt-br': 'Ainda não há pedidos.',
                                    de: 'Noch keine Bestellungen.'
                                })}
                            </p>
                        ) : (
                            <div className={styles.list}>
                                {orders.map((order) => (
                                    <div key={order.id} className={styles.orderCard}>
                                        <div className="order-header">
                                            <strong>
                                                {pickLocaleText(locale, {
                                                    en: `Order #${order.id}`,
                                                    fr: `Commande #${order.id}`,
                                                    es: `Pedido #${order.id}`,
                                                    'pt-br': `Pedido #${order.id}`,
                                                    de: `Bestellung #${order.id}`
                                                })}
                                            </strong>
                                            <span className="status-pill">
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className={styles.orderMeta}>
                                            <span>
                                                {pickLocaleText(locale, {
                                                    en: 'Total',
                                                    fr: 'Total',
                                                    es: 'Total',
                                                    'pt-br': 'Total',
                                                    de: 'Gesamt'
                                                })}
                                                :{' '}
                                                ${Number(order.total).toFixed(2)}
                                            </span>
                                            <span>{formatDate(order.created_at, locale)}</span>
                                        </div>
                                        <a
                                            href={`${apiBaseUrl}/orders/${order.id}/receipt`}
                                            className="btn-secondary btn-small"
                                        >
                                            {pickLocaleText(locale, {
                                                en: 'Download PDF',
                                                fr: 'Télécharger le PDF',
                                                es: 'Descargar PDF',
                                                'pt-br': 'Baixar PDF',
                                                de: 'PDF herunterladen'
                                            })}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={`card ${styles.sectionCard}`}>
                        <div className={styles.cardHeader}>
                            <h2>
                                {pickLocaleText(locale, {
                                    en: 'Licenses',
                                    fr: 'Licences',
                                    es: 'Licencias',
                                    'pt-br': 'Licenças',
                                    de: 'Lizenzen'
                                })}
                            </h2>
                            <p className="helper-text">
                                {pickLocaleText(locale, {
                                    en: 'Each license proves you own the plugin and unlocks downloads.',
                                    fr: 'Chaque licence prouve la propriété du plugin et débloque les téléchargements.',
                                    es: 'Cada licencia demuestra la propiedad del plugin y desbloquea descargas.',
                                    'pt-br':
                                        'Cada licença comprova a propriedade do plugin e libera downloads.',
                                    de: 'Jede Lizenz bestätigt deinen Besitz des Plugins und schaltet Downloads frei.'
                                })}
                            </p>
                        </div>
                        {!licenses ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'Sign in to view your licenses.',
                                    fr: 'Connectez-vous pour voir vos licences.',
                                    es: 'Inicia sesión para ver tus licencias.',
                                    'pt-br': 'Entre para ver suas licenças.',
                                    de: 'Melde dich an, um deine Lizenzen zu sehen.'
                                })}
                            </p>
                        ) : licenseList.length === 0 ? (
                            <p>
                                {pickLocaleText(locale, {
                                    en: 'No licenses yet.',
                                    fr: 'Aucune licence pour le moment.',
                                    es: 'Aún no hay licencias.',
                                    'pt-br': 'Ainda não há licenças.',
                                    de: 'Noch keine Lizenzen.'
                                })}
                            </p>
                        ) : (
                            <div className={styles.list}>
                                {licenseList.map((license) => (
                                    <div key={license.id} className={styles.licenseCard}>
                                        <div className="license-header">
                                            <strong>{license.name}</strong>
                                            <span className="helper-text">
                                                {pickLocaleText(locale, {
                                                    en: 'Issued',
                                                    fr: 'Émise le',
                                                    es: 'Emitida el',
                                                    'pt-br': 'Emitida em',
                                                    de: 'Ausgestellt am'
                                                })}{' '}
                                                {formatDate(license.created_at, locale)}
                                            </span>
                                        </div>
                                        <LicenseKey value={license.license_key} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
