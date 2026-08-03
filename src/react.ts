import { useEffect, useCallback, useState } from 'react'
import type { Editor } from '@tiptap/core'
import type { SearchResult } from './types'

import './scout'

export interface UseScoutReturn {
  searchTerm: string
  results: SearchResult[]
  currentIndex: number
  totalCount: number
  caseSensitive: boolean
  wholeWord: boolean
  preserveCase: boolean
  find: (searchTerm: string) => void
  findNext: () => void
  findPrevious: () => void
  replace: (replaceWith: string) => void
  replaceAll: (replaceWith: string) => void
  clearSearch: () => void
  resetSearch: () => void
  setCaseSensitive: (value: boolean) => void
  setWholeWord: (value: boolean) => void
  setPreserveCase: (value: boolean) => void
}

export function useScout(editor: Editor | null): UseScoutReturn {
  // Seed from storage: the consumer may unmount the search UI without resetting
  // the search state, and on remount local literals would disagree with the
  // actual search behavior
  const scoutStorage = editor?.storage.scout
  const [searchTerm, setSearchTerm] = useState(scoutStorage?.searchTerm ?? '')
  const [results, setResults] = useState<SearchResult[]>(scoutStorage?.results ?? [])
  const [currentIndex, setCurrentIndex] = useState(scoutStorage?.currentIndex ?? 0)
  const [caseSensitive, setCaseSensitiveState] = useState(scoutStorage?.caseSensitive ?? false)
  const [wholeWord, setWholeWordState] = useState(scoutStorage?.wholeWord ?? false)
  const [preserveCase, setPreserveCaseState] = useState(scoutStorage?.preserveCase ?? false)

  useEffect(() => {
    if (!editor) return

    const onTransaction = () => {
      const storage = editor.storage.scout
      if (!storage) return

      setSearchTerm(storage.searchTerm)
      setResults(storage.results)
      setCurrentIndex(storage.currentIndex)
      setCaseSensitiveState(storage.caseSensitive)
      setWholeWordState(storage.wholeWord)
      setPreserveCaseState(storage.preserveCase)
    }

    editor.on('transaction', onTransaction)
    return () => {
      editor.off('transaction', onTransaction)
    }
  }, [editor])

  const find = useCallback(
    (searchTerm: string) => editor?.commands.find(searchTerm),
    [editor],
  )

  const findNext = useCallback(
    () => editor?.commands.findNext(),
    [editor],
  )

  const findPrevious = useCallback(
    () => editor?.commands.findPrevious(),
    [editor],
  )

  const replace = useCallback(
    (replaceWith: string) => editor?.commands.replace(replaceWith),
    [editor],
  )

  const replaceAll = useCallback(
    (replaceWith: string) => editor?.commands.replaceAll(replaceWith),
    [editor],
  )

  const clearSearch = useCallback(
    () => editor?.commands.clearSearch(),
    [editor],
  )

  const resetSearch = useCallback(
    () => editor?.commands.resetSearch(),
    [editor],
  )

  const setCaseSensitive = useCallback(
    (value: boolean) => editor?.commands.setCaseSensitive(value),
    [editor],
  )

  const setWholeWord = useCallback(
    (value: boolean) => editor?.commands.setWholeWord(value),
    [editor],
  )

  const setPreserveCase = useCallback(
    (value: boolean) => editor?.commands.setPreserveCase(value),
    [editor],
  )

  return {
    searchTerm,
    results,
    currentIndex,
    totalCount: results.length,
    caseSensitive,
    wholeWord,
    preserveCase,
    find,
    findNext,
    findPrevious,
    replace,
    replaceAll,
    clearSearch,
    resetSearch,
    setCaseSensitive,
    setWholeWord,
    setPreserveCase,
  }
}
