# @shabalinmax/tiptap-scout

Search and replace extension for [Tiptap 3](https://tiptap.dev/).

Existing alternatives are outdated and built for Tiptap 2. This package is designed for Tiptap 3 from the ground up.

[README на русском](./README.ru.md)

## Features

- Case-insensitive text search
- Search works correctly across inline marks (bold, italic, links, etc.)
- Match highlighting via ProseMirror Decorations
- Customizable CSS classes — no styles imposed
- State available via `editor.storage.scout`
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

// Clear search
editor.commands.clearSearch()

// Access state
const { searchTerm, results, currentIndex } = editor.storage.scout
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

## Commands

| Command | Parameters | Description |
| --- | --- | --- |
| `find` | `searchTerm: string` | Search for text (case-insensitive) |
| `clearSearch` | — | Clear search results and decorations |

## Storage (`editor.storage.scout`)

| Field | Type | Description |
| --- | --- | --- |
| `searchTerm` | `string` | Current search term |
| `results` | `SearchResult[]` | Array of `{ from, to }` positions |
| `currentIndex` | `number` | Index of the current match |

## Roadmap

- `findNext` / `findPrevious` commands with cyclic navigation
- `replace` / `replaceAll` commands
- Case-sensitive, whole word, and regex search modes
- Live update on document changes

## License

MIT