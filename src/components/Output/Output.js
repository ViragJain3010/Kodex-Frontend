'use client'
import { useEditor } from "@/context/EditorContext";

export default function OutputArea() {
    const { output } = useEditor();
    
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Output</h2>
            <div className="flex-1 p-4 rounded-md bg-gray-200 dark:bg-gray-700 whitespace-pre-wrap overflow-auto">
                {output}
            </div>
        </div>
    );
}