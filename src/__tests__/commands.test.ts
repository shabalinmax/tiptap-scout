import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { createEditor } from './helpers'

let editor: Editor

afterEach(() => {
  editor?.destroy()
})

describe('find command', () => {
  it('populates storage with results', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')

    expect(editor.storage.scout.searchTerm).toBe('foo')
    expect(editor.storage.scout.results).toHaveLength(2)
    expect(editor.storage.scout.currentIndex).toBe(0)
  })

  it('resets currentIndex on new search', () => {
    editor = createEditor('<p>foo bar baz</p>')
    editor.commands.find('foo')
    editor.commands.find('bar')

    expect(editor.storage.scout.searchTerm).toBe('bar')
    expect(editor.storage.scout.results).toHaveLength(1)
    expect(editor.storage.scout.currentIndex).toBe(0)
  })
})

describe('clearSearch command', () => {
  it('clears storage', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')
    editor.commands.clearSearch()

    expect(editor.storage.scout.searchTerm).toBe('')
    expect(editor.storage.scout.results).toHaveLength(0)
    expect(editor.storage.scout.currentIndex).toBe(0)
  })
})

describe('findNext command', () => {
  it('advances currentIndex', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    editor.commands.find('foo')

    expect(editor.storage.scout.currentIndex).toBe(0)

    editor.commands.findNext()
    expect(editor.storage.scout.currentIndex).toBe(1)

    editor.commands.findNext()
    expect(editor.storage.scout.currentIndex).toBe(2)
  })

  it('cycles to first after last', () => {
    editor = createEditor('<p>foo bar foo</p>')
    editor.commands.find('foo')

    editor.commands.findNext() // → 1
    editor.commands.findNext() // → 0 (cycle)
    expect(editor.storage.scout.currentIndex).toBe(0)
  })

  it('does nothing when no results', () => {
    editor = createEditor('<p>hello</p>')
    editor.commands.find('xyz')
    editor.commands.findNext()

    expect(editor.storage.scout.currentIndex).toBe(0)
  })
})

describe('findPrevious command', () => {
  it('decrements currentIndex', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    editor.commands.find('foo')

    editor.commands.findNext() // → 1
    editor.commands.findNext() // → 2

    editor.commands.findPrevious() // → 1
    expect(editor.storage.scout.currentIndex).toBe(1)
  })

  it('cycles to last from first', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    editor.commands.find('foo')

    editor.commands.findPrevious() // → 2 (cycle)
    expect(editor.storage.scout.currentIndex).toBe(2)
  })

  it('does nothing when no results', () => {
    editor = createEditor('<p>hello</p>')
    editor.commands.find('xyz')
    editor.commands.findPrevious()

    expect(editor.storage.scout.currentIndex).toBe(0)
  })
})

describe('storage counter', () => {
  it('exposes currentIndex and total count', () => {
    editor = createEditor('<p>foo bar foo baz foo</p>')
    editor.commands.find('foo')

    expect(editor.storage.scout.results.length).toBe(3) // total = M
    expect(editor.storage.scout.currentIndex).toBe(0) // N (zero-based)

    editor.commands.findNext()
    expect(editor.storage.scout.currentIndex).toBe(1)
  })
})