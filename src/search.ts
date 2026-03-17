import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { SearchResult } from './types'

export function findMatches(doc: ProseMirrorNode, searchTerm: string, caseSensitive = false): SearchResult[] {
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
      }
    })

    const textToSearch = caseSensitive ? fullText : fullText.toLowerCase()
    let index = textToSearch.indexOf(term)

    while (index !== -1) {
      results.push({
        from: offsets[index],
        to: offsets[index + term.length - 1] + 1,
      })
      index = textToSearch.indexOf(term, index + 1)
    }
  })

  return results
}