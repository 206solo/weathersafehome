// ─────────────────────────────────────────────
// WeatherSafeHome Affiliate Configuration
// Update your tracking IDs here when approved.
// ─────────────────────────────────────────────

export const AFFILIATE_IDS = {
  amazon:   'weathersafe-20',   // replace with your Amazon Associates tag
  homedepot: '',                // add when approved via Impact Radius
  lowes:     '',                // add when approved via Impact Radius
  acehardware: '',              // add when approved via ShareASale
}

// ── Link builders ──────────────────────────────
// Use these functions anywhere in the site instead
// of hardcoding links. If your tag ever changes,
// you update it once here and it fixes everywhere.

export function amazonLink(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_IDS.amazon}`
}

export function homedepotLink(url) {
  if (!AFFILIATE_IDS.homedepot) return url
  return `${url}?cm_mmc=affiliate-${AFFILIATE_IDS.homedepot}`
}

export function lowesLink(url) {
  if (!AFFILIATE_IDS.lowes) return url
  return `${url}&cm_sp=affiliate-${AFFILIATE_IDS.lowes}`
}

// ── Disclosure text ────────────────────────────
// Used in the footer and article pages automatically.
export const DISCLOSURE = `WeatherSafeHome.org participates in affiliate 
advertising programs including the Amazon Services LLC Associates Program. 
We may earn a commission when you click our links and make a purchase, 
at no extra cost to you. All recommendations are our own.`