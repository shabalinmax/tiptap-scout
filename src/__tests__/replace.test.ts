import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { createEditor } from './helpers'

let editor: Editor

afterEach(() => {
  editor?.destroy()
})

describe('replace command', () => {
  it('replaces the current match', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')
    editor.commands.replace('baz')

    expect(editor.state.doc.textContent).toBe('baz bar foo')
  })

  it('advances to next match after replace', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    editor.commands.find('foo')
    editor.commands.replace('qux')

    expect(editor.storage.scout.currentIndex).toBe(0)
    expect(editor.state.doc.textContent).toBe('qux bar foo baz foo')
  })

  it('replaces sequentially', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')
    editor.commands.replace('baz')
    editor.commands.replace('qux')

    expect(editor.state.doc.textContent).toBe('baz bar qux')
  })

  it('does nothing when no results', () => {
    editor = createEditor('<p>hello world</p>')
    editor.commands.find('xyz')
    editor.commands.replace('abc')

    expect(editor.state.doc.textContent).toBe('hello world')
  })

  it('updates results after replace', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')
    editor.commands.replace('baz')

    expect(editor.storage.scout.results).toHaveLength(1)
  })

  it('clears search when last match is replaced', () => {
    editor = createEditor('<p>foo bar</p>')
    editor.commands.find('foo')
    editor.commands.replace('baz')

    expect(editor.storage.scout.results).toHaveLength(0)
    expect(editor.state.doc.textContent).toBe('baz bar')
  })

  it('replaces text with bold marks correctly', () => {
    editor = createEditor('<p>he<strong>ll</strong>o world</p>')
    editor.commands.find('hello')
    editor.commands.replace('goodbye')

    expect(editor.state.doc.textContent).toBe('goodbye world')
  })
})

describe('replaceAll command', () => {
  it('replaces all matches', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    editor.commands.find('foo')
    editor.commands.replaceAll('qux')

    expect(editor.state.doc.textContent).toBe('qux bar qux baz qux')
  })

  it('clears results after replaceAll', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')
    editor.commands.replaceAll('baz')

    expect(editor.storage.scout.results).toHaveLength(0)
    expect(editor.storage.scout.searchTerm).toBe('')
  })

  it('does nothing when no results', () => {
    editor = createEditor('<p>hello world</p>')
    editor.commands.find('xyz')
    editor.commands.replaceAll('abc')

    expect(editor.state.doc.textContent).toBe('hello world')
  })

  it('replaces across multiple paragraphs', () => {
    editor = createEditor('<p>foo bar</p><p>baz foo</p>')
    editor.commands.find('foo')
    editor.commands.replaceAll('qux')

    expect(editor.state.doc.textContent).toBe('qux barbaz qux')
  })

  it('is undoable in one step', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    editor.commands.find('foo')
    editor.commands.replaceAll('qux')

    expect(editor.state.doc.textContent).toBe('qux bar qux baz qux')

    editor.commands.undo()

    expect(editor.state.doc.textContent).toBe('foo bar foo baz foo')
  })

  it('replaces with different length text', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')
    editor.commands.replaceAll('longer text')

    expect(editor.state.doc.textContent).toBe('longer text bar longer text')
  })
})