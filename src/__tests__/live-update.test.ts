import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Scout } from '../scout'

let editor: Editor

afterEach(() => {
  editor?.destroy()
})

describe('liveUpdate: false (default)', () => {
  it('does not re-search when document changes', () => {
    editor = new Editor({
      extensions: [StarterKit, Scout],
      content: '<p>foo bar foo</p>',
    })

    editor.commands.find('foo')
    expect(editor.storage.scout.results).toHaveLength(2)

    // Type text — positions shift but results are NOT recalculated
    editor.commands.insertContentAt(1, 'hello ')
    expect(editor.storage.scout.results).toHaveLength(2) // stale results
  })
})

describe('liveUpdate: true', () => {
  it('re-searches when document changes', () => {
    editor = new Editor({
      extensions: [
        StarterKit,
        Scout.configure({ liveUpdate: true }),
      ],
      content: '<p>foo bar foo</p>',
    })

    editor.commands.find('foo')
    expect(editor.storage.scout.results).toHaveLength(2)

    // Type text that adds another "foo"
    editor.commands.insertContentAt(1, 'foo ')
    expect(editor.storage.scout.results).toHaveLength(3)
  })

  it('updates positions after edits', () => {
    editor = new Editor({
      extensions: [
        StarterKit,
        Scout.configure({ liveUpdate: true }),
      ],
      content: '<p>foo bar</p>',
    })

    editor.commands.find('bar')
    expect(editor.storage.scout.results).toHaveLength(1)
    const posBefore = editor.storage.scout.results[0].from

    // Insert text before "bar" — position should shift
    editor.commands.insertContentAt(1, 'xxx')
    expect(editor.storage.scout.results).toHaveLength(1)
    expect(editor.storage.scout.results[0].from).toBe(posBefore + 3)
  })

  it('removes results when matches are deleted', () => {
    editor = new Editor({
      extensions: [
        StarterKit,
        Scout.configure({ liveUpdate: true }),
      ],
      content: '<p>foo bar foo</p>',
    })

    editor.commands.find('foo')
    expect(editor.storage.scout.results).toHaveLength(2)

    // Replace content without "foo"
    editor.commands.setContent('<p>bar baz</p>')
    expect(editor.storage.scout.results).toHaveLength(0)
  })

  it('does not re-search when searchTerm is empty', () => {
    editor = new Editor({
      extensions: [
        StarterKit,
        Scout.configure({ liveUpdate: true }),
      ],
      content: '<p>foo bar</p>',
    })

    // No active search — editing should not cause errors
    editor.commands.insertContentAt(1, 'hello ')
    expect(editor.storage.scout.results).toHaveLength(0)
  })

  it('updates decorations after typing (simulated keystrokes)', () => {
    editor = new Editor({
      extensions: [
        StarterKit,
        Scout.configure({ liveUpdate: true }),
      ],
      content: '<p>foo bar</p>',
    })

    editor.commands.find('foo')
    expect(editor.storage.scout.results).toHaveLength(1)

    // Simulate typing "foo" at the end, character by character
    const endPos = editor.state.doc.content.size - 1
    editor.view.dispatch(editor.state.tr.insertText(' ', endPos))
    editor.view.dispatch(editor.state.tr.insertText('f', endPos + 1))
    editor.view.dispatch(editor.state.tr.insertText('o', endPos + 2))
    editor.view.dispatch(editor.state.tr.insertText('o', endPos + 3))

    expect(editor.storage.scout.results).toHaveLength(2)
  })

  it('verifies options.liveUpdate is accessible in plugin', () => {
    editor = new Editor({
      extensions: [
        StarterKit,
        Scout.configure({ liveUpdate: true }),
      ],
      content: '<p>test</p>',
    })

    const scoutExt = editor.extensionManager.extensions.find(e => e.name === 'scout')
    expect(scoutExt?.options.liveUpdate).toBe(true)
  })

  it('clamps currentIndex when matches decrease', () => {
    editor = new Editor({
      extensions: [
        StarterKit,
        Scout.configure({ liveUpdate: true }),
      ],
      content: '<p>foo bar foo baz foo</p>',
    })

    editor.commands.find('foo')
    editor.commands.findNext()
    editor.commands.findNext()
    expect(editor.storage.scout.currentIndex).toBe(2)

    // Remove last "foo" — currentIndex should clamp
    editor.commands.setContent('<p>foo bar foo baz</p>')
    expect(editor.storage.scout.results).toHaveLength(2)
    expect(editor.storage.scout.currentIndex).toBeLessThanOrEqual(1)
  })
})