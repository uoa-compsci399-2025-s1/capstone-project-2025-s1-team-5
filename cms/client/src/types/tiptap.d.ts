import { Commands } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      insertIframe: (options: { src: string }) => ReturnType
    }
  }
}