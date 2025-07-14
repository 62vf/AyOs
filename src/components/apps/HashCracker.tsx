"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockWordlist = {
    "202cb962ac59075b964b07152d234b70": "123",
    "827ccb0eea8a706c4c34a16891f84e7b": "12345",
    "e10adc3949ba59abbe56e057f20f883e": "123456",
    "5f4dcc3b5aa765d61d8327deb882cf99": "password",
    "21232f297a57a5a743894a0e4a801fc3": "admin",
} as const;

export default function HashCracker() {
    const [hash, setHash] = useState('e10adc3949ba59abbe56e057f20f883e');
    const [isCracking, setIsCracking] = useState(false);
    const { toast } = useToast();

    const startCracking = () => {
        setIsCracking(true);
        setTimeout(() => {
            const result = (mockWordlist as any)[hash];
            if (result) {
                toast({
                    title: "Hash Cracked!",
                    description: `Password found: ${result}`,
                    variant: "default",
                });
            } else {
                toast({
                    title: "Crack Failed",
                    description: "Password not found in the wordlist.",
                    variant: "destructive",
                });
            }
            setIsCracking(false);
        }, 2000);
    }

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div>
        <Label htmlFor="hash-input" className="text-primary">Hash to Crack (MD5)</Label>
        <Input 
            id="hash-input"
            value={hash}
            onChange={e => setHash(e.target.value)}
            placeholder="Enter MD5 hash..."
            className="font-code"
        />
        <p className="text-xs text-muted-foreground mt-1">
            Simulated using a small wordlist. Try cracking the default hash.
        </p>
      </div>
      <Button onClick={startCracking} disabled={isCracking} className="bg-primary hover:bg-primary/80 text-primary-foreground">
        {isCracking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isCracking ? "Cracking..." : "Start Cracking"}
      </Button>
    </div>
  );
}
