import { Node, mergeAttributes, CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      insertIframe: (options: { src: string }) => ReturnType
    }
  }
}

export const CustomIframe = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: '0',
      },
      allowfullscreen: {
        default: 'true',
      },
      allow: {
        default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      },
      class: {
        default: 'w-full aspect-video rounded-lg my-4 border-none',
      },
    }
  },

  parseHTML() {
    return [{ tag: 'iframe' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { class: 'relative w-full my-4' }, 
      ['iframe', mergeAttributes(HTMLAttributes)]
  ]},

  addCommands() {
    return {
      insertIframe: (options: { src: string }) => ({ chain }: CommandProps) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: options,
          })
          .run()
      },
    }
  },
})