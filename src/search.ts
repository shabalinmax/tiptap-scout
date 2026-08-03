import type { SearchParams, SearchResult } from './types'

const isWordChar = (ch: string | undefined) => Boolean(ch) && /[\p{L}\p{N}_]/u.test(ch!)

export function findMatches({
  doc,
  searchTerm,
  caseSensitive = false,
  wholeWord = false,
}: SearchParams): SearchResult[] {
  if (!searchTerm) return []

  const results: SearchResult[] = []
  const term = caseSensitive ? searchTerm : searchTerm.toLowerCase()

  doc.descendants((node, pos) => {
    if (!node.isBlock) return
    // Skip container blocks (blockquote, list, etc.) — search only in leaf blocks (paragraph, heading)
    // Their child paragraphs will be visited separately by descendants()
    if (node.childCount > 0 && node.firstChild!.isBlock) return

    // Collect full text content of the block by concatenating all text nodes
    let fullText = ''
    const offsets: number[] = [] // maps char index in fullText → absolute doc position

    node.descendants((child, childPos) => {
      if (child.isText && child.text) {
        for (let i = 0; i < child.text.length; i++) {
          offsets.push(pos + 1 + childPos + i)
        }
        fullText += child.text
        return
      }
      // Non-text inline node (hardBreak, image, etc.): without a placeholder the text
      // on both sides would be glued together — a match would span the node and
      // replace would silently delete it. U+FFFC can't occur in a search term.
      offsets.push(pos + 1 + childPos)
      fullText += '\uFFFC'
    })

    const textToSearch = caseSensitive ? fullText : fullText.toLowerCase()
    let index = textToSearch.indexOf(term)

    while (index !== -1) {
      if (!wholeWord || (!isWordChar(fullText[index - 1]) && !isWordChar(fullText[index + term.length]))) {
        results.push({
          from: offsets[index],
          to: offsets[index + term.length - 1] + 1,
        })
      }
      index = textToSearch.indexOf(term, index + 1)
    }
  })

  return results
}
