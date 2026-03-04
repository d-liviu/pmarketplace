'use client'

import { usePathname } from 'next/navigation'
import { type Locale, getLocaleFromPathname } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'

type Version = {
    id: string | number
    version: string
    changelog?: string
    pocketmine_version?: string
    created_at?: string
}

type VersionAccordionProps = {
    versions: Version[]
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

export default function VersionAccordion({ versions }: VersionAccordionProps) {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)

    if (!versions.length) {
        return (
            <p>
                {pickLocaleText(locale, {
                    en: 'No versions available yet.',
                    fr: 'Aucune version disponible pour le moment.',
                    es: 'Aún no hay versiones disponibles.',
                    'pt-br': 'Nenhuma versão disponível no momento.',
                    de: 'Noch keine Versionen verfügbar.'
                })}
            </p>
        )
    }

    return (
        <div className="accordion">
            {versions.map((version, index) => {
                const dateLabel = formatDate(version.created_at, locale)
                const lines = (version.changelog || '')
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)

                return (
                    <details key={version.id} open={index === 0}>
                        <summary>
                            <span>
                                {version.version}{' '}
                                {version.pocketmine_version
                                    ? `• PocketMine ${version.pocketmine_version}`
                                    : ''}
                            </span>
                            <span className="chip">
                                {index === 0
                                    ? pickLocaleText(locale, {
                                          en: 'Latest',
                                          fr: 'Dernière',
                                          es: 'Última',
                                          'pt-br': 'Última',
                                          de: 'Neueste'
                                      })
                                    : pickLocaleText(locale, {
                                          en: 'Past',
                                          fr: 'Ancienne',
                                          es: 'Anterior',
                                          'pt-br': 'Anterior',
                                          de: 'Älter'
                                      })}
                            </span>
                        </summary>
                        {dateLabel && <div className="accordion-meta">{dateLabel}</div>}
                        <div className="accordion-body">
                            {lines.length > 1 ? (
                                <ul className="changelog-list">
                                    {lines.map((line, lineIndex) => (
                                        <li key={`${version.id}-${lineIndex}`}>{line}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>
                                    {lines[0] ||
                                        pickLocaleText(locale, {
                                            en: 'No changelog provided.',
                                            fr: 'Aucun changelog fourni.',
                                            es: 'No se proporcionó changelog.',
                                            'pt-br': 'Nenhum changelog fornecido.',
                                            de: 'Kein Changelog vorhanden.'
                                        })}
                                </p>
                            )}
                        </div>
                    </details>
                )
            })}
        </div>
    )
}
