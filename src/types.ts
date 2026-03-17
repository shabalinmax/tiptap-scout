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
  preserveCase: boolean
}

export interface SearchResult {
  from: number
  to: number
}
