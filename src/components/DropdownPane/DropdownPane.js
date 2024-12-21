"use client";
import { PlayIcon } from "lucide-react";
import { ResetDialog } from "./ResetDialog";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";

export default function DropdownPane() {
  const {
    language,
    setLanguage,
    handleRun,
    handleReset,
    isRunning,
    isLoadingConfig,
  } = useEditor();
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/languages`);
        if (!response.ok) throw new Error("Failed to fetch languages");
        const data = await response.json();
        if (!data.success)
          throw new Error("API returned unsuccessful response");

        const transformedLanguages = data.languages.map((lang) => ({
          value: lang.key,
          label: lang.name,
        }));

        setLanguages(transformedLanguages);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (isLoading || error) {
    return (
      <div className="flex justify-between items-center mb-4">
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-40 rounded-md" />
        ) : (
          <div className="text-red-500">Error: {error}</div>
        )}
        <div className="space-x-2">
          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-md opacity-50 cursor-not-allowed"
          >
            <PlayIcon className="inline-block mr-2 h-4 w-4" /> Run
          </button>
          <ResetDialog onReset={handleReset} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-200 dark:bg-gray-800 space-x-4 p-2">
      <Select.Root value={language} onValueChange={setLanguage}>
        <Select.Trigger
          className="inline-flex items-center justify-center rounded-md px-3 h-10 gap-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={isLoadingConfig || isRunning}
        >
          <Select.Value placeholder="Select a language" />
          <Select.Icon className="text-gray-600 dark:text-gray-300">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden"
            position="popper" // Ensures the dropdown opens in a way that all items are visible
            sideOffset={5} // Adds some spacing from the trigger
          >
            <Select.Viewport
              className="p-2 max-h-56 overflow-y-auto" // Adds scrollable content with a max height of 56 (14rem)
            >
              {languages.map((lang) => (
                <Select.Item
                  key={lang.value}
                  value={lang.value}
                  className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-3 py-2  transition-colors"
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
          disabled={isRunning || isLoadingConfig}
          className={`px-4 py-2 text-sm font-medium text-white ${
            isRunning || isLoadingConfig
              ? "bg-green-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          <PlayIcon className="inline-block mr-2 h-4 w-4" />
          {isRunning ? "Running..." : "Run"}
        </button>
        <ResetDialog onReset={handleReset} />
      </div>
    </div>
  );
}
