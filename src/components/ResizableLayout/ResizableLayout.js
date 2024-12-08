'use client'

import { useState, useCallback } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import dynamic from 'next/dynamic'
import InputArea from '@/components/Input/Input'
import OutputArea from '@/components/Output/Output'
import DropdownPane from '@/components/DropdownPane/DropdownPane'
import LoadingSpinner from '../../app/Loading'

const Editor = dynamic(() => import('@/components/Editor/Editor'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export default function ResizableLayout() {
  const [leftWidth, setLeftWidth] = useState(50)
  const [upperRightHeight, setUpperRightHeight] = useState(50)

  const handleLeftResize = useCallback((sizes) => {
    setLeftWidth(sizes[0])
  }, [])

  const handleUpperRightResize = useCallback((sizes) => {
    setUpperRightHeight(sizes[0])
  }, [])

  return (
    <>
      <DropdownPane />
      <div className="hidden md:block h-full rounded-2xl p-1">
        <PanelGroup direction="horizontal" onLayout={handleLeftResize}>
          <Panel defaultSize={leftWidth} minSize={20} className='rounded-2xl'>
            <div className="h-full p-4 bg-background text-foreground overflow-auto">
              {/* <Suspense fallback={<LoadingSpinner />}> */}
                <Editor />
              {/* </Suspense> */}
            </div>
          </Panel>
          <PanelResizeHandle className="w-2 dark:bg-muted dark:hover:bg-muted-foreground bg-gray-200 hover:bg-gray-400 transition-colors" />
          <Panel defaultSize={100-leftWidth} minSize={20}>
            <PanelGroup direction="vertical" onLayout={handleUpperRightResize}>
              <Panel defaultSize={upperRightHeight} minSize={20} className='rounded-2xl'>
                <div className="h-full p-4 bg-background text-foreground overflow-auto">
                  {/* <Suspense fallback={<LoadingSpinner />}> */}
                    <InputArea />
                  {/* </Suspense> */}
                </div>
              </Panel>
              <PanelResizeHandle className="h-2 dark:bg-muted dark:hover:bg-muted-foreground bg-gray-200 hover:bg-gray-400 transition-colors" />
              <Panel defaultSize={100-upperRightHeight} minSize={20} className='rounded-2xl'>
                <div className="h-full p-4 bg-background text-foreground overflow-auto">
                  {/* <Suspense fallback={<LoadingSpinner />}> */}
                    <OutputArea />
                  {/* </Suspense> */}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile Layout (smaller than md) */}
      <div className="md:hidden h-full">
        <div className="flex flex-col gap-4 p-1">
          <div className="h-[300px] bg-background text-foreground overflow-auto rounded-lg border p-2">
            {/* <Suspense fallback={<LoadingSpinner />}> */}
              <Editor />
            {/* </Suspense> */}
          </div>
          <div className="h-[200px] bg-background text-foreground overflow-auto rounded-lg border p-2">
            {/* <Suspense fallback={<LoadingSpinner />}> */}
              <InputArea />
            {/* </Suspense> */}
          </div>
          <div className="h-[200px] bg-background text-foreground overflow-auto rounded-lg border p-2">
            {/* <Suspense fallback={<LoadingSpinner />}> */}
              <OutputArea />
            {/* </Suspense> */}
          </div>
        </div>
      </div>
    </>
  )
}