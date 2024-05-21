import React, { useState } from "react";
import NavBar from "./components/NavBar";
import CodeEditor from "./components/CodeEditor";


const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedTheme , setSelectedTheme] = useState("vs-dark")

  return (
    <div>
      <NavBar selectedLanguage={selectedLanguage} onLanguageSelect={setSelectedLanguage}  selectedTheme={selectedTheme} onThemeSelect={setSelectedTheme}/>
      <CodeEditor selectedLanguage={selectedLanguage} selectedTheme={selectedTheme} />
    </div>
  );
};

export default App;
