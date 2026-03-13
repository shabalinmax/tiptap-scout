export interface ScoutOptions {
  searchResultClass: string
  currentResultClass: string
}

export interface ScoutStorage {
  searchTerm: string
  results: SearchResult[]
  currentIndex: number
}

export interface SearchResult {
  from: number
  to: number
}
