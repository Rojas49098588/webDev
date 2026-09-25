// Shared child search for the caretaker pages: matches first name, last name
// or full name, or — when the search is a 4-digit number — the birth year.
export function matchesChildSearch(child, search) {
  const text = (search || '').trim().toLowerCase()
  if (!text) {
    return true
  }

  if (/^\d{4}$/.test(text)) {
    return (child.dateOfBirth || '').startsWith(text)
  }

  const firstName = child.firstName.toLowerCase()
  const lastName = child.lastName.toLowerCase()
  return firstName.includes(text) || lastName.includes(text) || `${firstName} ${lastName}`.includes(text)
}
