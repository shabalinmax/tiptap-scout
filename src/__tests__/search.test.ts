import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { findMatches } from '../search'
import { createEditor } from './helpers'

let editor: Editor

afterEach(() => {
  editor?.destroy()
})

describe('findMatches', () => {
  it('finds plain text', () => {
    editor = createEditor('<p>hello world</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'world' })
    expect(results).toHaveLength(1)
    expect(editor.state.doc.textBetween(results[0].from, results[0].to)).toBe('world')
  })

  it('finds multiple occurrences', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'foo' })
    expect(results).toHaveLength(3)
  })

  it('is case-insensitive', () => {
    editor = createEditor('<p>Hello HELLO hello</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'hello' })
    expect(results).toHaveLength(3)
  })

  it('finds text across inline marks (bold)', () => {
    editor = createEditor('<p>те<strong>кст</strong></p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'текст' })
    expect(results).toHaveLength(1)
    expect(editor.state.doc.textBetween(results[0].from, results[0].to)).toBe('текст')
  })

  it('finds text with bold at the end', () => {
    editor = createEditor('<p>hel<strong>lo</strong></p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'hello' })
    expect(results).toHaveLength(1)
    expect(editor.state.doc.textBetween(results[0].from, results[0].to)).toBe('hello')
  })

  it('finds text across multiple marks', () => {
    editor = createEditor('<p>he<strong>ll</strong><em>o w</em>orld</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'hello world' })
    expect(results).toHaveLength(1)
  })

  it('does not match across a hard break', () => {
    editor = createEditor('<p>кот<br>лета</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'котлета' })
    expect(results).toHaveLength(0)
  })

  it('finds matches on both sides of a hard break', () => {
    editor = createEditor('<p>кот<br>кот</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'кот' })
    expect(results).toHaveLength(2)
  })

  it('finds text in multiple paragraphs', () => {
    editor = createEditor('<p>hello</p><p>hello</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'hello' })
    expect(results).toHaveLength(2)
  })

  it('finds text inside blockquote without duplicates', () => {
    editor = createEditor('<blockquote><p>текст</p></blockquote>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'текст' })
    expect(results).toHaveLength(1)
  })

  it('finds text in nested blockquotes without duplicates', () => {
    editor = createEditor('<blockquote><blockquote><p>текст</p></blockquote></blockquote>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'текст' })
    expect(results).toHaveLength(1)
  })

  it('returns empty array for empty search term', () => {
    editor = createEditor('<p>hello</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: '' })
    expect(results).toHaveLength(0)
  })

  it('returns empty array when no matches', () => {
    editor = createEditor('<p>hello world</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'xyz' })
    expect(results).toHaveLength(0)
  })
})

describe('findMatches wholeWord', () => {
  it('skips matches inside words', () => {
    editor = createEditor('<p>кот котлета трикотаж кот</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'кот', wholeWord: true })
    expect(results).toHaveLength(2)
  })

  it('treats punctuation and edges as word boundaries', () => {
    editor = createEditor('<p>кот, кот. (кот)</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'кот', wholeWord: true })
    expect(results).toHaveLength(3)
  })

  it('does not treat digits and underscore as boundaries', () => {
    editor = createEditor('<p>кот1 кот_2 кот</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'кот', wholeWord: true })
    expect(results).toHaveLength(1)
  })

  it('treats a hard break as a word boundary', () => {
    editor = createEditor('<p>кот<br>лета</p>')
    const results = findMatches({ doc: editor.state.doc, searchTerm: 'кот', wholeWord: true })
    expect(results).toHaveLength(1)
  })

  it('combines with caseSensitive', () => {
    editor = createEditor('<p>Кот кот котлета</p>')
    const results = findMatches({
      doc: editor.state.doc,
      searchTerm: 'кот',
      caseSensitive: true,
      wholeWord: true,
    })
    expect(results).toHaveLength(1)
  })
})

describe('setWholeWord command', () => {
  it('re-searches with word boundaries and resets index', () => {
    editor = createEditor('<p>кот котлета кот</p>')
    editor.commands.find('кот')
    editor.commands.findNext()
    expect(editor.storage.scout.results).toHaveLength(3)

    editor.commands.setWholeWord(true)
    expect(editor.storage.scout.results).toHaveLength(2)
    expect(editor.storage.scout.currentIndex).toBe(0)

    editor.commands.setWholeWord(false)
    expect(editor.storage.scout.results).toHaveLength(3)
  })
})
