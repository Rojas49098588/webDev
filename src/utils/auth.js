const CODE_LENGTH = 4
const TEMP_PASSWORD_LENGTH = 8
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const ALL_CHARS = UPPER + LOWER + DIGITS

function randomChar(charset) {
  return charset[Math.floor(Math.random() * charset.length)]
}

export function generateSecurityCode() {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += randomChar(DIGITS)
  }
  return code
}

export function validatePasswordComplexity(password) {
  if (password.length < 6) {
    return 'Password must be at least 6 characters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  return null
}

export async function hashPassword(plain) {
  const data = new TextEncoder().encode(plain)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function generateUsername(firstName, lastName, existingUsernames) {
  const base = (firstName[0] + lastName).toLowerCase().replace(/[^a-z]/g, '')
  let suffix = 1
  let candidate = `${base}${String(suffix).padStart(2, '0')}`
  while (existingUsernames.includes(candidate)) {
    suffix += 1
    candidate = `${base}${String(suffix).padStart(2, '0')}`
  }
  return candidate
}

export function generateTempPassword() {
  const required = [randomChar(UPPER), randomChar(LOWER), randomChar(DIGITS)]
  const rest = []
  for (let i = required.length; i < TEMP_PASSWORD_LENGTH; i++) {
    rest.push(randomChar(ALL_CHARS))
  }
  const chars = [...required, ...rest]
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}
