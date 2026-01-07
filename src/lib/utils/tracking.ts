// src/lib/utils/tracking.ts

/**
 * Generates tracking URL based on carrier and tracking number.
 * Supports Italian carriers: SDA/Poste Italiane, DHL, UPS, GLS, BRT/Bartolini
 */
export function getTrackingUrl(carrier: string, trackingNumber: string): string | null {
  if (!carrier || !trackingNumber) {
    return null
  }

  const carrierLower = carrier.toLowerCase()

  // SDA / Poste Italiane
  if (carrierLower.includes('poste') || carrierLower.includes('sda')) {
    return `https://www.sda.it/wps/portal/Servizi_Online/dettaglio-spedizione?locale=it&tression=${encodeURIComponent(trackingNumber)}`
  }

  // DHL
  if (carrierLower.includes('dhl')) {
    return `https://www.dhl.com/it-it/home/tracking.html?tracking-id=${encodeURIComponent(trackingNumber)}`
  }

  // UPS
  if (carrierLower.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(trackingNumber)}&loc=it_IT`
  }

  // GLS
  if (carrierLower.includes('gls')) {
    return `https://www.gls-italy.com/it/servizi/tracking?match=${encodeURIComponent(trackingNumber)}`
  }

  // BRT / Bartolini
  if (carrierLower.includes('brt') || carrierLower.includes('bartolini')) {
    return `https://vas.brt.it/vas/sped_det_show.hsm?referer=sped_numspe_par.htm&Ession=${encodeURIComponent(trackingNumber)}`
  }

  // FedEx
  if (carrierLower.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(trackingNumber)}`
  }

  // TNT
  if (carrierLower.includes('tnt')) {
    return `https://www.tnt.it/tracking/Tracking.do?searchType=CON&cons=${encodeURIComponent(trackingNumber)}`
  }

  // Unknown carrier - return null (no link available)
  return null
}

/**
 * Checks if a carrier has a known tracking URL pattern
 */
export function hasKnownTrackingUrl(carrier: string): boolean {
  const carrierLower = carrier.toLowerCase()
  return (
    carrierLower.includes('poste') ||
    carrierLower.includes('sda') ||
    carrierLower.includes('dhl') ||
    carrierLower.includes('ups') ||
    carrierLower.includes('gls') ||
    carrierLower.includes('brt') ||
    carrierLower.includes('bartolini') ||
    carrierLower.includes('fedex') ||
    carrierLower.includes('tnt')
  )
}
