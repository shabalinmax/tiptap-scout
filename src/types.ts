import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export interface ScoutOptions {
  searchResultClass: string
  currentResultClass: string
  scrollIntoView: boolean
  liveUpdate: boolean
}

export interface ScoutStorage {
  searchTerm: string
  results: SearchResult[]
  currentIndex: number
  caseSensitive: boolean
  wholeWord: boolean
  preserveCase: boolean
}

export interface SearchResult {
  from: number
  to: number
}

export interface SearchParams {
  doc: ProseMirrorNode
  searchTerm: string
  caseSensitive?: boolean
  wholeWord?: boolean
}
