import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DecorationSet } from '@tiptap/pm/view'
import type { ScoutOptions, ScoutStorage } from './types'
import { findMatches } from './search'
import { createDecorations } from './decoration'
import { scrollToResult } from './scroll'
import { applyCase } from './preserveCase'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    scout: {
      find: (searchTerm: string) => ReturnType
      findNext: () => ReturnType
      findPrevious: () => ReturnType
      replace: (replaceWith: string) => ReturnType
      replaceAll: (replaceWith: string) => ReturnType
      clearSearch: () => ReturnType
      resetSearch: () => ReturnType
      setCaseSensitive: (value: boolean) => ReturnType
      setWholeWord: (value: boolean) => ReturnType
      setPreserveCase: (value: boolean) => ReturnType
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
      caseSensitive: false,
      wholeWord: false,
      preserveCase: false,
    }
  },

  addCommands() {
    return {
      find:
        (searchTerm: string) =>
        ({ editor, tr }) => {
          this.storage.searchTerm = searchTerm
          this.storage.results = findMatches({
            doc: editor.state.doc,
            searchTerm,
            caseSensitive: this.storage.caseSensitive,
            wholeWord: this.storage.wholeWord,
          })
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
          const { results, currentIndex, searchTerm, caseSensitive, wholeWord, preserveCase } = this.storage
          if (results.length === 0) return false

          const { from, to } = results[currentIndex]
          let text = replaceWith
          if (preserveCase) {
            const original = editor.state.doc.textBetween(from, to)
            text = applyCase(original, replaceWith)
          }
          tr.insertText(text, from, to)

          // Re-search in the doc after applying the replacement
          const newDoc = tr.doc
          const newResults = findMatches({ doc: newDoc, searchTerm, caseSensitive, wholeWord })
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
        ({ editor, tr }) => {
          const { results, searchTerm, caseSensitive, wholeWord, preserveCase } = this.storage
          if (results.length === 0) return false

          // Replace all in a single transaction (from last to first to preserve positions)
          for (let i = results.length - 1; i >= 0; i--) {
            let text = replaceWith
            if (preserveCase) {
              const original = editor.state.doc.textBetween(results[i].from, results[i].to)
              text = applyCase(original, replaceWith)
            }
            tr.insertText(text, results[i].from, results[i].to)
          }

          // Re-search in the doc after applying replacements (keep searchTerm for undo support)
          const newResults = findMatches({ doc: tr.doc, searchTerm, caseSensitive, wholeWord })
          this.storage.results = newResults
          this.storage.currentIndex = 0

          return true
        },

      setCaseSensitive:
        (value: boolean) =>
        ({ editor }) => {
          this.storage.caseSensitive = value
          if (this.storage.searchTerm) {
            this.storage.results = findMatches({
              doc: editor.state.doc,
              searchTerm: this.storage.searchTerm,
              caseSensitive: value,
              wholeWord: this.storage.wholeWord,
            })
            this.storage.currentIndex = 0
          }
          return true
        },

      setWholeWord:
        (value: boolean) =>
        ({ editor }) => {
          this.storage.wholeWord = value
          if (this.storage.searchTerm) {
            this.storage.results = findMatches({
              doc: editor.state.doc,
              searchTerm: this.storage.searchTerm,
              caseSensitive: this.storage.caseSensitive,
              wholeWord: value,
            })
            this.storage.currentIndex = 0
          }
          return true
        },

      setPreserveCase:
        (value: boolean) =>
        () => {
          this.storage.preserveCase = value
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

      // Unlike clearSearch (which keeps the search flags for the next query),
      // this also drops the flags — for closing the search UI
      resetSearch:
        () =>
        ({ commands }) => {
          this.storage.caseSensitive = false
          this.storage.wholeWord = false
          this.storage.preserveCase = false

          return commands.clearSearch()
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
              storage.results = findMatches({
                doc: newState.doc,
                searchTerm: storage.searchTerm,
                caseSensitive: storage.caseSensitive,
                wholeWord: storage.wholeWord,
              })
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
