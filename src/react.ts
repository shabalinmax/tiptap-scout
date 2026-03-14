import { useEffect, useCallback, useState } from 'react'
import type { Editor } from '@tiptap/core'
import type { SearchResult } from './types'

import './scout'

export interface UseScoutReturn {
  results: SearchResult[]
  currentIndex: number
  totalCount: number
  find: (searchTerm: string) => void
  findNext: () => void
  findPrevious: () => void
  clearSearch: () => void
}

export function useScout(editor: Editor | null): UseScoutReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!editor) return

    const onTransaction = () => {
      const storage = editor.storage.scout
      if (!storage) return

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

  const clearSearch = useCallback(
    () => editor?.commands.clearSearch(),
    [editor],
  )

  return {
    results,
    currentIndex,
    totalCount: results.length,
    find,
    findNext,
    findPrevious,
    clearSearch,
  }
}