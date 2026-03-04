export function toSlug(value?: string | null) {
    if (!value) {
        return ''
    }

    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}
