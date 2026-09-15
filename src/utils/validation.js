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
