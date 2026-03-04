'use client'

import Image, { type ImageLoader } from 'next/image'
import { useState } from 'react'

type MediaImageProps = {
    src: string
    alt: string
    className?: string
    fallbackSrc?: string
}

const passthroughLoader: ImageLoader = ({ src }) => src

export default function MediaImage({
    src,
    alt,
    className,
    fallbackSrc
}: MediaImageProps) {
    const [state, setState] = useState(() => ({
        sourceSrc: src,
        currentSrc: src,
        loading: true
    }))

    const sourceChanged = state.sourceSrc !== src
    const currentSrc = sourceChanged ? src : state.currentSrc
    const loading = sourceChanged ? true : state.loading

    const handleError = () => {
        setState((prev) => {
            const resolvedSrc = prev.sourceSrc === src ? prev.currentSrc : src
            if (fallbackSrc && resolvedSrc !== fallbackSrc) {
                return {
                    sourceSrc: src,
                    currentSrc: fallbackSrc,
                    loading: true
                }
            }

            return {
                sourceSrc: src,
                currentSrc: resolvedSrc,
                loading: false
            }
        })
    }

    const markLoaded = () => {
        setState((prev) => {
            const resolvedSrc = prev.sourceSrc === src ? prev.currentSrc : src
            if (
                prev.sourceSrc === src &&
                prev.currentSrc === resolvedSrc &&
                prev.loading === false
            ) {
                return prev
            }

            return {
                sourceSrc: src,
                currentSrc: resolvedSrc,
                loading: false
            }
        })
    }

    return (
        <Image
            loader={passthroughLoader}
            unoptimized
            src={currentSrc}
            alt={alt}
            width={1200}
            height={800}
            sizes="100vw"
            loading="lazy"
            decoding="async"
            className={className}
            data-loading={loading ? 'true' : 'false'}
            onLoad={markLoaded}
            onLoadingComplete={markLoaded}
            onError={handleError}
        />
    )
}
