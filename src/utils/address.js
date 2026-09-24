// US mailing-address helpers. Addresses are entered as separate fields but
// stored as one "street, city, ST zip" string, so every existing display of
// `mailingAddress` keeps working unchanged.

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
]

// First three digits of the ZIP codes each state uses (USPS sectional
// center prefixes), as inclusive [from, to] ranges.
const ZIP_PREFIXES = {
  AL: [[350, 369]],
  AK: [[995, 999]],
  AZ: [[850, 865]],
  AR: [[716, 729], [755, 755]],
  CA: [[900, 961]],
  CO: [[800, 816]],
  CT: [[60, 69]],
  DE: [[197, 199]],
  DC: [[200, 205], [569, 569]],
  FL: [[320, 349]],
  GA: [[300, 319], [398, 399]],
  HI: [[967, 968]],
  ID: [[832, 838]],
  IL: [[600, 629]],
  IN: [[460, 479]],
  IA: [[500, 528]],
  KS: [[660, 679]],
  KY: [[400, 427]],
  LA: [[700, 714]],
  ME: [[39, 49]],
  MD: [[206, 219]],
  MA: [[10, 27], [55, 55]],
  MI: [[480, 499]],
  MN: [[550, 567]],
  MS: [[386, 397]],
  MO: [[630, 658]],
  MT: [[590, 599]],
  NE: [[680, 693]],
  NV: [[889, 898]],
  NH: [[30, 38]],
  NJ: [[70, 89]],
  NM: [[870, 884]],
  NY: [[5, 5], [63, 63], [100, 149]],
  NC: [[270, 289]],
  ND: [[580, 588]],
  OH: [[430, 459]],
  OK: [[730, 749]],
  OR: [[970, 979]],
  PA: [[150, 196]],
  RI: [[28, 29]],
  SC: [[290, 299]],
  SD: [[570, 577]],
  TN: [[370, 385]],
  TX: [[733, 733], [750, 799], [885, 885]],
  UT: [[840, 847]],
  VT: [[50, 59]],
  VA: [[201, 201], [220, 246]],
  WA: [[980, 994]],
  WV: [[247, 268]],
  WI: [[530, 549]],
  WY: [[820, 831], [834, 834]],
}

export const EMPTY_ADDRESS = { street: '', city: '', state: '', zip: '' }

export function isAddressEmpty(address) {
  return !address || Object.values(address).every((value) => !(value || '').trim())
}

export function validateAddress(address) {
  const street = (address?.street || '').trim().replace(/\s+/g, ' ')
  const city = (address?.city || '').trim().replace(/\s+/g, ' ')
  const state = address?.state || ''
  const zip = (address?.zip || '').trim()

  if (!street) {
    return 'Street address: enter a house number and street name.'
  }
  if (street.length > 100) {
    return 'Street address: must be 100 characters or fewer.'
  }
  if (!/^[A-Za-z0-9 .,'#/-]+$/.test(street)) {
    return 'Street address: contains characters that are not allowed.'
  }
  const isPoBox = /^(p\.?\s?o\.?\s+)?box\s+\d{1,6}$/i.test(street)
  const hasNumberAndName = /^\d{1,6}(-\d{1,4})?[A-Za-z]?\s+.*[A-Za-z]{2,}/.test(street)
  if (!isPoBox && !hasNumberAndName) {
    return 'Street address: start with a house number followed by the street name (e.g. 123 Main Street).'
  }

  if (!city) {
    return 'City: enter a city.'
  }
  if (city.length > 50 || !/^[A-Za-z]+(?:[ .'-]+[A-Za-z]+)*\.?$/.test(city) || city.replace(/[^A-Za-z]/g, '').length < 2) {
    return 'City: use letters only (spaces, hyphens, periods and apostrophes are allowed).'
  }

  if (!ZIP_PREFIXES[state]) {
    return 'State: choose a state.'
  }

  if (!/^\d{5}(-\d{4})?$/.test(zip)) {
    return 'ZIP code: enter 5 digits (or ZIP+4, e.g. 75205-1234).'
  }
  if (zip.startsWith('00000')) {
    return 'ZIP code: 00000 is not a real ZIP code.'
  }
  const prefix = Number(zip.slice(0, 3))
  const matchesState = ZIP_PREFIXES[state].some(([from, to]) => prefix >= from && prefix <= to)
  if (!matchesState) {
    const stateName = US_STATES.find((item) => item.code === state).name
    return `ZIP code: ${zip} is not a ${stateName} ZIP code.`
  }

  return null
}

export function formatAddress(address) {
  const street = address.street.trim().replace(/\s+/g, ' ')
  const city = address.city.trim().replace(/\s+/g, ' ')
  return `${street}, ${city}, ${address.state} ${address.zip.trim()}`
}

// Best-effort split of a stored "street, city, ST zip" string back into
// fields, so an existing address can be edited. Anything that doesn't match
// lands in `street` for the user to fix.
export function parseAddress(mailingAddress) {
  const match = /^(.+),\s*([^,]+),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/.exec((mailingAddress || '').trim())
  if (!match) {
    return { ...EMPTY_ADDRESS, street: mailingAddress || '' }
  }
  return { street: match[1], city: match[2], state: match[3].toUpperCase(), zip: match[4] }
}
