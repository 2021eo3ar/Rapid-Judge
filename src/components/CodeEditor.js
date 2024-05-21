import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from 'axios';

const apiKey = process.env.REACT_APP_JUDGE0_API;


const helloWorldMapping = {
  javascript: "console.log('Hello, world!');",
  python: "print('Hello, world!')",
  c: "#include <stdio.h>\n\nint main() {\n    printf('Hello, world!');\n    return 0;\n}",
  cpp: "#include <iostream>\n\nint main() {\n    std::cout << 'Hello, world!' << std::endl;\n    return 0;\n}"
};


const languageIdMapping = {
  javascript: 63,
  python: 71,
  c: 50,
  cpp: 54
};

const CodeEditor = ({ selectedLanguage, selectedTheme }) => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const lowerCaseLang = selectedLanguage.toLowerCase();
    setCode(helloWorldMapping[lowerCaseLang] || "// Select a language to see the Hello World program");
  }, [selectedLanguage]);

  const handleSubmit = async () => {
    setIsLoading(true);

    const languageId = languageIdMapping[selectedLanguage.toLowerCase()];
    const encodedCode = btoa(code);
    const encodedInput = btoa(input);

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'true',
        fields: '*'
      },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        language_id: languageId,
        source_code: encodedCode,
        stdin: encodedInput
      }
    };

    try {
      const response = await axios.request(options);
      const token = response.data.token;

      // Fetch the result using the token
      const result = await fetchResult(token);
      setOutput(result.stdout || result.stderr || result.compile_output);
    } catch (error) {
      console.error(error);
      setOutput("An error occurred while processing the code.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResult = async (token) => {
    const resultOptions = {
      method: 'GET',
      url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
      params: {
        base64_encoded: 'true',
        fields: '*'
      },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': apiKey
      }
    };

    // Polling to get the result
    while (true) {
      const resultResponse = await axios.request(resultOptions);
      if (resultResponse.data.status.id <= 2) {
        // Still processing
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        return {
          stdout: atob(resultResponse.data.stdout || ''),
          stderr: atob(resultResponse.data.stderr || ''),
          compile_output: atob(resultResponse.data.compile_output || '')
        };
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[90vh] p-4">
    <div className="flex-1 mr-4 mb-4 md:mb-0">
      <div className="border border-gray-700 rounded-lg overflow-hidden shadow-lg h-full">
        <Editor
          height="100%"
          width="100%"
          language={selectedLanguage.toLowerCase()}
          value={code}
          onChange={(newValue) => setCode(newValue)}
          theme={selectedTheme}
          options={{
            fontSize: 18,
            automaticLayout: true,
            minimap: { enabled: true }
          }}
        />
      </div>
    </div>
    <div className="flex flex-col flex-1">
      <div className="relative flex-1 mb-4">
        <textarea
          className="w-full h-full p-2 resize-none bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg"
          placeholder="Input (optional)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleSubmit}
          className={`w-half px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
      </div>
      {output && (
        <div className="flex-1">
          <pre className="w-full h-full p-4 bg-gray-900 text-white rounded-lg shadow-lg overflow-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  </div>
  );
};

export default CodeEditor;
