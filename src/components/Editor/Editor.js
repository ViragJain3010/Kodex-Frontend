"use client";
import dynamic from "next/dynamic";
import { useEditor } from "@/context/EditorContext";
import { useEffect } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function Editor({ onLoad }) {
  const { language, code, setCode, isLoadingConfig } = useEditor();

  useEffect(() => {
    onLoad()
  }, [onLoad])

  if (isLoadingConfig) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 border rounded-md overflow-hidden bg-gray-900 animate-pulse">
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            Loading {language} configuration...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border rounded-md overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={setCode}
          onMount={onLoad}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

