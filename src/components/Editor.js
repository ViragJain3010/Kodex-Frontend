"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PlayIcon } from "lucide-react";
import { ResetDialog } from "./DropdownPane/ResetDialog";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const languages = [
  {
    value: "javascript",
    label: "JavaScript",
    snippet: 'console.log("Hello, World!");',
  },
  { value: "python", label: "Python", snippet: 'print("Hello, World!")' },
  {
    value: "cpp",
    label: "C++",
    snippet:
      '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  },
];

export default function Editor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("console.log(Hello World!)");

  useEffect(() => {
    setCode(languages.find((lang) => lang.value === language).snippet);
  }, [language, setCode]);

  const handleRun = () => {
    // In a real application, you would send the code to a backend for execution
    setOutput(`Executed ${language} code:\n\n${code}`);
  };

  const handleReset = () => {
    setCode(languages.find((lang) => lang.value === language).snippet);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <Select.Root value={language} onValueChange={setLanguage}>
          <Select.Trigger className="inline-flex items-center justify-center rounded-md px-3 h-10 gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all">
            <Select.Value placeholder="Select a language" />
            <Select.Icon className="text-gray-600 dark:text-gray-300">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden">
              <Select.Viewport className="p-2">
                {languages.map((lang) => (
                  <Select.Item
                    key={lang.value}
                    value={lang.value}
                    className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-3 py-2 transition-colors"
                  >
                    <Select.ItemText>{lang.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <div className="space-x-2">
          <button
            onClick={handleRun}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PlayIcon className="inline-block mr-2 h-4 w-4" /> Run
          </button>
          <ResetDialog onReset={handleReset} />
        </div>
      </div>
      <div className="flex-1 border rounded-md overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={setCode}
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