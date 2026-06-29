"use client";

import { useEffect, useState } from "react";
import Gateway from "@/components/Gateway";
import Dashboard from "@/components/Dashboard";
import ComplianceMatrix from "@/components/ComplianceMatrix";
import SentinelTerminal from "@/components/SentinelTerminal";
import { ShieldAlert } from "lucide-react";

export default function Home() {
  const [records, setRecords] = useState<any[]>([]);

  const fetchRecords = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/api/records`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Failed to fetch records. Is backend running?", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      {/* Header */}
      <header className="w-full p-6 border-b border-border-dark flex justify-between items-center bg-[#0a0a0a] z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-green rounded-md flex items-center justify-center">
            <span className="font-bold text-black text-xl">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">ZeroTrustUs</h1>
            <p className="text-xs text-neon-green font-mono">Agentic Regulatory Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-gray-500">
          <span>AIR-GAPPED MODE: ACTIVE</span>
          <span className="w-3 h-3 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#22c55e]"></span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Gateway onUploadComplete={fetchRecords} />
        
        {records.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Dashboard records={records} />
            <ComplianceMatrix records={records} />
          </div>
        )}

        {records.length === 0 && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <ShieldAlert size={48} className="mb-4 opacity-50" />
            <p>Vault is empty. Ingest a regulatory source document to extract MAPs.</p>
          </div>
        )}
      </main>

      {/* Sentinel Terminal Footer */}
      <SentinelTerminal records={records} />
    </div>
  );
}
