"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

const mockPackets = [
  { no: 1, time: "0.000000", source: "192.168.1.101", dest: "8.8.8.8", protocol: "DNS", length: 78, info: "Standard query 0x1234 A google.com" },
  { no: 2, time: "0.034123", source: "8.8.8.8", dest: "192.168.1.101", protocol: "DNS", length: 120, info: "Standard query response 0x1234 A 172.217.16.14" },
  { no: 3, time: "0.035000", source: "192.168.1.101", dest: "172.217.16.14", protocol: "TCP", length: 66, info: "443 → 51234 [SYN] Seq=0 Win=64240 Len=0 MSS=1460" },
  { no: 4, time: "0.059210", source: "172.217.16.14", dest: "192.168.1.101", protocol: "TCP", length: 66, info: "51234 → 443 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0" },
  { no: 5, time: "0.059300", source: "192.168.1.101", dest: "172.217.16.14", protocol: "TCP", length: 54, info: "443 → 51234 [ACK] Seq=1 Ack=1 Win=501 Len=0" },
  { no: 6, time: "0.060100", source: "192.168.1.101", dest: "172.217.16.14", protocol: "TLSv1.2", length: 571, info: "Client Hello" },
];


export default function PacketViewer() {
  return (
    <div className="h-full w-full flex flex-col gap-4">
      <Button disabled className="w-full">Load .pcap file (Simulation)</Button>
      <div className="flex-1 overflow-auto border border-accent/20 rounded-md">
        <Table className="font-code text-sm">
          <TableHeader>
            <TableRow className="hover:bg-accent/10 border-b-accent/20">
              <TableHead className="text-primary">No.</TableHead>
              <TableHead className="text-primary">Time</TableHead>
              <TableHead className="text-primary">Source</TableHead>
              <TableHead className="text-primary">Destination</TableHead>
              <TableHead className="text-primary">Protocol</TableHead>
              <TableHead className="text-primary">Length</TableHead>
              <TableHead className="text-primary">Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPackets.map((packet) => (
              <TableRow key={packet.no} className="hover:bg-accent/10 border-b-accent/20">
                <TableCell>{packet.no}</TableCell>
                <TableCell>{packet.time}</TableCell>
                <TableCell className="text-accent">{packet.source}</TableCell>
                <TableCell className="text-accent">{packet.dest}</TableCell>
                <TableCell>{packet.protocol}</TableCell>
                <TableCell>{packet.length}</TableCell>
                <TableCell>{packet.info}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
