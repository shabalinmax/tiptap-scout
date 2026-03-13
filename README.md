# @shabalinmax/tiptap-scout

Search and replace extension for [Tiptap 3](https://tiptap.dev/).

Existing alternatives are outdated and built for Tiptap 2. This package is designed for Tiptap 3 from the ground up.

[README на русском](./README.ru.md)

## Features

- Case-insensitive text search
- Search works correctly across inline marks (bold, italic, links, etc.)
- Match highlighting via ProseMirror Decorations
- `findNext` / `findPrevious` with cyclic navigation
- Optional scroll into view on navigation
- Counter "N of M" via `editor.storage.scout`
- Customizable CSS classes — no styles imposed
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
    }),
  ],
})

// Search
editor.commands.find('hello')

// Navigate between matches
editor.commands.findNext()
editor.commands.findPrevious()

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

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `searchResultClass` | `string` | `'scout-result'` | CSS class for all matches |
| `currentResultClass` | `string` | `'scout-result-current'` | CSS class for the current match |
| `scrollIntoView` | `boolean` | `false` | Scroll to the current match on navigation |

## Commands

| Command | Parameters | Description |
| --- | --- | --- |
| `find` | `searchTerm: string` | Search for text (case-insensitive) |
| `findNext` | — | Navigate to the next match (cyclic) |
| `findPrevious` | — | Navigate to the previous match (cyclic) |
| `clearSearch` | — | Clear search results and decorations |

## Storage (`editor.storage.scout`)

| Field | Type | Description |
| --- | --- | --- |
| `searchTerm` | `string` | Current search term |
| `results` | `SearchResult[]` | Array of `{ from, to }` positions |
| `currentIndex` | `number` | Index of the current match |

## Roadmap

- `replace` / `replaceAll` commands
- Case-sensitive, whole word, and regex search modes
- Live update on document changes

## License

MIT