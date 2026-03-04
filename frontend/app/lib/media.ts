import { getApiBaseUrl } from './apiBase'

const apiBaseUrl = getApiBaseUrl()

function getApiOrigin() {
    if (!apiBaseUrl.startsWith('http://') && !apiBaseUrl.startsWith('https://')) {
        return ''
    }

    try {
        return new URL(apiBaseUrl).origin
    } catch (error) {
        console.error('Invalid API base URL', error)
        return ''
    }
}

const apiOrigin = getApiOrigin()

export function resolveMediaUrl(url?: string | null) {
    if (!url) {
        return ''
    }

    const trimmed = url.trim()
    if (!trimmed) {
        return ''
    }

    if (
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('blob:')
    ) {
        return trimmed
    }

    if (!apiOrigin) {
        return trimmed
    }

    return new URL(trimmed, `${apiOrigin}/`).toString()
}
