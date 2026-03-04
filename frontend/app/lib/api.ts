import { cookies } from 'next/headers'
import { getApiBaseUrl } from './apiBase'

export async function apiFetch(path: string, options: RequestInit = {}) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    const headers = new Headers(options.headers)
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    return fetch(`${getApiBaseUrl()}${path}`, {
        ...options,
        headers,
        cache: 'no-store'
    })
}
