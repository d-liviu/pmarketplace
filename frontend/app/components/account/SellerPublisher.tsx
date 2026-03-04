'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getApiBaseUrl } from '../../lib/apiBase'
import { getLocaleFromPathname, withLocalePath } from '../../lib/i18n'

type SellerPlugin = {
    id: number | string
    name: string
    slug?: string | null
    status?: string | null
    updated_at?: string
}

type SellerFormState = {
    name: string
    shortDescription: string
    fullDescription: string
    tagsCsv: string
    isFree: boolean
    price: string
    status: 'draft' | 'published'
    initialVersion: string
    pocketmineVersion: string
    changelog: string
}

const INITIAL_FORM: SellerFormState = {
    name: '',
    shortDescription: '',
    fullDescription: '',
    tagsCsv: '',
    isFree: false,
    price: '0',
    status: 'published',
    initialVersion: '',
    pocketmineVersion: '',
    changelog: ''
}

function getPluginHref(plugin: SellerPlugin) {
    if (plugin.slug && String(plugin.slug).trim()) {
        return `/plugins/${String(plugin.slug).trim()}`
    }

    return `/plugins/${plugin.id}`
}

export default function SellerPublisher() {
    const pathname = usePathname()
    const locale = getLocaleFromPathname(pathname)
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), [])

    const [form, setForm] = useState<SellerFormState>(INITIAL_FORM)
    const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null)
    const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([])
    const [pharFile, setPharFile] = useState<File | null>(null)

    const [submitting, setSubmitting] = useState(false)
    const [loadingListings, setLoadingListings] = useState(false)
    const [authRequired, setAuthRequired] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [myPlugins, setMyPlugins] = useState<SellerPlugin[]>([])

    const uploadPharFile = useCallback(
        async (file: File): Promise<string> => {
            const buffer = await file.arrayBuffer()
            const res = await fetch(`${apiBaseUrl}/plugins/my/upload/phar`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'X-File-Name': encodeURIComponent(file.name)
                },
                body: buffer
            })

            const data = await res.json().catch(() => null)
            if (!res.ok) {
                throw new Error(data?.message || 'Failed to upload .phar file.')
            }

            if (!data?.filePath) {
                throw new Error('Upload succeeded but no file path was returned.')
            }

            return String(data.filePath)
        },
        [apiBaseUrl]
    )

    const uploadImageFile = useCallback(
        async (file: File): Promise<string> => {
            const buffer = await file.arrayBuffer()
            const contentType = file.type || 'application/octet-stream'
            const res = await fetch(`${apiBaseUrl}/plugins/my/upload-image`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': contentType,
                    'X-File-Name': encodeURIComponent(file.name)
                },
                body: buffer
            })

            const data = await res.json().catch(() => null)
            if (!res.ok) {
                throw new Error(data?.message || 'Failed to upload image file.')
            }

            if (!data?.url) {
                throw new Error('Image upload succeeded but no URL was returned.')
            }

            return String(data.url)
        },
        [apiBaseUrl]
    )

    const loadMyPlugins = useCallback(async () => {
        setLoadingListings(true)

        try {
            const res = await fetch(`${apiBaseUrl}/plugins/my/plugins`, {
                credentials: 'include'
            })

            if (res.status === 401 || res.status === 403) {
                setAuthRequired(true)
                setMyPlugins([])
                return
            }

            const data = await res.json().catch(() => [])
            if (!res.ok) {
                setErrorMessage('Unable to load your plugin listings right now.')
                return
            }

            const list = Array.isArray(data)
                ? data
                      .map((item) => ({
                          id: item?.id,
                          name: item?.name ? String(item.name) : '',
                          slug: item?.slug ? String(item.slug) : '',
                          status: item?.status ? String(item.status) : '',
                          updated_at: item?.updated_at ? String(item.updated_at) : undefined
                      }))
                      .filter((plugin) => plugin.id !== undefined && plugin.name)
                : []

            setAuthRequired(false)
            setMyPlugins(list)
        } catch (error) {
            console.error(error)
            setErrorMessage('Network error while loading your plugin listings.')
        } finally {
            setLoadingListings(false)
        }
    }, [apiBaseUrl])

    useEffect(() => {
        void loadMyPlugins()
    }, [loadMyPlugins])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitting(true)
        setErrorMessage('')
        setSuccessMessage('')

        if (!form.name.trim()) {
            setErrorMessage('Plugin name is required.')
            setSubmitting(false)
            return
        }

        const tags = form.tagsCsv
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)

        if (tags.length === 0) {
            setErrorMessage('Add at least one tag.')
            setSubmitting(false)
            return
        }

        if (!form.initialVersion.trim()) {
            setErrorMessage('Initial version is required.')
            setSubmitting(false)
            return
        }

        if (!primaryImageFile) {
            setErrorMessage('Primary image is required.')
            setSubmitting(false)
            return
        }

        if (!pharFile) {
            setErrorMessage('A .phar file is required.')
            setSubmitting(false)
            return
        }

        if (!pharFile.name.toLowerCase().endsWith('.phar')) {
            setErrorMessage('Only .phar files are allowed for plugin upload.')
            setSubmitting(false)
            return
        }

        try {
            const primaryImageUrl = await uploadImageFile(primaryImageFile)
            const galleryUrls: string[] = []

            for (const imageFile of galleryImageFiles) {
                const uploadedUrl = await uploadImageFile(imageFile)
                galleryUrls.push(uploadedUrl)
            }

            const pharPath = await uploadPharFile(pharFile)

            const imageMedia = [primaryImageUrl, ...galleryUrls].map((url, index) => ({
                type: 'image',
                url,
                position: index + 1
            }))

            const payload = {
                name: form.name.trim(),
                short_description: form.shortDescription.trim(),
                full_description: form.fullDescription.trim(),
                is_free: form.isFree,
                price: form.isFree ? 0 : Number(form.price || 0),
                status: form.status,
                tags,
                media: imageMedia,
                versions: [
                    {
                        version: form.initialVersion.trim(),
                        pocketmine_version: form.pocketmineVersion.trim() || null,
                        changelog: form.changelog.trim() || '',
                        file_path: pharPath
                    }
                ]
            }

            const res = await fetch(`${apiBaseUrl}/plugins/my/plugins`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json().catch(() => null)
            if (res.status === 401 || res.status === 403) {
                setAuthRequired(true)
                setErrorMessage('Please sign in to publish plugins.')
                return
            }

            if (!res.ok) {
                setErrorMessage(data?.message || 'Failed to publish plugin.')
                return
            }

            setSuccessMessage(`Plugin "${data?.name || form.name}" was published.`)
            setForm(INITIAL_FORM)
            setPrimaryImageFile(null)
            setGalleryImageFiles([])
            setPharFile(null)
            await loadMyPlugins()
        } catch (error) {
            console.error(error)
            setErrorMessage(error instanceof Error ? error.message : 'Failed to publish plugin.')
        } finally {
            setSubmitting(false)
        }
    }

    if (authRequired) {
        return (
            <div className="card form-grid">
                <h2>Seller Publishing</h2>
                <p className="helper-text">
                    Sign in with a normal user account to upload and sell your plugin listings.
                </p>
                <div className="form-actions">
                    <Link
                        href={`${withLocalePath('/login', locale)}?returnTo=${encodeURIComponent(withLocalePath('/account', locale))}`}
                        className="btn-primary btn-small"
                    >
                        Sign in to publish
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="card form-grid">
            <div className="card-header">
                <h2>Seller Publishing</h2>
                <p className="helper-text">
                    Upload your plugin .phar, screenshots, and listing details to publish directly
                    from your account.
                </p>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="seller-plugin-name">Plugin name</label>
                    <input
                        id="seller-plugin-name"
                        value={form.name}
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, name: event.target.value }))
                        }
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="seller-short-description">Short description</label>
                    <textarea
                        id="seller-short-description"
                        value={form.shortDescription}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                shortDescription: event.target.value
                            }))
                        }
                        rows={3}
                    />
                </div>

                <div className="field">
                    <label htmlFor="seller-full-description">Full description</label>
                    <textarea
                        id="seller-full-description"
                        value={form.fullDescription}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                fullDescription: event.target.value
                            }))
                        }
                        rows={6}
                    />
                </div>

                <div className="field">
                    <label htmlFor="seller-tags">Tags (comma separated)</label>
                    <input
                        id="seller-tags"
                        value={form.tagsCsv}
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, tagsCsv: event.target.value }))
                        }
                        placeholder="Economy, Factions, Utility"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="seller-price">Price (USD)</label>
                    <input
                        id="seller-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        disabled={form.isFree}
                        onChange={(event) =>
                            setForm((prev) => ({ ...prev, price: event.target.value }))
                        }
                    />
                </div>

                <div className="field checkbox-field">
                    <label htmlFor="seller-is-free">
                        <input
                            id="seller-is-free"
                            type="checkbox"
                            checked={form.isFree}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isFree: event.target.checked,
                                    price: event.target.checked ? '0' : prev.price
                                }))
                            }
                        />
                        Mark as free plugin
                    </label>
                </div>

                <div className="field">
                    <label htmlFor="seller-status">Listing status</label>
                    <select
                        id="seller-status"
                        value={form.status}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                status: event.target.value as 'draft' | 'published'
                            }))
                        }
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="seller-primary-image">Primary image</label>
                    <input
                        id="seller-primary-image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                        onChange={(event) => setPrimaryImageFile(event.target.files?.[0] || null)}
                        required
                    />
                    {primaryImageFile && (
                        <span className="helper-text">Selected: {primaryImageFile.name}</span>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="seller-gallery-images">Gallery images (optional)</label>
                    <input
                        id="seller-gallery-images"
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                        onChange={(event) =>
                            setGalleryImageFiles(
                                event.target.files ? Array.from(event.target.files) : []
                            )
                        }
                    />
                    {galleryImageFiles.length > 0 && (
                        <span className="helper-text">
                            {galleryImageFiles.length} gallery image(s) selected.
                        </span>
                    )}
                </div>

                <div className="field">
                    <label htmlFor="seller-initial-version">Initial version</label>
                    <input
                        id="seller-initial-version"
                        value={form.initialVersion}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                initialVersion: event.target.value
                            }))
                        }
                        placeholder="1.0.0"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="seller-pocketmine-version">PocketMine version (optional)</label>
                    <input
                        id="seller-pocketmine-version"
                        value={form.pocketmineVersion}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                pocketmineVersion: event.target.value
                            }))
                        }
                        placeholder="5.x"
                    />
                </div>

                <div className="field">
                    <label htmlFor="seller-changelog">Initial changelog (optional)</label>
                    <textarea
                        id="seller-changelog"
                        value={form.changelog}
                        onChange={(event) =>
                            setForm((prev) => ({
                                ...prev,
                                changelog: event.target.value
                            }))
                        }
                        rows={4}
                    />
                </div>

                <div className="field">
                    <label htmlFor="seller-phar-file">Plugin .phar file</label>
                    <input
                        id="seller-phar-file"
                        type="file"
                        accept=".phar,application/octet-stream"
                        onChange={(event) => setPharFile(event.target.files?.[0] || null)}
                        required
                    />
                    {pharFile && <span className="helper-text">Selected: {pharFile.name}</span>}
                </div>

                <div className="form-actions">
                    <button className="btn-primary" type="submit" disabled={submitting}>
                        {submitting ? 'Publishing...' : 'Publish plugin'}
                    </button>
                </div>
            </form>

            {errorMessage && (
                <p className="helper-text" role="alert">
                    {errorMessage}
                </p>
            )}
            {successMessage && (
                <p className="helper-text" role="status">
                    {successMessage}
                </p>
            )}

            <div className="card-header">
                <h3>Your listings</h3>
                <p className="helper-text">
                    {loadingListings ? 'Loading listings...' : `${myPlugins.length} listing(s)`}
                </p>
            </div>

            {myPlugins.length === 0 ? (
                <p className="helper-text">No listings yet. Publish your first plugin above.</p>
            ) : (
                <div className="list">
                    {myPlugins.map((plugin) => (
                        <div key={plugin.id} className="card">
                            <div className="order-header">
                                <strong>{plugin.name}</strong>
                                <span className="status-pill">
                                    {plugin.status || 'published'}
                                </span>
                            </div>
                            <div className="form-actions">
                                <Link
                                    className="btn-secondary btn-small"
                                    href={withLocalePath(getPluginHref(plugin), locale)}
                                >
                                    View listing
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
