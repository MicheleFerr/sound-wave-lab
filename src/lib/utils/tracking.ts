// src/lib/utils/tracking.ts

/**
 * Generates a tracking URL for a given carrier and tracking number
 * Supports: SDA/Poste, DHL, UPS, GLS, BRT/Bartolini
 * @param carrier - The carrier name (case-insensitive partial match)
 * @param trackingNumber - The tracking number
 * @returns The tracking URL or null if carrier is not supported
 */
export function getTrackingUrl(
  carrier: string,
  trackingNumber: string
): string | null {
  if (!carrier || !trackingNumber) {
    return null
  }

  const carrierLower = carrier.toLowerCase()

  // SDA / Poste Italiane
  if (carrierLower.includes('poste') || carrierLower.includes('sda')) {
    return `https://www.sda.it/wps/portal/Servizi_Online/dettaglio-spedizione?locale=it&tression=${trackingNumber}`
  }

  // DHL
  if (carrierLower.includes('dhl')) {
    return `https://www.dhl.com/it-it/home/tracking.html?tracking-id=${trackingNumber}`
  }

  // UPS
  if (carrierLower.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${trackingNumber}`
  }

  // GLS
  if (carrierLower.includes('gls')) {
    return `https://www.gls-italy.com/it/servizi/tracking?match=${trackingNumber}`
  }

  // BRT / Bartolini
  if (carrierLower.includes('brt') || carrierLower.includes('bartolini')) {
    return `https://vas.brt.it/vas/sped_det_show.hsm?referer=sped_numspe_par.htm&Ession=${trackingNumber}`
  }

  // Unknown carrier - return null
  return null
}
