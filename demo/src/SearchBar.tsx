import { useState } from 'react'
import { useScout } from '@shabalinmax/tiptap-scout/react'
import type { Editor } from '@tiptap/core'

export function SearchBar({ editor }: { editor: Editor | null }) {
  const [replaceValue, setReplaceValue] = useState('')
  const {
    searchTerm,
    currentIndex,
    totalCount,
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
  } = useScout(editor)

  return (
    <div className="search-bar">
      <div className="search-row">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => find(e.target.value)}
        />
        <button
          className={`toggle-btn ${caseSensitive ? 'active' : ''}`}
          onClick={() => setCaseSensitive(!caseSensitive)}
          title="Match Case"
        >
          Aa
        </button>
        <span className="counter">
          {totalCount > 0 ? `${currentIndex + 1} / ${totalCount}` : 'No results'}
        </span>
        <button onClick={findPrevious} disabled={totalCount === 0}>Prev</button>
        <button onClick={findNext} disabled={totalCount === 0}>Next</button>
        <button onClick={clearSearch}>Clear</button>
      </div>
      <div className="replace-row">
        <input
          type="text"
          placeholder="Replace with..."
          value={replaceValue}
          onChange={(e) => setReplaceValue(e.target.value)}
        />
        <button
          className={`toggle-btn ${preserveCase ? 'active' : ''}`}
          onClick={() => setPreserveCase(!preserveCase)}
          title="Preserve Case"
        >
          AB
        </button>
        <button onClick={() => replace(replaceValue)} disabled={totalCount === 0}>Replace</button>
        <button onClick={() => replaceAll(replaceValue)} disabled={totalCount === 0}>Replace All</button>
      </div>
    </div>
  )
}