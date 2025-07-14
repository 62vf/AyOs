"use client";

import { Textarea } from "@/components/ui/textarea";

export default function CodeEditor() {
  return (
    <div className="h-full w-full flex flex-col">
      <Textarea 
        className="flex-1 w-full bg-background/50 font-code text-accent border-accent/20 focus-visible:ring-accent resize-none"
        placeholder="// Your code here..."
        defaultValue={`function main() {
  console.log("Hello, AyOS!");
}`}
      />
    </div>
  );
}
