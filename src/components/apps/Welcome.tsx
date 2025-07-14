"use client";

import { Terminal, HelpCircle, Bot } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="h-full w-full text-foreground space-y-4">
      <h1 className="text-2xl font-headline text-primary">Welcome to AyOS</h1>
      <p className="text-muted-foreground">
        This is a simulated web-based operating system for hackers and cybersecurity enthusiasts.
        Everything runs in your browser.
      </p>

      <div className="space-y-2">
        <h2 className="font-headline text-accent flex items-center gap-2"><Terminal className="w-5 h-5"/>The Terminal</h2>
        <p>The terminal is your main interface. You can run commands to interact with the simulated file system and tools.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-headline text-accent flex items-center gap-2"><HelpCircle className="w-5 h-5"/>Getting Started</h2>
        <p>Try these commands in the terminal below:</p>
        <ul className="list-none space-y-1 font-code text-sm pl-4">
          <li><span className="text-primary mr-2">help</span>- Show all available commands.</li>
          <li><span className="text-primary mr-2">ls</span>- List files in the current directory.</li>
          <li><span className="text-primary mr-2">cat readme.txt</span>- Read a file.</li>
          <li><span className="text-primary mr-2">editor</span>- Open the code editor.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="font-headline text-accent flex items-center gap-2"><Bot className="w-5 h-5"/>VoidMind AI</h2>
        <p>
          You have access to a built-in AI assistant. Ask it anything about ethical hacking or CTFs.
        </p>
        <p className="font-code text-sm pl-4">
          <span className="text-primary">voidmind "what is XSS?"</span>
        </p>
      </div>
    </div>
  );
}
