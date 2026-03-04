'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getApiBaseUrl } from '../../lib/apiBase'

type PluginFormState = {
    name: string
    slug: string
    shortDescription: string
    fullDescription: string
    isFree: boolean
    price: string
    status: 'draft' | 'published'
    featured: boolean
    tagsCsv: string
    primaryImageUrl: string
    galleryImageUrls: string
    videoUrls: string
    initialVersion: string
    pocketmineVersion: string
    changelog: string
}

type ReleaseFormState = {
    pluginId: string
    version: string
    pocketmineVersion: string
    changelog: string
}

type ExistingPlugin = {
    id: number | string
    name: string
    slug?: string
}

const INITIAL_FORM: PluginFormState = {
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    isFree: false,
    price: '0',
    status: 'draft',
    featured: false,
    tagsCsv: '',
    primaryImageUrl: '',
    galleryImageUrls: '',
    videoUrls: '',
    initialVersion: '',
    pocketmineVersion: '',
    changelog: ''
}

const INITIAL_RELEASE_FORM: ReleaseFormState = {
    pluginId: '',
    version: '',
    pocketmineVersion: '',
    changelog: ''
}

type SessionStatus = 'checking' | 'unauthenticated' | 'authenticated'

export default function AdminPanel() {
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), [])
    const [sessionStatus, setSessionStatus] = useState<SessionStatus>('checking')
    const [loginForm, setLoginForm] = useState({ username: '', password: '' })
    const [loginLoading, setLoginLoading] = useState(false)
    const [loginError, setLoginError] = useState('')

    const [form, setForm] = useState<PluginFormState>(INITIAL_FORM)
    const [pharFile, setPharFile] = useState<File | null>(null)
    const [pharPath, setPharPath] = useState('')
    const [pharUploading, setPharUploading] = useState(false)
    const [pharUploadError, setPharUploadError] = useState('')

    const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null)
    const [primaryImageUploading, setPrimaryImageUploading] = useState(false)
    const [primaryImageUploadError, setPrimaryImageUploadError] = useState('')

    const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([])
    const [galleryImagesUploading, setGalleryImagesUploading] = useState(false)
    const [galleryImagesUploadError, setGalleryImagesUploadError] = useState('')

    const [saving, setSaving] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [pluginsLoading, setPluginsLoading] = useState(false)
    const [pluginsLoadError, setPluginsLoadError] = useState('')
    const [existingPlugins, setExistingPlugins] = useState<ExistingPlugin[]>([])

    const [releaseForm, setReleaseForm] = useState<ReleaseFormState>(INITIAL_RELEASE_FORM)
    const [releasePharFile, setReleasePharFile] = useState<File | null>(null)
    const [releasePharPath, setReleasePharPath] = useState('')
    const [releasePharUploading, setReleasePharUploading] = useState(false)
    const [releasePharUploadError, setReleasePharUploadError] = useState('')
    const [releaseSaving, setReleaseSaving] = useState(false)
    const [releaseError, setReleaseError] = useState('')
    const [releaseSuccess, setReleaseSuccess] = useState('')

    const checkSession = useCallback(async () => {
        try {
            const res = await fetch(`${apiBaseUrl}/admin/session`, {
                credentials: 'include'
            })
            setSessionStatus(res.ok ? 'authenticated' : 'unauthenticated')
        } catch (error) {
            console.error(error)
            setSessionStatus('unauthenticated')
        }
    }, [apiBaseUrl])

    const loadPlugins = useCallback(async () => {
        setPluginsLoading(true)
        setPluginsLoadError('')

        try {
            const res = await fetch(`${apiBaseUrl}/plugins`, {
                credentials: 'include'
            })

            const data = await res.json().catch(() => [])
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    setSessionStatus('unauthenticated')
                    setPluginsLoadError('Admin session expired. Please login again.')
                    return
                }

                setPluginsLoadError('Failed to load existing plugins.')
                return
            }

            const list = Array.isArray(data)
                ? data
                      .map((item) => ({
                          id: item?.id,
                          name: item?.name ? String(item.name) : '',
                          slug: item?.slug ? String(item.slug) : undefined
                      }))
                      .filter((item) => item.id !== undefined && item.name)
                : []

            list.sort((left, right) => left.name.localeCompare(right.name))
            setExistingPlugins(list)
            setReleaseForm((prev) => ({
                ...prev,
                pluginId: prev.pluginId || (list[0] ? String(list[0].id) : '')
            }))
        } catch (error) {
            console.error(error)
            setPluginsLoadError('Network error while loading plugins.')
        } finally {
            setPluginsLoading(false)
        }
    }, [apiBaseUrl])

    useEffect(() => {
        void checkSession()
    }, [checkSession])

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            void loadPlugins()
        }
    }, [sessionStatus, loadPlugins])

    const uploadPharFile = useCallback(
        async (file: File): Promise<string> => {
            const buffer = await file.arrayBuffer()
            const res = await fetch(`${apiBaseUrl}/admin/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'X-File-Name': encodeURIComponent(file.name)
                },
                credentials: 'include',
                body: buffer
            })

            const data = await res.json().catch(() => null)
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    setSessionStatus('unauthenticated')
                }
                throw new Error(data?.message || 'Failed to upload .phar file.')
            }

            return data?.filePath || ''
        },
        [apiBaseUrl]
    )

    const uploadImageFile = useCallback(
        async (file: File): Promise<string> => {
            const buffer = await file.arrayBuffer()
            const contentType = file.type || 'application/octet-stream'
            const res = await fetch(`${apiBaseUrl}/admin/upload-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': contentType,
                    'X-File-Name': encodeURIComponent(file.name)
                },
                credentials: 'include',
                body: buffer
            })

            const data = await res.json().catch(() => null)
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    setSessionStatus('unauthenticated')
                }
                throw new Error(data?.message || 'Failed to upload image file.')
            }

            return data?.url || ''
        },
        [apiBaseUrl]
    )

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoginLoading(true)
        setLoginError('')

        try {
            const res = await fetch(`${apiBaseUrl}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(loginForm)
            })

            const data = await res.json().catch(() => null)
            if (!res.ok) {
                setLoginError(data?.message || 'Unable to authenticate admin user')
                return
            }

            setSessionStatus('authenticated')
            setLoginForm({ username: '', password: '' })
        } catch (error) {
            console.error(error)
            setLoginError('Network error, please try again.')
        } finally {
            setLoginLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch(`${apiBaseUrl}/admin/logout`, {
                method: 'POST',
                credentials: 'include'
            })
        } catch (error) {
            console.error(error)
        } finally {
            setSessionStatus('unauthenticated')
            setSuccessMessage('')
            setSubmitError('')
            setReleaseError('')
            setReleaseSuccess('')
            setExistingPlugins([])
        }
    }

    const handleUploadPhar = async () => {
        if (!pharFile) {
            setPharUploadError('Please choose a .phar file first.')
            return
        }

        if (!pharFile.name.toLowerCase().endsWith('.phar')) {
            setPharUploadError('Only .phar files are allowed.')
            return
        }

        setPharUploading(true)
        setPharUploadError('')

        try {
            const uploadedPath = await uploadPharFile(pharFile)
            setPharPath(uploadedPath)
        } catch (error) {
            console.error(error)
            setPharUploadError(error instanceof Error ? error.message : 'Upload failed.')
        } finally {
            setPharUploading(false)
        }
    }

    const handleUploadPrimaryImage = async () => {
        if (!primaryImageFile) {
            setPrimaryImageUploadError('Choose an image file first.')
            return
        }

        setPrimaryImageUploading(true)
        setPrimaryImageUploadError('')

        try {
            const imageUrl = await uploadImageFile(primaryImageFile)
            if (!imageUrl) {
                setPrimaryImageUploadError('Image upload failed.')
                return
            }

            setForm((prev) => ({
                ...prev,
                primaryImageUrl: imageUrl
            }))
        } catch (error) {
            console.error(error)
            setPrimaryImageUploadError(error instanceof Error ? error.message : 'Upload failed.')
        } finally {
            setPrimaryImageUploading(false)
        }
    }

    const handleUploadGalleryImages = async () => {
        if (galleryImageFiles.length === 0) {
            setGalleryImagesUploadError('Choose one or more images first.')
            return
        }

        setGalleryImagesUploading(true)
        setGalleryImagesUploadError('')

        try {
            const uploadedUrls: string[] = []
            for (const file of galleryImageFiles) {
                const uploaded = await uploadImageFile(file)
                if (uploaded) {
                    uploadedUrls.push(uploaded)
                }
            }

            if (uploadedUrls.length === 0) {
                setGalleryImagesUploadError('No image was uploaded.')
                return
            }

            setForm((prev) => {
                const current = prev.galleryImageUrls
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean)
                const merged = [...current, ...uploadedUrls]
                return {
                    ...prev,
                    galleryImageUrls: merged.join('\n')
                }
            })
            setGalleryImageFiles([])
        } catch (error) {
            console.error(error)
            setGalleryImagesUploadError(error instanceof Error ? error.message : 'Upload failed.')
        } finally {
            setGalleryImagesUploading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaving(true)
        setSubmitError('')
        setSuccessMessage('')

        if (form.initialVersion.trim() && !pharPath) {
            setSubmitError('Upload a .phar file before creating a version.')
            setSaving(false)
            return
        }

        const tags = form.tagsCsv
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)

        const galleryUrls = form.galleryImageUrls
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)

        const imageUrls = [form.primaryImageUrl.trim(), ...galleryUrls].filter(Boolean)
        const videoUrls = form.videoUrls
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)

        if (tags.length === 0) {
            setSubmitError('Add at least one tag.')
            setSaving(false)
            return
        }

        if (!form.primaryImageUrl.trim()) {
            setSubmitError('Add a primary image URL (or upload one).')
            setSaving(false)
            return
        }

        if (imageUrls.length === 0) {
            setSubmitError('Add at least one image URL.')
            setSaving(false)
            return
        }

        if (!form.initialVersion.trim()) {
            setSubmitError('Initial version is required.')
            setSaving(false)
            return
        }

        if (!pharPath) {
            setSubmitError('Upload a .phar file before submitting.')
            setSaving(false)
            return
        }

        const imageMedia = imageUrls.map((url, index) => ({
            type: 'image',
            url,
            position: index + 1
        }))
        const videoMedia = videoUrls.map((url, index) => ({
            type: 'video',
            url,
            position: imageMedia.length + index + 1
        }))
        const media = [...imageMedia, ...videoMedia]

        const versions = [
            {
                version: form.initialVersion.trim(),
                pocketmine_version: form.pocketmineVersion.trim() || null,
                changelog: form.changelog.trim() || '',
                file_path: pharPath
            }
        ]

        const payload = {
            name: form.name.trim(),
            slug: form.slug.trim() || undefined,
            short_description: form.shortDescription.trim(),
            full_description: form.fullDescription.trim(),
            is_free: form.isFree,
            price: form.isFree ? 0 : Number(form.price || 0),
            status: form.status,
            featured: form.featured,
            tags,
            media,
            versions,
            tagsCsv: form.tagsCsv,
            primaryImageUrl: form.primaryImageUrl.trim(),
            galleryImageUrls: form.galleryImageUrls,
            videoUrls: form.videoUrls,
            initialVersion: form.initialVersion.trim(),
            pocketmineVersion: form.pocketmineVersion.trim() || undefined,
            filePath: pharPath
        }

        try {
            const res = await fetch(`${apiBaseUrl}/plugins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })

            const data = await res.json().catch(() => null)
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    setSessionStatus('unauthenticated')
                    setSubmitError('Admin session expired. Please login again.')
                    return
                }

                setSubmitError(data?.message || 'Failed to create plugin')
                return
            }

            const createdTagsCount = Array.isArray(data?.tags) ? data.tags.length : tags.length
            const createdMediaCount = Array.isArray(data?.media) ? data.media.length : media.length
            const createdVersionsCount = Array.isArray(data?.versions)
                ? data.versions.length
                : versions.length

            setSuccessMessage(
                `Plugin "${data?.name || form.name}" created with ${createdTagsCount} tag(s), ${createdMediaCount} media item(s), and ${createdVersionsCount} version(s).`
            )
            setForm(INITIAL_FORM)
            setPharFile(null)
            setPharPath('')
            setPrimaryImageFile(null)
            setGalleryImageFiles([])
            void loadPlugins()
        } catch (error) {
            console.error(error)
            setSubmitError('Network error, please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleUploadReleasePhar = async () => {
        if (!releasePharFile) {
            setReleasePharUploadError('Please choose a .phar file first.')
            return
        }

        if (!releasePharFile.name.toLowerCase().endsWith('.phar')) {
            setReleasePharUploadError('Only .phar files are allowed.')
            return
        }

        setReleasePharUploading(true)
        setReleasePharUploadError('')

        try {
            const uploadedPath = await uploadPharFile(releasePharFile)
            setReleasePharPath(uploadedPath)
        } catch (error) {
            console.error(error)
            setReleasePharUploadError(error instanceof Error ? error.message : 'Upload failed.')
        } finally {
            setReleasePharUploading(false)
        }
    }

    const handleReleaseSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setReleaseSaving(true)
        setReleaseError('')
        setReleaseSuccess('')

        if (!releaseForm.pluginId) {
            setReleaseError('Select an existing plugin.')
            setReleaseSaving(false)
            return
        }

        if (!releaseForm.version.trim()) {
            setReleaseError('Version is required.')
            setReleaseSaving(false)
            return
        }

        if (!releasePharPath) {
            setReleaseError('Upload a .phar file before creating the version.')
            setReleaseSaving(false)
            return
        }

        const payload = {
            version: releaseForm.version.trim(),
            pocketmine_version: releaseForm.pocketmineVersion.trim() || null,
            changelog: releaseForm.changelog.trim() || '',
            file_path: releasePharPath
        }

        try {
            const res = await fetch(`${apiBaseUrl}/plugins/${releaseForm.pluginId}/versions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })

            const data = await res.json().catch(() => null)
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    setSessionStatus('unauthenticated')
                    setReleaseError('Admin session expired. Please login again.')
                    return
                }

                setReleaseError(data?.message || 'Failed to create version.')
                return
            }

            setReleaseSuccess(`Version ${data?.version || releaseForm.version} added successfully.`)
            setReleaseForm((prev) => ({
                ...prev,
                version: '',
                pocketmineVersion: '',
                changelog: ''
            }))
            setReleasePharFile(null)
            setReleasePharPath('')
        } catch (error) {
            console.error(error)
            setReleaseError('Network error, please try again.')
        } finally {
            setReleaseSaving(false)
        }
    }

    if (sessionStatus === 'checking') {
        return (
            <div className="card">
                <p>Checking admin session...</p>
            </div>
        )
    }

    if (sessionStatus === 'unauthenticated') {
        return (
            <div className="card">
                <h2>Admin Sign In</h2>
                <p className="helper-text">
                    Access is restricted to admin credentials configured in the backend
                    environment.
                </p>

                <form className="form-grid" onSubmit={handleLogin}>
                    <div className="field">
                        <label htmlFor="admin-username">Username</label>
                        <input
                            id="admin-username"
                            value={loginForm.username}
                            onChange={(event) =>
                                setLoginForm((prev) => ({
                                    ...prev,
                                    username: event.target.value
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="admin-password">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={loginForm.password}
                            onChange={(event) =>
                                setLoginForm((prev) => ({
                                    ...prev,
                                    password: event.target.value
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={loginLoading}>
                            {loginLoading ? 'Signing in...' : 'Sign in as admin'}
                        </button>
                    </div>
                    {loginError && (
                        <p className="helper-text" role="alert">
                            {loginError}
                        </p>
                    )}
                </form>
            </div>
        )
    }

    return (
        <div className="form-grid">
            <div className="card">
                <div className="hero-actions">
                    <h2>Admin Plugin Publisher</h2>
                    <button
                        type="button"
                        className="btn-secondary btn-small"
                        onClick={handleLogout}
                    >
                        Log out
                    </button>
                </div>
                <p className="helper-text">
                    Create plugins with one primary image, optional secondary media, and versioned
                    releases.
                </p>
            </div>

            <div className="card">
                <h3>Create New Plugin</h3>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="plugin-name">Plugin name</label>
                        <input
                            id="plugin-name"
                            value={form.name}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, name: event.target.value }))
                            }
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-slug">Slug (optional)</label>
                        <input
                            id="plugin-slug"
                            value={form.slug}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, slug: event.target.value }))
                            }
                            placeholder="leave empty to auto-generate"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-short-description">Short description</label>
                        <textarea
                            id="plugin-short-description"
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
                        <label htmlFor="plugin-full-description">Full description</label>
                        <textarea
                            id="plugin-full-description"
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
                        <label htmlFor="plugin-tags">Tags (comma separated)</label>
                        <input
                            id="plugin-tags"
                            value={form.tagsCsv}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, tagsCsv: event.target.value }))
                            }
                            placeholder="Economy, Factions, Moderation"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-price">Price (USD)</label>
                        <input
                            id="plugin-price"
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

                    <div className="field">
                        <label htmlFor="plugin-status">Status</label>
                        <select
                            id="plugin-status"
                            value={form.status}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    status: event.target.value as 'draft' | 'published'
                                }))
                            }
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-primary-image">Primary image URL (profile image)</label>
                        <input
                            id="plugin-primary-image"
                            value={form.primaryImageUrl}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    primaryImageUrl: event.target.value
                                }))
                            }
                            placeholder="https://... or /uploads/media/..."
                            required
                        />
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                            onChange={(event) => {
                                setPrimaryImageFile(event.target.files?.[0] || null)
                                setPrimaryImageUploadError('')
                            }}
                        />
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleUploadPrimaryImage}
                                disabled={primaryImageUploading || !primaryImageFile}
                            >
                                {primaryImageUploading
                                    ? 'Uploading primary image...'
                                    : 'Upload primary image'}
                            </button>
                        </div>
                        {primaryImageUploadError && (
                            <p className="helper-text" role="alert">
                                {primaryImageUploadError}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-gallery-images">
                            Secondary image URLs (shown in description, one per line)
                        </label>
                        <textarea
                            id="plugin-gallery-images"
                            value={form.galleryImageUrls}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    galleryImageUrls: event.target.value
                                }))
                            }
                            rows={4}
                            placeholder={'https://...\\nhttps://...'}
                        />
                        <input
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                            onChange={(event) => {
                                const files = event.target.files
                                    ? Array.from(event.target.files)
                                    : []
                                setGalleryImageFiles(files)
                                setGalleryImagesUploadError('')
                            }}
                        />
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleUploadGalleryImages}
                                disabled={galleryImagesUploading || galleryImageFiles.length === 0}
                            >
                                {galleryImagesUploading
                                    ? 'Uploading secondary images...'
                                    : 'Upload secondary images'}
                            </button>
                        </div>
                        {galleryImagesUploadError && (
                            <p className="helper-text" role="alert">
                                {galleryImagesUploadError}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-video-urls">Demo video URLs (one per line)</label>
                        <textarea
                            id="plugin-video-urls"
                            value={form.videoUrls}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    videoUrls: event.target.value
                                }))
                            }
                            rows={3}
                            placeholder={'https://youtube.com/...\\nhttps://...'}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-version">Initial plugin version</label>
                        <input
                            id="plugin-version"
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
                        <label htmlFor="plugin-phar">Plugin .phar file (for initial version)</label>
                        <input
                            id="plugin-phar"
                            type="file"
                            accept=".phar,application/octet-stream"
                            onChange={(event) => {
                                const nextFile = event.target.files?.[0] || null
                                setPharFile(nextFile)
                                setPharPath('')
                                setPharUploadError('')
                            }}
                        />
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleUploadPhar}
                                disabled={pharUploading || !pharFile}
                            >
                                {pharUploading ? 'Uploading .phar...' : 'Upload .phar'}
                            </button>
                        </div>
                        {pharPath && (
                            <p className="helper-text">
                                Uploaded file path: <code>{pharPath}</code>
                            </p>
                        )}
                        {pharUploadError && (
                            <p className="helper-text" role="alert">
                                {pharUploadError}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="plugin-pocketmine-version">PocketMine version (optional)</label>
                        <input
                            id="plugin-pocketmine-version"
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
                        <label htmlFor="plugin-changelog">Initial changelog (optional)</label>
                        <textarea
                            id="plugin-changelog"
                            value={form.changelog}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, changelog: event.target.value }))
                            }
                            rows={5}
                        />
                    </div>

                    <div className="field">
                        <span className="helper-text">Pricing mode</span>
                        <div className="button-row">
                            <button
                                type="button"
                                className={
                                    form.isFree ? 'btn-primary btn-small' : 'btn-secondary btn-small'
                                }
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isFree: true,
                                        price: '0'
                                    }))
                                }
                            >
                                Free plugin
                            </button>
                            <button
                                type="button"
                                className={
                                    !form.isFree ? 'btn-primary btn-small' : 'btn-secondary btn-small'
                                }
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isFree: false
                                    }))
                                }
                            >
                                Paid plugin
                            </button>
                        </div>
                    </div>

                    <div className="field">
                        <span className="helper-text">Featured placement</span>
                        <div className="button-row">
                            <button
                                type="button"
                                className={
                                    form.featured ? 'btn-primary btn-small' : 'btn-secondary btn-small'
                                }
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        featured: !prev.featured
                                    }))
                                }
                            >
                                {form.featured ? 'Featured: ON' : 'Featured: OFF'}
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={saving}>
                            {saving ? 'Publishing...' : 'Create plugin'}
                        </button>
                    </div>

                    {submitError && (
                        <p className="helper-text" role="alert">
                            {submitError}
                        </p>
                    )}
                    {successMessage && <p className="helper-text">{successMessage}</p>}
                </form>
            </div>

            <div className="card">
                <h3>Add Version To Existing Plugin</h3>
                <p className="helper-text">
                    Upload a new .phar and attach it to an existing plugin release history.
                </p>

                <form className="form-grid" onSubmit={handleReleaseSubmit}>
                    <div className="field">
                        <label htmlFor="existing-plugin-id">Plugin</label>
                        <select
                            id="existing-plugin-id"
                            value={releaseForm.pluginId}
                            onChange={(event) =>
                                setReleaseForm((prev) => ({
                                    ...prev,
                                    pluginId: event.target.value
                                }))
                            }
                            required
                        >
                            <option value="">Select a plugin</option>
                            {existingPlugins.map((plugin) => (
                                <option key={plugin.id} value={String(plugin.id)}>
                                    {plugin.name}
                                    {plugin.slug ? ` (${plugin.slug})` : ''}
                                </option>
                            ))}
                        </select>
                        {pluginsLoading && <p className="helper-text">Loading plugins...</p>}
                        {pluginsLoadError && (
                            <p className="helper-text" role="alert">
                                {pluginsLoadError}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="release-version">Version</label>
                        <input
                            id="release-version"
                            value={releaseForm.version}
                            onChange={(event) =>
                                setReleaseForm((prev) => ({
                                    ...prev,
                                    version: event.target.value
                                }))
                            }
                            placeholder="1.0.1"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="release-pocketmine">PocketMine version (optional)</label>
                        <input
                            id="release-pocketmine"
                            value={releaseForm.pocketmineVersion}
                            onChange={(event) =>
                                setReleaseForm((prev) => ({
                                    ...prev,
                                    pocketmineVersion: event.target.value
                                }))
                            }
                            placeholder="5.x"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="release-changelog">Changelog (optional)</label>
                        <textarea
                            id="release-changelog"
                            value={releaseForm.changelog}
                            onChange={(event) =>
                                setReleaseForm((prev) => ({
                                    ...prev,
                                    changelog: event.target.value
                                }))
                            }
                            rows={4}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="release-phar">Release .phar file</label>
                        <input
                            id="release-phar"
                            type="file"
                            accept=".phar,application/octet-stream"
                            onChange={(event) => {
                                const nextFile = event.target.files?.[0] || null
                                setReleasePharFile(nextFile)
                                setReleasePharPath('')
                                setReleasePharUploadError('')
                            }}
                        />
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleUploadReleasePhar}
                                disabled={releasePharUploading || !releasePharFile}
                            >
                                {releasePharUploading
                                    ? 'Uploading release .phar...'
                                    : 'Upload release .phar'}
                            </button>
                        </div>
                        {releasePharPath && (
                            <p className="helper-text">
                                Uploaded file path: <code>{releasePharPath}</code>
                            </p>
                        )}
                        {releasePharUploadError && (
                            <p className="helper-text" role="alert">
                                {releasePharUploadError}
                            </p>
                        )}
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={releaseSaving}>
                            {releaseSaving ? 'Creating version...' : 'Create version'}
                        </button>
                    </div>

                    {releaseError && (
                        <p className="helper-text" role="alert">
                            {releaseError}
                        </p>
                    )}
                    {releaseSuccess && <p className="helper-text">{releaseSuccess}</p>}
                </form>
            </div>
        </div>
    )
}
