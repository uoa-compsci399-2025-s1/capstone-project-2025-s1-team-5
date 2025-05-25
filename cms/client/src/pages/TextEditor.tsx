import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect, useCallback, useRef } from 'react'
import { CustomIframe } from './CustomIframe'
import axios from 'axios'
import Image from '@tiptap/extension-image'

interface TextEditorProps {
  content: string
  onChange: (content: string) => void
}

const TextEditor = ({ content, onChange }: TextEditorProps) => {
  const initialLoad = useRef(true)
  const convertToEmbedUrl = useCallback((url: string) => {
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const vimeoRegex = /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/(\d+)|player\.vimeo\.com\/video\/(\d+))/

    const youtubeMatch = url.match(youtubeRegex)
    const vimeoMatch = url.match(vimeoRegex)

    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    if (vimeoMatch) {
      const videoId = vimeoMatch[1] || vimeoMatch[2]
      return `https://player.vimeo.com/video/${videoId}`
    }

    return null
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      CustomIframe,
      Image,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-[150px] p-4 max-w-full [&_.iframe-wrapper]:my-4 [&_iframe]:rounded-lg',
      },
    },
  })

useEffect(() => {
  if (editor) {
    if (initialLoad.current) {
      editor.commands.setContent(content || '')
      initialLoad.current = false
    } else if (!content && editor.getHTML().trim() === '') {
      editor.commands.setContent('')
    }
  }
}, [editor, content])

  const handleButtonClick = (e: React.MouseEvent, command: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    command();
    setTimeout(() => editor?.commands.focus(), 0);
  };

  if (!editor) {
    return <div className="p-4 text-gray-500">Loading editor...</div>
  }

    const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = res.data.url;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image.");
    }
  };
    
  return (
    <div className="border border-gray-300 rounded-md">
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-300 bg-gray-50">
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'bg-white'}`}
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'bg-white'}`}
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'bg-white'}`}
        >
          H2
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'bg-white'}`}
        >
          H3
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'bg-white'}`}
        >
          • List
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'bg-white'}`}
        >
          1. List
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('left').run())}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'bg-white'}`}
          title="Align left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="15" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('center').run())}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'bg-white'}`}
          title="Align center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="7" y1="12" x2="17" y2="12"></line>
            <line x1="5" y1="18" x2="19" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('right').run())}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'bg-white'}`}
          title="Align right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="9" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('justify').run())}
          className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : 'bg-white'}`}
          title="Justify"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            const url = prompt('Enter YouTube or Vimeo URL:')
            if (url) {
              const embedUrl = convertToEmbedUrl(url)
              if (embedUrl && editor) {
                editor
                  .chain()
                  .focus()
                  .insertIframe({ src: embedUrl })
                  .run()
              } else {
                alert('Please enter a valid YouTube or Vimeo URL.')
              }
            }
          }}
          className="p-2 rounded-md bg-white hover:bg-gray-100 border border-gray-300 transition-colors"
        >
          <span className="mr-2">🎥</span>
          Add Video
        </button>
        <input
          type="file"
          accept="image/*"
          hidden
          id="upload-image"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
        <label htmlFor="upload-image" className="p-2 rounded bg-white hover:bg-gray-100 border border-gray-300 cursor-pointer">
          🖼️ Upload Image
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default TextEditor