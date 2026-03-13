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
    const results = findMatches(editor.state.doc, 'world')
    expect(results).toHaveLength(1)
    expect(editor.state.doc.textBetween(results[0].from, results[0].to)).toBe('world')
  })

  it('finds multiple occurrences', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    const results = findMatches(editor.state.doc, 'foo')
    expect(results).toHaveLength(3)
  })

  it('is case-insensitive', () => {
    editor = createEditor('<p>Hello HELLO hello</p>')
    const results = findMatches(editor.state.doc, 'hello')
    expect(results).toHaveLength(3)
  })

  it('finds text across inline marks (bold)', () => {
    editor = createEditor('<p>те<strong>кст</strong></p>')
    const results = findMatches(editor.state.doc, 'текст')
    expect(results).toHaveLength(1)
    expect(editor.state.doc.textBetween(results[0].from, results[0].to)).toBe('текст')
  })

  it('finds text with bold at the end', () => {
    editor = createEditor('<p>hel<strong>lo</strong></p>')
    const results = findMatches(editor.state.doc, 'hello')
    expect(results).toHaveLength(1)
    expect(editor.state.doc.textBetween(results[0].from, results[0].to)).toBe('hello')
  })

  it('finds text across multiple marks', () => {
    editor = createEditor('<p>he<strong>ll</strong><em>o w</em>orld</p>')
    const results = findMatches(editor.state.doc, 'hello world')
    expect(results).toHaveLength(1)
  })

  it('finds text in multiple paragraphs', () => {
    editor = createEditor('<p>hello</p><p>hello</p>')
    const results = findMatches(editor.state.doc, 'hello')
    expect(results).toHaveLength(2)
  })

  it('finds text inside blockquote without duplicates', () => {
    editor = createEditor('<blockquote><p>текст</p></blockquote>')
    const results = findMatches(editor.state.doc, 'текст')
    expect(results).toHaveLength(1)
  })

  it('finds text in nested blockquotes without duplicates', () => {
    editor = createEditor('<blockquote><blockquote><p>текст</p></blockquote></blockquote>')
    const results = findMatches(editor.state.doc, 'текст')
    expect(results).toHaveLength(1)
  })

  it('returns empty array for empty search term', () => {
    editor = createEditor('<p>hello</p>')
    const results = findMatches(editor.state.doc, '')
    expect(results).toHaveLength(0)
  })

  it('returns empty array when no matches', () => {
    editor = createEditor('<p>hello world</p>')
    const results = findMatches(editor.state.doc, 'xyz')
    expect(results).toHaveLength(0)
  })
})