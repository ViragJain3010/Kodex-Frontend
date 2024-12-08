import { useRef, useEffect } from 'react'
import { Resizable } from 're-resizable'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function CodeEditor({ code, setCode, language }) {
  const editorRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        const { width } = editorRef.current.getBoundingClientRect()
        editorRef.current.style.width = `${width}px`
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Resizable
      ref={editorRef}
      defaultSize={{ width: '60%', height: '100%' }}
      minWidth="20%"
      maxWidth="80%"
      enable={{ right: true }}
      className="border-r border-divider"
      handleClasses={{
        right: 'w-1 bg-transparent hover:border-blue-400 hover:border-l-2 transition-colors duration-200 cursor-col-resize',
      }}
      handleStyles={{
        right: {
          // left: '2px',
        },
      }}
    >
      <div className="h-full pr-2 overflow-hidden ">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            renderLineHighlight: 'all',
            lineHighlightBackground: '#ffffff10',
            lineHighlightBorder: '#00000000',
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
          className="scrollbar-custom"
        />
      </div>
    </Resizable>
  )
}