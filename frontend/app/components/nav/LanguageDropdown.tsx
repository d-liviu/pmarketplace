'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { type Locale } from '../../lib/i18n'
import styles from './LanguageDropdown.module.css'

type LanguageOption = {
    locale: Locale
    href: string
    name: string
    flag: string
}

type LanguageDropdownProps = {
    locale: Locale
    options: LanguageOption[]
    label: string
}

type MenuPosition = {
    top: number
    left: number
    width: number
}

const MENU_WIDTH = 280
const VIEWPORT_MARGIN = 12

export default function LanguageDropdown({
    locale,
    options,
    label
}: LanguageDropdownProps) {
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState<MenuPosition>({
        top: 0,
        left: 0,
        width: MENU_WIDTH
    })

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const menuRef = useRef<HTMLDivElement | null>(null)

    const current = options.find((item) => item.locale === locale) ?? options[0]
    const hasDocument = typeof document !== 'undefined'

    useEffect(() => {
        const updatePosition = () => {
            if (!triggerRef.current) {
                return
            }

            const rect = triggerRef.current.getBoundingClientRect()
            const maxLeft = window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN
            const desiredLeft = rect.right - MENU_WIDTH
            const left = Math.min(Math.max(desiredLeft, VIEWPORT_MARGIN), maxLeft)
            const top = rect.bottom + 10

            setPosition({
                top,
                left,
                width: MENU_WIDTH
            })
        }

        if (open) {
            updatePosition()
        }

        const onPointerDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target
            if (!(target instanceof Node)) {
                return
            }

            const clickedTrigger =
                triggerRef.current && triggerRef.current.contains(target)
            const clickedMenu = menuRef.current && menuRef.current.contains(target)

            if (!clickedTrigger && !clickedMenu) {
                setOpen(false)
            }
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        const onViewportChange = () => {
            if (open) {
                updatePosition()
            }
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('touchstart', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        window.addEventListener('resize', onViewportChange)
        window.addEventListener('scroll', onViewportChange, true)

        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('touchstart', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('resize', onViewportChange)
            window.removeEventListener('scroll', onViewportChange, true)
        }
    }, [open])

    return (
        <div className={styles.wrapper}>
            <button
                ref={triggerRef}
                type="button"
                className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
                aria-label={label}
                aria-expanded={open}
                aria-haspopup="menu"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className={styles.flag} aria-hidden="true">
                    {current.flag}
                </span>
                <span className={styles.triggerLabel}>{current.name}</span>
                <span className={`${styles.caret} ${open ? styles.caretOpen : ''}`} aria-hidden="true">
                    ▾
                </span>
            </button>

            {hasDocument &&
                open &&
                createPortal(
                    <div
                        ref={menuRef}
                        className={styles.menu}
                        role="menu"
                        aria-label={label}
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            width: `${position.width}px`
                        }}
                    >
                        {options.map((option) => (
                            <a
                                key={option.locale}
                                href={option.href}
                                role="menuitem"
                                className={`${styles.item} ${
                                    locale === option.locale ? styles.itemActive : ''
                                }`}
                                onClick={() => setOpen(false)}
                            >
                                <span className={styles.itemFlag} aria-hidden="true">
                                    {option.flag}
                                </span>
                                <span>{option.name}</span>
                            </a>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    )
}
