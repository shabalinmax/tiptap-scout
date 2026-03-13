import type { Editor } from '@tiptap/core'
import type { SearchResult } from './types'

export function scrollToResult(editor: Editor, result: SearchResult) {
  const { node } = editor.view.domAtPos(result.from)
  const el = node instanceof HTMLElement ? node : node.parentElement
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}