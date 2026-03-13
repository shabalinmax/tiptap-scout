import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Scout } from '../scout'
import type { ScoutOptions } from '../types'

export function createEditor(content: string, scoutOptions?: Partial<ScoutOptions>) {
  return new Editor({
    extensions: [
      StarterKit,
      Scout.configure(scoutOptions),
    ],
    content,
  })
}