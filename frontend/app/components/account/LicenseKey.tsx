'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname } from '../../lib/i18n'
import { pickLocaleText } from '../../lib/localeText'
import styles from './LicenseKey.module.css'

type LicenseKeyProps = {
    value: string
}

export default function LicenseKey({ value }: LicenseKeyProps) {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const [revealed, setRevealed] = useState(false)

    return (
        <div className={styles.wrapper} data-revealed={revealed ? 'true' : 'false'}>
            <code className={`${styles.text} ${!revealed ? styles.blurred : ''}`}>{value}</code>
            {!revealed && <span className={styles.dim} aria-hidden="true" />}
            <button
                type="button"
                className={`${styles.button} btn-secondary btn-small ${revealed ? styles.buttonRevealed : ''}`}
                onClick={() => setRevealed((prev) => !prev)}
            >
                {revealed
                    ? pickLocaleText(locale, {
                          en: 'Hide license',
                          fr: 'Masquer la licence',
                          es: 'Ocultar licencia',
                          'pt-br': 'Ocultar licença',
                          de: 'Lizenz ausblenden'
                      })
                    : pickLocaleText(locale, {
                          en: 'See license',
                          fr: 'Voir la licence',
                          es: 'Ver licencia',
                          'pt-br': 'Ver licença',
                          de: 'Lizenz anzeigen'
                      })}
            </button>
        </div>
    )
}
