import { useRef, useEffect } from 'react'
import { Resizable } from 're-resizable'

export default function InputOutput({ input, setInput, output }) {
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && inputRef.current) {
        const { height } = containerRef.current.getBoundingClientRect()
        inputRef.current.style.height = `${height / 2}px`
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div ref={containerRef} className="flex-grow flex flex-col pl-2">
      <Resizable
        ref={inputRef}
        defaultSize={{ width: '100%', height: '50%' }}
        minHeight="20%"
        maxHeight="80%"
        enable={{ bottom: true }}
        className="border-b border-divider"
        handleClasses={{
          bottom: 'h-0.5 bg-divider hover:bg-divider-highlight transition-colors duration-200 cursor-row-resize',
        }}
        handleStyles={{
          bottom: {
            bottom: '-1px',
          },
        }}
      >
        <div className="h-full p-4">
          <h2 className="text-lg font-semibold mb-2">Input</h2>
          <textarea
            className="w-full h-[calc(100%-2rem)] resize-none bg-background text-foreground border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary scrollbar-custom overflow-auto"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your input here..."
          />
        </div>
      </Resizable>
      <div className="flex-grow p-4 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2">Output</h2>
        <pre className="w-full h-[calc(100%-2rem)] bg-muted text-muted-foreground rounded-md p-2 overflow-auto scrollbar-custom">
          {output}
        </pre>
      </div>
    </div>
  )
}