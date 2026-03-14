import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DecorationSet } from '@tiptap/pm/view'
import type { ScoutOptions, ScoutStorage } from './types'
import { findMatches } from './search'
import { createDecorations } from './decoration'
import { scrollToResult } from './scroll'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    scout: {
      find: (searchTerm: string) => ReturnType
      findNext: () => ReturnType
      findPrevious: () => ReturnType
      replace: (replaceWith: string) => ReturnType
      replaceAll: (replaceWith: string) => ReturnType
      clearSearch: () => ReturnType
    }
  }

  interface Storage {
    scout: ScoutStorage
  }
}

export const scoutPluginKey = new PluginKey('scout')

export const Scout = Extension.create<ScoutOptions, ScoutStorage>({
  name: 'scout',

  addOptions() {
    return {
      searchResultClass: 'scout-result',
      currentResultClass: 'scout-result-current',
      scrollIntoView: false,
      liveUpdate: false,
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
        ({ editor, tr }) => {
          this.storage.searchTerm = searchTerm
          this.storage.results = findMatches(editor.state.doc, searchTerm)
          this.storage.currentIndex = 0

          if (this.options.scrollIntoView && this.storage.results.length > 0) {
            scrollToResult(editor, this.storage.results[0])
          }

          return true
        },

      findNext:
        () =>
        ({ editor, tr }) => {
          const { results } = this.storage
          if (results.length === 0) return false

          this.storage.currentIndex = (this.storage.currentIndex + 1) % results.length

          if (this.options.scrollIntoView) {
            scrollToResult(editor, results[this.storage.currentIndex])
          }

          return true
        },

      findPrevious:
        () =>
        ({ editor, tr }) => {
          const { results } = this.storage
          if (results.length === 0) return false

          this.storage.currentIndex = (this.storage.currentIndex - 1 + results.length) % results.length

          if (this.options.scrollIntoView) {
            scrollToResult(editor, results[this.storage.currentIndex])
          }

          return true
        },

      replace:
        (replaceWith: string) =>
        ({ editor, tr }) => {
          const { results, currentIndex, searchTerm } = this.storage
          if (results.length === 0) return false

          const { from, to } = results[currentIndex]
          tr.insertText(replaceWith, from, to)

          // Re-search in the doc after applying the replacement
          const newDoc = tr.doc
          const newResults = findMatches(newDoc, searchTerm)
          this.storage.results = newResults

          if (newResults.length === 0) {
            this.storage.searchTerm = ''
            this.storage.currentIndex = 0
          } else {
            this.storage.currentIndex = Math.min(currentIndex, newResults.length - 1)
          }

          return true
        },

      replaceAll:
        (replaceWith: string) =>
        ({ tr }) => {
          const { results } = this.storage
          if (results.length === 0) return false

          // Replace all in a single transaction (from last to first to preserve positions)
          for (let i = results.length - 1; i >= 0; i--) {
            tr.insertText(replaceWith, results[i].from, results[i].to)
          }

          this.storage.searchTerm = ''
          this.storage.results = []
          this.storage.currentIndex = 0

          return true
        },

      clearSearch:
        () =>
        () => {
          this.storage.searchTerm = ''
          this.storage.results = []
          this.storage.currentIndex = 0

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

          apply(tr, _value, _oldState, newState) {
            if (options.liveUpdate && tr.docChanged && storage.searchTerm) {
              storage.results = findMatches(newState.doc, storage.searchTerm)
              if (storage.results.length === 0) {
                storage.currentIndex = 0
              } else if (storage.currentIndex >= storage.results.length) {
                storage.currentIndex = storage.results.length - 1
              }
            }

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
