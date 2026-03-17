import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { applyCase } from '../preserveCase'
import { createEditor } from './helpers'

// Unit tests for applyCase
describe('applyCase', () => {
  it('lowercases replacement when original starts with lowercase', () => {
    expect(applyCase('привет', 'Hello')).toBe('hello')
  })

  it('uppercases first letter when original starts with uppercase', () => {
    expect(applyCase('Привет', 'hello')).toBe('Hello')
  })

  it('uppercases entire replacement when original is all uppercase', () => {
    expect(applyCase('ПРИВЕТ', 'hello')).toBe('HELLO')
  })

  it('preserves replacement case when original is mixed case (not all upper, starts upper)', () => {
    expect(applyCase('Привет', 'hELLO')).toBe('HELLO')
  })

  it('handles single character original (uppercase)', () => {
    expect(applyCase('A', 'hello')).toBe('Hello')
  })

  it('handles single character original (lowercase)', () => {
    expect(applyCase('a', 'Hello')).toBe('hello')
  })

  it('returns replacement as-is when original has no casing (numbers)', () => {
    expect(applyCase('123', 'Hello')).toBe('Hello')
  })

  it('handles empty replacement', () => {
    expect(applyCase('Hello', '')).toBe('')
  })
})

// Integration tests with editor
let editor: Editor

afterEach(() => {
  editor?.destroy()
})

describe('replace with preserveCase', () => {
  it('lowercases replacement when original is lowercase', () => {
    editor = createEditor('<p>привет мир</p>')
    editor.commands.find('привет')
    editor.commands.setPreserveCase(true)
    editor.commands.replace('Hello')

    expect(editor.state.doc.textContent).toBe('hello мир')
  })

  it('capitalizes replacement when original starts with uppercase', () => {
    editor = createEditor('<p>Hello world</p>')
    editor.commands.find('Hello')
    editor.commands.setPreserveCase(true)
    editor.commands.replace('привет')

    expect(editor.state.doc.textContent).toBe('Привет world')
  })

  it('uppercases entire replacement when original is all uppercase', () => {
    editor = createEditor('<p>HELLO world</p>')
    editor.commands.find('HELLO')
    editor.commands.setPreserveCase(true)
    editor.commands.replace('привет')

    expect(editor.state.doc.textContent).toBe('ПРИВЕТ world')
  })

  it('does not alter case when preserveCase is off', () => {
    editor = createEditor('<p>привет мир</p>')
    editor.commands.find('привет')
    editor.commands.setPreserveCase(false)
    editor.commands.replace('Hello')

    expect(editor.state.doc.textContent).toBe('Hello мир')
  })
})

describe('replaceAll with preserveCase', () => {
  it('applies case preservation to each match individually', () => {
    editor = createEditor('<p>Hello HELLO hello</p>')
    editor.commands.find('hello')
    editor.commands.setPreserveCase(true)
    editor.commands.replaceAll('world')

    expect(editor.state.doc.textContent).toBe('World WORLD world')
  })
})