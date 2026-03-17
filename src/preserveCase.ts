export function applyCase(original: string, replacement: string): string {
  if (!replacement) return replacement

  const isUpperCase = (ch: string) => ch === ch.toUpperCase() && ch !== ch.toLowerCase()
  const isLowerCase = (ch: string) => ch === ch.toLowerCase() && ch !== ch.toUpperCase()

  // All uppercase → HELLO
  if (original.length > 1 && original === original.toUpperCase() && original !== original.toLowerCase()) {
    return replacement.toUpperCase()
  }

  // Starts with uppercase → Hello
  if (isUpperCase(original[0])) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }

  // Starts with lowercase → hello
  if (isLowerCase(original[0])) {
    return replacement[0].toLowerCase() + replacement.slice(1)
  }

  return replacement
}