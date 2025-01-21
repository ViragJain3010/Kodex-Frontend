"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { generateSlug } from "random-word-slugs";

const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [isLanguageChangedByUser, setIsLanguageChangedByUser] = useState(true);
  const [slug, setSlug] = useState("");
  // Cache for language configurations
  const [languageConfigs, setLanguageConfigs] = useState({});
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  const slugFormat = {
    format: "kebab",
    partsOfSpeech: ["adjective", "noun"],
    categories: {
      adjective: ["color", "appearance", "shapes", "taste"],
      noun: ["animals", "food", "media"],
    },
  };

  const apiBaseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3001/api";

  // Fetch language config and update code
  const fetchLanguageConfig = useCallback(
    async (lang) => {
      // If we already have the config, use it
      if (languageConfigs[lang]) {
        setCode(languageConfigs[lang].safeConfig.defaultBoilerplate);
        return;
      }

      setIsLoadingConfig(true);
      try {
        const response = await fetch(`${apiBaseUrl}/languages/${lang}`);
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
    },
    [language]
  );

  // Effect to fetch config when language changes
  useEffect(() => {
    if (isLanguageChangedByUser) {
      fetchLanguageConfig(language);
    }
  }, [language, fetchLanguageConfig]);

  const createSlug = useCallback(async () => {
    let temp;
    try {
      if (!slug) {
        {
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts) {
            temp = generateSlug(2, slugFormat);
            const checkResponse = await fetch(`${apiBaseUrl}/check/${temp}`);
            if (checkResponse.ok) {
              setSlug(temp);
              break;
            }
            attempts++;
          }

          if (!temp) {
            throw new Error(
              "Failed to generate a valid slug after multiple attempts."
            );
          }
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  });

  // Run code
  const handleRun = useCallback(async () => {
    setIsRunning(true);
    try {
      const response = await fetch(`${apiBaseUrl}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          language,
          code,
          input,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Execution failed");
      }

      setOutput(data.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [language, code, input, slugFormat]);

  const fetchSnippet = useCallback(async (slugParam) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${slugParam}`);
      if (!response.ok) {
        throw new Error("Failed to fetch snippet");
      }
      const data = await response.json();
      if (!data) {
        window.history.pushState(null, "", `/`);
        handleReset;
      } else {
        setCode(data.code);
        setInput(data.input);
        setOutput(data.output);
        setLanguage(data.language);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  });

  const handleReset = useCallback(() => {
    // Use cached config to reset code
    if (languageConfigs[language]) {
      setCode(languageConfigs[language].safeConfig.defaultBoilerplate);
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
    slug,
    fetchSnippet,
    setIsLanguageChangedByUser,
    createSlug,
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
