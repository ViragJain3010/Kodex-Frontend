"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("javascript");
  // Cache for language configurations
  const [languageConfigs, setLanguageConfigs] = useState({});
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  // Fetch language config and update code
  const fetchLanguageConfig = useCallback(async (lang) => {
    // If we already have the config, use it
    if (languageConfigs[lang]) {
      setCode(languageConfigs[lang].safeConfig.defaultBoilerplate);
      return;
    }

    setIsLoadingConfig(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/languages/${lang}`);
      if (!response.ok)
        throw new Error(`Failed to fetch ${lang} configuration`);

      const config = await response.json();
      if (!config.success)
        throw new Error(`API error for ${lang} configuration`);

      // Update cache with new config
      setLanguageConfigs((prev) => ({
        ...prev,
        [lang]: config,
      }));

      // Set the boilerplate code
      setCode(config.safeConfig.defaultBoilerplate);
    } catch (error) {
      console.error("Error fetching language config:", error);
      setOutput(`Error loading ${lang} configuration: ${error.message}`);
    } finally {
      setIsLoadingConfig(false);
    }
  }, []);

  // Effect to fetch config when language changes
  useEffect(() => {
    fetchLanguageConfig(language);
  }, [language, fetchLanguageConfig]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            code,
            input,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (!data.success) {
        throw new Error(data.error || "Execution failed");
      }

      setOutput(data.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [language, code, input]);

  const handleReset = useCallback(() => {
    console.log(languageConfigs[language]);
    // Use cached config to reset code
    if (languageConfigs[language]) {
      setCode(languageConfigs[language].safeConfig.boilerplateCode);
    }
    setInput("");
    setOutput("");
  }, [language, languageConfigs]);

  const value = {
    code,
    setCode,
    input,
    setInput,
    output,
    setOutput,
    language,
    setLanguage,
    isRunning,
    isLoadingConfig,
    handleRun,
    handleReset,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
