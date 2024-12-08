// src/components/LanguageSelector.js
const LanguageSelector = ({ language, setLanguage }) => (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="cpp">C++</option>
    </select>
  );
  
  export default LanguageSelector;
  