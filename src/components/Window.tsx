"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
// Note: Draggability is not implemented for simplicity. This can be added later.

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Window({ title, children, onClose }: WindowProps) {
  return (
    <Card className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-card/80 backdrop-blur-sm border border-primary/20 shadow-2xl shadow-primary/10 flex flex-col resize-x resize-y overflow-auto min-w-[300px] min-h-[200px]">
      <CardHeader className="flex flex-row items-center justify-between p-2 bg-primary/10 cursor-move">
        <CardTitle className="text-sm font-headline text-primary font-medium">{title}</CardTitle>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
          <X className="w-4 h-4 text-primary" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
}
