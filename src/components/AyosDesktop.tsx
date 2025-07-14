"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  File,
  Folder,
  HelpCircle,
  Loader2,
  FileCode,
  Crosshair,
  Network,
  Hash,
  Book,
} from "lucide-react";
import { Window } from "@/components/Window";
import Welcome from "@/components/apps/Welcome";
import CodeEditor from "@/components/apps/CodeEditor";
import PayloadStudio from "@/components/apps/PayloadStudio";
import PacketViewer from "@/components/apps/PacketViewer";
import HashCracker from "@/components/apps/HashCracker";
import { askVoidMindAction, askVoidMindUncensoredAction } from "@/app/actions";

type FileSystemNode = {
  type: "file" | "dir";
  content?: string;
  children?: { [key: string]: FileSystemNode };
};

type FileSystem = {
  [key:string]: FileSystemNode;
}

const initialFs: FileSystem = {
  home: {
    type: "dir",
    children: {
      user: {
        type: "dir",
        children: {
          "readme.txt": { type: "file", content: "Welcome to AyOS, the Hacker's Web OS." },
          "projects": { type: "dir", children: {} },
        },
      },
    },
  },
  etc: {
    type: "dir",
    children: {
      "hosts": { type: "file", content: "127.0.0.1 localhost" },
      "config.json": { type: "file", content: '{ "theme": "cyberpunk" }' },
    },
  },
  bin: { type: "dir", children: {} },
  opt: { type: "dir", children: {} },
};

const bootMessages = [
  "[0.000001] Initializing AyOS kernel...",
  "[0.000105] Loading user profile: root",
  "[0.000231] Mounting virtual file system...",
  "[0.000571] /dev/vda1 clean, 11/1337 files, 13/3742 blocks",
  "[0.000998] Starting UI services...",
  "[0.001201] Loading cyberpunk theme...",
  "[0.001542] Initializing window manager...",
  "[0.002033] Spawning terminal shell...",
  "[0.002567] Connecting to VoidMind AI...",
  "[0.003112] AyOS ready. Welcome, hacker.",
];

export default function AyosDesktop() {
  const [booting, setBooting] = useState(true);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [windows, setWindows] = useState<any[]>([]);
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [command, setCommand] = useState("");
  const [fs, setFs] = useState<FileSystem>(initialFs);
  const [currentPath, setCurrentPath] = useState("/home/user");
  const [isUncensoredMode, setIsUncensoredMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setBootLog((prev) => [...prev, bootMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 500);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!booting) {
      openWindow("Welcome", <Welcome />);
      inputRef.current?.focus();
    }
  }, [booting]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const openWindow = (title: string, app: React.ReactNode) => {
    const id = `${title}-${Date.now()}`;
    setWindows((prev) => [...prev, { id, title, app }]);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const resolvePath = (path: string): FileSystemNode | null => {
    const parts = path.split("/").filter(Boolean);
    let current: FileSystemNode | FileSystem = { type: 'dir', children: fs };
    for (const part of parts) {
      if (current.type === 'dir' && current.children && current.children[part]) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    return current as FileSystemNode;
  };

  const processCommand = async (cmd: string) => {
    const [action, ...args] = cmd.trim().split(" ");
    const newHistory = [...history, (
      <div key={`cmd-${Date.now()}`} className="flex gap-2">
        <span className="font-code terminal-prompt-text">root@ayos:~{currentPath}$</span>
        <span className="font-code terminal-text flex-1">{cmd}</span>
      </div>
    )];
    let output: React.ReactNode = null;

    switch (action) {
      case "help":
        output = (
          <div className="font-code terminal-text space-y-1">
            <div>Available commands:</div>
            <div className="grid grid-cols-[100px_1fr] gap-x-4">
              <span className="text-primary">help</span><span>Show this help message</span>
              <span className="text-primary">ls</span><span>List directory contents</span>
              <span className="text-primary">cd [path]</span><span>Change directory</span>
              <span className="text-primary">cat [file]</span><span>Display file content</span>
              <span className="text-primary">clear</span><span>Clear the terminal</span>
              <span className="text-primary">welcome</span><span>Open the welcome window</span>
              <span className="text-primary">editor</span><span>Open the code editor</span>
              <span className="text-primary">payloads</span><span>Open Payload Studio</span>
              <span className="text-primary">packets</span><span>Open Packet Viewer</span>
              <span className="text-primary">cracker</span><span>Open Hash Cracker</span>
              <span className="text-primary">voidmind</span><span>Ask the AI assistant</span>
              {isUncensoredMode && <><span className="text-primary">voidmind-un</span><span>Ask the uncensored AI</span></>}
            </div>
          </div>
        );
        break;

      case "ls":
        const node = resolvePath(currentPath);
        if (node && node.type === 'dir' && node.children) {
          output = (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-code terminal-text">
              {Object.keys(node.children).map(name => (
                <div key={name} className="flex items-center gap-2">
                  {node.children![name].type === 'dir' ? <Folder className="w-4 h-4 text-primary" /> : <File className="w-4 h-4 text-gray-500" />}
                  <span>{name}</span>
                </div>
              ))}
            </div>
          );
        } else {
          output = <span className="font-code text-red-500">ls: cannot access '{currentPath}': Not a directory or does not exist.</span>;
        }
        break;

      case "cd":
        const newPath = args[0] || '/';
        let resolvedNewPath = '';
        if (newPath.startsWith('/')) {
            resolvedNewPath = newPath;
        } else {
            resolvedNewPath = `${currentPath}/${newPath}`.replace(/\/+/g, '/');
            if (resolvedNewPath !== '/') resolvedNewPath = resolvedNewPath.replace(/\/$/, '');
        }

        const pathParts = resolvedNewPath.split('/').filter(p => p);
        const resolvedParts: string[] = [];
        for (const part of pathParts) {
            if (part === '..') {
                resolvedParts.pop();
            } else {
                resolvedParts.push(part);
            }
        }
        resolvedNewPath = '/' + resolvedParts.join('/');
        
        const targetNode = resolvePath(resolvedNewPath);
        if (targetNode && targetNode.type === 'dir') {
            setCurrentPath(resolvedNewPath);
        } else {
            output = <span className="font-code text-red-500">cd: no such file or directory: {newPath}</span>;
        }
        break;
      
      case "cat":
        const filePath = args[0];
        if (!filePath) {
            output = <span className="font-code text-red-500">cat: missing file operand</span>;
            break;
        }
        const fileNode = resolvePath(filePath.startsWith('/') ? filePath : `${currentPath}/${filePath}`);
        if(fileNode && fileNode.type === 'file') {
          output = <pre className="font-code terminal-text whitespace-pre-wrap">{fileNode.content}</pre>;
        } else {
          output = <span className="font-code text-red-500">cat: {filePath}: No such file or not a file</span>;
        }
        break;

      case "clear":
        setHistory([]);
        return;
        
      case "welcome":
        openWindow("Welcome", <Welcome />);
        break;
      case "editor":
        openWindow("Code Editor", <CodeEditor />);
        break;
      case "payloads":
        openWindow("Payload Studio", <PayloadStudio />);
        break;
      case "packets":
        openWindow("Packet Viewer", <PacketViewer />);
        break;
      case "cracker":
        openWindow("Hash Cracker", <HashCracker />);
        break;
      
      case "voidmind":
        const query = args.join(' ');
        if (query === 'enter uncensored mode') {
            setIsUncensoredMode(true);
            output = <div className="font-code text-red-500">Uncensored mode activated. Use 'voidmind-un [question]' to ask unrestricted questions.</div>;
        } else if (!query) {
          output = <span className="font-code text-red-500">Usage: voidmind [your question]</span>
        } else {
          setHistory([...newHistory, (
            <div key={`loader-${Date.now()}`} className="flex items-center gap-2 font-code terminal-text">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Contacting VoidMind...</span>
            </div>
          )]);
          const result = await askVoidMindAction(query);
          output = <div className="font-code terminal-text space-y-2">
            <div className="text-primary font-bold">VoidMind Response:</div>
            <p>{result}</p>
          </div>
        }
        break;

      case "voidmind-un":
        if (!isUncensoredMode) {
            output = <span className="font-code text-red-500">Uncensored mode is not active. Run 'voidmind enter uncensored mode' first.</span>;
            break;
        }
        const unQuery = args.join(' ');
        if (!unQuery) {
            output = <span className="font-code text-red-500">Usage: voidmind-un [your question]</span>
        } else {
            setHistory([...newHistory, (
              <div key={`loader-un-${Date.now()}`} className="flex items-center gap-2 font-code text-red-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Contacting Uncensored VoidMind...</span>
              </div>
            )]);
            const result = await askVoidMindUncensoredAction(unQuery);
            output = <div className="font-code terminal-text space-y-2">
              <div className="text-red-500 font-bold">VoidMind (Uncensored) Response:</div>
              <p>{result}</p>
            </div>
        }
        break;

      default:
        output = <span className="font-code text-red-500">command not found: {action}. Type 'help' for a list of commands.</span>;
    }
    
    setHistory(output ? [...newHistory, output] : newHistory);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() === "") return;
    processCommand(command);
    setCommand("");
  };

  if (booting) {
    return (
      <div className="w-screen h-screen bg-background flex flex-col items-center justify-center font-code text-accent p-4 overflow-hidden">
        <pre className="text-center text-xs md:text-base">
          {`
 █████╗ ██╗   ██╗ ██████╗  ██████╗ 
██╔══██╗╚██╗ ██╔╝██╔═══██╗██╔════╝ 
███████║ ╚████╔╝ ██║   ██║██║  ███╗
██╔══██║  ╚██╔╝  ██║   ██║██║   ██║
██║  ██║   ██║   ╚██████╔╝╚██████╔╝
╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝ 
          `}
        </pre>
        <div className="w-full max-w-2xl h-64 overflow-y-auto mt-4 text-sm">
          {bootLog.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen p-4 flex flex-col font-sans" onClick={() => inputRef.current?.focus()}>
      <div className="relative flex-1">
        {windows.map((w) => (
          <Window key={w.id} title={w.title} onClose={() => closeWindow(w.id)}>
            {w.app}
          </Window>
        ))}
      </div>

      <div className="h-[40vh] bg-card/80 backdrop-blur-sm border border-primary/20 rounded-lg p-4 flex flex-col overflow-hidden shadow-2xl shadow-primary/10">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {history.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
          <div ref={terminalEndRef} />
        </div>
        <form onSubmit={handleCommandSubmit} className="flex gap-2 items-center pt-2">
          <span className="font-code terminal-prompt-text">root@ayos:~{currentPath}$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-code terminal-text p-0"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
}

    