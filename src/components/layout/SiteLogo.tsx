// src/components/layout/SiteLogo.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LOGO_PATHS, type LogoVariant, type LogoFormat } from '@/lib/logo-config'

interface SiteLogoProps {
  variant?: LogoVariant
  format?: LogoFormat
  width?: number
  height?: number
  className?: string
  linkTo?: string
  priority?: boolean
}

export function SiteLogo({
  variant = 'full',
  format = 'svg',
  width,
  height,
  className = '',
  linkTo = '/',
  priority = false
}: SiteLogoProps) {
  // Determine logo path based on variant and format
  const getLogoPath = () => {
    switch (variant) {
      case 'full':
        return format === 'svg' ? LOGO_PATHS.header.full : LOGO_PATHS.header.fullPng
      case 'compact':
        return format === 'svg' ? LOGO_PATHS.header.compact : LOGO_PATHS.header.compactPng
      case 'icon':
        return format === 'svg' ? LOGO_PATHS.favicon.svg : LOGO_PATHS.favicon.png
      case 'social':
        return format === 'svg' ? LOGO_PATHS.social.square : LOGO_PATHS.social.squarePng
      default:
        return LOGO_PATHS.header.full
    }
  }

  // Default dimensions based on variant
  const getDefaultDimensions = () => {
    switch (variant) {
      case 'full':
        return { width: 200, height: 60 }
      case 'compact':
        return { width: 150, height: 50 }
      case 'icon':
        return { width: 40, height: 40 }
      case 'social':
        return { width: 120, height: 120 }
      default:
        return { width: 200, height: 60 }
    }
  }

  const defaults = getDefaultDimensions()
  const logoPath = getLogoPath()
  const finalWidth = width || defaults.width
  const finalHeight = height || defaults.height

  const logoImage = (
    <Image
      src={logoPath}
      alt="SoundwaveLab Logo"
      width={finalWidth}
      height={finalHeight}
      className={className}
      priority={priority}
    />
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-block">
        {logoImage}
      </Link>
    )
  }

  return logoImage
}

// Convenience components
export function HeaderLogo(props: Omit<SiteLogoProps, 'variant'>) {
  return <SiteLogo variant="full" priority {...props} />
}

export function MobileLogo(props: Omit<SiteLogoProps, 'variant'>) {
  return <SiteLogo variant="compact" priority {...props} />
}

export function IconLogo(props: Omit<SiteLogoProps, 'variant'>) {
  return <SiteLogo variant="icon" {...props} />
}
