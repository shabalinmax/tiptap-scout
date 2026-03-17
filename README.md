# @shabalinmax/tiptap-scout

Search and replace extension for [Tiptap 3](https://tiptap.dev/).

Existing alternatives are outdated and built for Tiptap 2. This package is designed for Tiptap 3 from the ground up.

[Live Demo](https://shabalinmax.github.io/tiptap-scout/) | [GitHub](https://github.com/shabalinmax/tiptap-scout) | [README on Russian](./README.ru.md)

## Features

- Case-insensitive text search
- Search works correctly across inline marks (bold, italic, links, etc.)
- Match highlighting via ProseMirror Decorations
- `findNext` / `findPrevious` with cyclic navigation
- `replace` / `replaceAll` with proper undo/redo support
- Optional scroll into view on navigation
- Live update — automatic re-search on document changes
- Counter "N of M" via `editor.storage.scout`
- Customizable CSS classes — no styles imposed
- React hook `useScout` for reactive state
- Full TypeScript support with command autocompletion

## Installation

```bash
npm install @shabalinmax/tiptap-scout
```

### Peer dependencies

```bash
npm install @tiptap/core @tiptap/pm
```

## Usage

```ts
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Scout } from '@shabalinmax/tiptap-scout'

const editor = new Editor({
  extensions: [
    StarterKit,
    Scout.configure({
      searchResultClass: 'search-highlight',
      currentResultClass: 'search-highlight-current',
      scrollIntoView: true,
      liveUpdate: true,
    }),
  ],
})

// Search
editor.commands.find('hello')

// Navigate between matches
editor.commands.findNext()
editor.commands.findPrevious()

// Replace
editor.commands.replace('world')
editor.commands.replaceAll('world')

// Clear search
editor.commands.clearSearch()

// Access state (e.g. to display "2 of 5")
const { searchTerm, results, currentIndex } = editor.storage.scout
console.log(`${currentIndex + 1} of ${results.length}`)
```

### CSS

The extension does not include any styles. Add your own:

```css
.search-highlight {
  background-color: yellow;
}

.search-highlight-current {
  background-color: orange;
}
```

## React

```tsx
import { useState } from 'react'
import { Scout } from '@shabalinmax/tiptap-scout'
import { useScout } from '@shabalinmax/tiptap-scout/react'

function SearchBar({ editor }) {
  const [replaceValue, setReplaceValue] = useState('')
  const {
    searchTerm,
    currentIndex,
    totalCount,
    find,
    findNext,
    findPrevious,
    replace,
    replaceAll,
    clearSearch,
  } = useScout(editor)

  return (
    <div>
      <input value={searchTerm} onChange={(e) => find(e.target.value)} />
      <span>{totalCount > 0 ? `${currentIndex + 1} of ${totalCount}` : 'No results'}</span>
      <button onClick={findPrevious}>Prev</button>
      <button onClick={findNext}>Next</button>
      <input value={replaceValue} onChange={(e) => setReplaceValue(e.target.value)} />
      <button onClick={() => replace(replaceValue)}>Replace</button>
      <button onClick={() => replaceAll(replaceValue)}>Replace All</button>
      <button onClick={clearSearch}>Clear</button>
    </div>
  )
}
```

React is an optional peer dependency — it won't be required for non-React projects.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `searchResultClass` | `string` | `'scout-result'` | CSS class for all matches |
| `currentResultClass` | `string` | `'scout-result-current'` | CSS class for the current match |
| `scrollIntoView` | `boolean` | `false` | Scroll to the current match on navigation |
| `liveUpdate` | `boolean` | `false` | Re-search automatically when the document changes |

## Commands

| Command | Parameters | Description |
| --- | --- | --- |
| `find` | `searchTerm: string` | Search for text (case-insensitive) |
| `findNext` | — | Navigate to the next match (cyclic) |
| `findPrevious` | — | Navigate to the previous match (cyclic) |
| `replace` | `replaceWith: string` | Replace the current match |
| `replaceAll` | `replaceWith: string` | Replace all matches (single undo step) |
| `clearSearch` | — | Clear search results and decorations |

## Storage (`editor.storage.scout`)

| Field | Type | Description |
| --- | --- | --- |
| `searchTerm` | `string` | Current search term |
| `results` | `SearchResult[]` | Array of `{ from, to }` positions |
| `currentIndex` | `number` | Index of the current match (zero-based) |

## Roadmap

- Case-sensitive, whole word, and regex search modes
- Capture groups ($1, $2) in replacement string
- Search/replace within selection
- Preserve case on replace (Foo→Bar, foo→bar, FOO→BAR)

## License

MIT