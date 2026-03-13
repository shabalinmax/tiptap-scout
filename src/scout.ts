import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DecorationSet } from '@tiptap/pm/view'
import type { ScoutOptions, ScoutStorage } from './types'
import { findMatches } from './search'
import { createDecorations } from './decoration'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    scout: {
      find: (searchTerm: string) => ReturnType
      clearSearch: () => ReturnType
    }
  }
}

export const scoutPluginKey = new PluginKey('scout')

export const Scout = Extension.create<ScoutOptions, ScoutStorage>({
  name: 'scout',

  addOptions() {
    return {
      searchResultClass: 'scout-result',
      currentResultClass: 'scout-result-current',
    }
  },

  addStorage() {
    return {
      searchTerm: '',
      results: [],
      currentIndex: 0,
    }
  },

  addCommands() {
    return {
      find:
        (searchTerm: string) =>
        ({ editor }) => {
          this.storage.searchTerm = searchTerm
          this.storage.results = findMatches(editor.state.doc, searchTerm)
          this.storage.currentIndex = 0

          editor.view.dispatch(editor.state.tr)

          return true
        },

      clearSearch:
        () =>
        ({ editor }) => {
          this.storage.searchTerm = ''
          this.storage.results = []
          this.storage.currentIndex = 0

          editor.view.dispatch(editor.state.tr)

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const { storage, options } = this

    return [
      new Plugin({
        key: scoutPluginKey,

        state: {
          init() {
            return DecorationSet.empty
          },

          apply(_tr, _value, _oldState, newState) {
            return createDecorations(
              newState,
              storage.results,
              storage.currentIndex,
              options.searchResultClass,
              options.currentResultClass,
            )
          },
        },

        props: {
          decorations(state) {
            return this.getState(state) ?? DecorationSet.empty
          },
        },
      }),
    ]
  },
})
