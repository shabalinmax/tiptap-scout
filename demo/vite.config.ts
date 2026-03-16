import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/tiptap-scout/',
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
    },
    dedupe: ['@tiptap/core', '@tiptap/pm', 'prosemirror-state', 'prosemirror-view', 'prosemirror-model'],
  },
})