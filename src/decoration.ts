import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { EditorState } from '@tiptap/pm/state'
import type { SearchResult } from './types'

export function createDecorations(
  state: EditorState,
  results: SearchResult[],
  currentIndex: number,
  searchResultClass: string,
  currentResultClass: string,
): DecorationSet {
  if (results.length === 0) return DecorationSet.empty

  const decorations = results.map((result, i) => {
    const className = i === currentIndex ? currentResultClass : searchResultClass
    return Decoration.inline(result.from, result.to, { class: className })
  })

  return DecorationSet.create(state.doc, decorations)
}
