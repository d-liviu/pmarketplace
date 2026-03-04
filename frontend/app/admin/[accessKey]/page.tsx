import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AdminPanel from '../../components/admin/AdminPanel'

export const metadata: Metadata = {
    title: 'Admin Panel | PMarketplace',
    description: 'Private admin plugin publishing panel.',
    robots: {
        index: false,
        follow: false
    }
}

export default async function AdminPage({
    params
}: {
    params: Promise<{ accessKey: string }>
}) {
    const { accessKey } = await params
    const expectedAccessKey = process.env.ADMIN_PANEL_ACCESS_KEY

    if (!expectedAccessKey || accessKey !== expectedAccessKey) {
        notFound()
    }

    return (
        <>
            <section className="page-hero">
                <div className="container">
                    <span className="hero-badge">Private Area</span>
                    <h1 className="page-title">Admin Panel</h1>
                    <p className="page-subtitle">
                        Publish plugins, manage metadata, and ship new releases.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <AdminPanel />
                </div>
            </section>
        </>
    )
}
