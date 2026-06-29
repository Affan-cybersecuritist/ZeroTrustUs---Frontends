"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

export default function SentinelTerminal({ records }: { records: any[] }) {
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Sentinel-Swarm initialized.",
    "[SYSTEM] Awaiting gateway ingestion...",
  ]);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (records.length === 0) return;
    
    // Simulate background agent logging
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const newLogs = [`[${now}] [AGENT] Polling ${records.length} records for compliance validation...`];
      
      const randomRecord = records[Math.floor(Math.random() * records.length)];
      if (randomRecord) {
        newLogs.push(`[${now}] [AGENT] Validating ${randomRecord.department} MAPs...`);
        if (randomRecord.status === "Breach") {
          newLogs.push(`[${now}] [AGENT] WARNING: Breach detected for MAP ID ${randomRecord.id}!`);
        } else {
          newLogs.push(`[${now}] [AGENT] Status Compliant for MAP ID ${randomRecord.id}.`);
        }
      }

      setLogs((prev) => [...prev.slice(-40), ...newLogs]);
    }, 3000);

    return () => clearInterval(interval);
  }, [records]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="w-full h-48 bg-black border-t border-[#222] font-mono text-sm overflow-hidden flex flex-col">
      <div className="bg-[#111] p-2 flex items-center gap-2 text-gray-400 border-b border-[#222] text-xs">
        <Terminal size={14} />
        <span>SENTINEL-SWARM LOG_OUTPUT</span>
      </div>
      <div className="p-4 overflow-y-auto flex-1 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={log.includes("WARNING") ? "text-alert-red" : "text-neon-green opacity-80"}>
            {log}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
