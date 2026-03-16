import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Scout } from '@shabalinmax/tiptap-scout'
import { SearchBar } from './SearchBar'
import './App.css'

const content = `
<h2>Tiptap Scout Demo</h2>
<p>This is a <strong>demo</strong> of the search and replace extension for Tiptap 3.</p>
<p>Try searching for "demo" or "tiptap" — the matches will be highlighted.</p>
<p>You can also test <em>search across</em> inline marks like <strong>bold</strong>, <em>italic</em>, and <strong><em>bold italic</em></strong>.</p>
<blockquote><p>Search also works inside blockquotes without duplicates.</p></blockquote>
<p>Type new text and see how <strong>live update</strong> recalculates matches in real time.</p>
`

function App() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Scout.configure({
        searchResultClass: 'scout-result',
        currentResultClass: 'scout-result-current',
        scrollIntoView: true,
        liveUpdate: true,
      }),
    ],
    content,
  })

  return (
    <div className="app">
      <h1>@shabalinmax/tiptap-scout</h1>
      <SearchBar editor={editor} />
      <EditorContent editor={editor} className="editor" />
    </div>
  )
}

export default App