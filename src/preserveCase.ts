export function applyCase(original: string, replacement: string): string {
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }

  return replacement
}