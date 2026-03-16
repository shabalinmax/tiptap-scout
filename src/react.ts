import { useEffect, useCallback, useState } from 'react'
import type { Editor } from '@tiptap/core'
import type { SearchResult } from './types'

import './scout'

export interface UseScoutReturn {
  searchTerm: string
  results: SearchResult[]
  currentIndex: number
  totalCount: number
  find: (searchTerm: string) => void
  findNext: () => void
  findPrevious: () => void
  replace: (replaceWith: string) => void
  replaceAll: (replaceWith: string) => void
  clearSearch: () => void
}

export function useScout(editor: Editor | null): UseScoutReturn {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!editor) return

    const onTransaction = () => {
      const storage = editor.storage.scout
      if (!storage) return

      setSearchTerm(storage.searchTerm)
      setResults(storage.results)
      setCurrentIndex(storage.currentIndex)
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

  return {
    searchTerm,
    results,
    currentIndex,
    totalCount: results.length,
    find,
    findNext,
    findPrevious,
    replace,
    replaceAll,
    clearSearch,
  }
}