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

export function validateCardNumber(cardNumber) {
  const digits = (cardNumber || '').replace(/\s+/g, '')
  if (!/^\d{13,19}$/.test(digits)) {
    return 'Enter a valid card number'
  }
  return null
}

export function validateExpiration(expiration) {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiration || '')
  if (!match) {
    return 'Enter expiration as MM/YY'
  }
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) {
    return 'Enter a valid expiration month'
  }
  const expiresAt = new Date(year, month, 1)
  if (expiresAt.getTime() <= Date.now()) {
    return 'Card has expired'
  }
  return null
}

export function validateCVV(cvv) {
  if (!/^\d{3,4}$/.test(cvv || '')) {
    return 'Enter a valid CVV'
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
