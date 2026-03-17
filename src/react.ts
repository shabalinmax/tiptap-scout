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
  preserveCase: boolean
  find: (searchTerm: string) => void
  findNext: () => void
  findPrevious: () => void
  replace: (replaceWith: string) => void
  replaceAll: (replaceWith: string) => void
  clearSearch: () => void
  setCaseSensitive: (value: boolean) => void
  setPreserveCase: (value: boolean) => void
}

export function useScout(editor: Editor | null): UseScoutReturn {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [caseSensitive, setCaseSensitiveState] = useState(false)
  const [preserveCase, setPreserveCaseState] = useState(false)

  useEffect(() => {
    if (!editor) return

    const onTransaction = () => {
      const storage = editor.storage.scout
      if (!storage) return

      setSearchTerm(storage.searchTerm)
      setResults(storage.results)
      setCurrentIndex(storage.currentIndex)
      setCaseSensitiveState(storage.caseSensitive)
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

  const setCaseSensitive = useCallback(
    (value: boolean) => editor?.commands.setCaseSensitive(value),
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
    preserveCase,
    find,
    findNext,
    findPrevious,
    replace,
    replaceAll,
    clearSearch,
    setCaseSensitive,
    setPreserveCase,
  }
}