export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  type: 'file' | 'folder';
  parentId?: string;
  children?: ProjectFile[];
}

export interface Project {
  id: string;
  name: string;
  language: ProgrammingLanguage;
  files: ProjectFile[];
  lastModified: Date;
  createdAt: Date;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  extension: string;
  icon: string;
  template: string;
}

export const PROGRAMMING_LANGUAGES: ProgrammingLanguage[] = [
  {
    id: 'web',
    name: 'HTML/CSS/JS',
    extension: '.html',
    icon: '🌐',
    template: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        h1 {
            color: #333;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <script>
        console.log('Hello from JavaScript!');
    </script>
</body>
</html>`
  },
  {
    id: 'css',
    name: 'CSS',
    extension: '.css',
    icon: '🎨',
    template: `/* Add your styles here */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    icon: '⚡',
    template: `// JavaScript code
console.log('Hello, World!');

function greet(name) {
    return \`Hello, \${name}!\`;
}

const message = greet('Developer');
console.log(message);`
  },
  {
    id: 'python',
    name: 'Python',
    extension: '.py',
    icon: '🐍',
    template: `# Python code
def greet(name):
    return f"Hello, {name}!"

def main():
    message = greet("World")
    print(message)

if __name__ == "__main__":
    main()`
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    extension: '.js',
    icon: '🚀',
    template: `// Node.js application
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World from Node.js!');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    icon: '⚙️',
    template: `#include <iostream>
#include <string>

int main() {
    std::string message = "Hello, World!";
    std::cout << message << std::endl;
    return 0;
}`
  }
];

export interface Settings {
  theme: 'light' | 'dark';
  language: 'en' | 'az' | 'tr';
  fontSize: 'small' | 'medium' | 'large';
  tabSize: 2 | 4;
  autoSave: boolean;
  autoFormat: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  language: 'en',
  fontSize: 'medium',
  tabSize: 4,
  autoSave: true,
  autoFormat: true,
};