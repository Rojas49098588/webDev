import cardValidator from 'card-validator'

export function validateName(name) {
  if (!name || name.replace(/[^a-zA-Z]/g, '').length < 2) {
    return 'Must have at least 2 alphabetic characters'
  }
  return null
}

export function validateDateOfBirth(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString || '')
  if (!match) {
    return 'Enter a valid date (YYYY-MM-DD)'
  }

  const [, yearStr, monthStr, dayStr] = match
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)
  const date = new Date(year, month - 1, day)

  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day

  if (!isRealDate) {
    return 'Enter a valid date'
  }
  if (date.getTime() > Date.now()) {
    return 'Date of birth cannot be in the future'
  }
  return null
}

// Card checks use Braintree's card-validator: Luhn checksum, brand detection
// (each brand's real number length is accepted, e.g. 15 digits for Amex),
// and a CVV length that matches the brand.
export function getCardBrand(cardNumber) {
  const { card } = cardValidator.number(cardNumber || '')
  return card
    ? {
        name: card.niceType,
        codeName: card.code.name,
        codeSize: card.code.size,
        gaps: card.gaps,
        maxLength: Math.max(...card.lengths),
      }
    : null
}

// Groups digits the way the brand prints them (4-4-4-4, Amex 4-6-5) and
// caps the length at the brand's longest valid number (19 if unknown).
export function formatCardNumber(value) {
  const brand = getCardBrand(value)
  const digits = (value || '').replace(/\D/g, '').slice(0, brand?.maxLength ?? 19)
  const gaps = brand?.gaps ?? [4, 8, 12, 16]
  return digits.replace(/\d/g, (digit, index) => (gaps.includes(index) ? ` ${digit}` : digit))
}

export function validateCardNumber(cardNumber) {
  const digits = (cardNumber || '').replace(/[\s-]/g, '')
  if (!digits) {
    return 'Enter the card number.'
  }
  if (!/^\d+$/.test(digits)) {
    return 'Card number can only contain digits.'
  }

  const result = cardValidator.number(digits)
  if (!result.card) {
    return 'Card number is not from a recognized card brand.'
  }
  if (!result.isValid) {
    const { lengths, niceType } = result.card
    if (!lengths.includes(digits.length)) {
      const allowed = lengths.length > 1 ? `${lengths.slice(0, -1).join(', ')} or ${lengths.at(-1)}` : lengths[0]
      return `${niceType} card numbers are ${allowed} digits.`
    }
    return `This ${niceType} card number is not valid. Check it for typos.`
  }
  return null
}

export function validateExpiration(expiration) {
  const value = (expiration || '').trim()
  if (!value) {
    return 'Enter the expiration date.'
  }
  if (!cardValidator.expirationDate(value).isValid) {
    return /^\d{1,2}\s*\/\s*\d{2,4}$/.test(value)
      ? 'Card has expired or the expiration date is not valid.'
      : 'Enter expiration as MM/YY.'
  }
  return null
}

export function validateCVV(cvv, cardNumber) {
  const brand = getCardBrand(cardNumber)
  const size = brand?.codeSize ?? 3
  const label = brand?.codeName ?? 'CVV'
  if (!cardValidator.cvv((cvv || '').trim(), size).isValid) {
    return `Enter the ${size}-digit ${label}${brand ? ` for ${brand.name}` : ''}.`
  }
  return null
}

export function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim())) {
    return 'Enter a valid email address (name@example.com)'
  }
  return null
}

export function validatePhone(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  if (!/^[1-9]\d{9}$/.test(digits)) {
    return 'Phone number must be exactly 10 digits and cannot start with 0'
  }
  return null
}

export function formatPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
}
