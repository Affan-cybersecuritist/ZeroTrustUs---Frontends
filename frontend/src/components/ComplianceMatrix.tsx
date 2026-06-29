"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck, X, TerminalSquare } from "lucide-react";

export default function ComplianceMatrix({ records }: { records: any[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedRecord = records.find((r) => r.id.toString() === selectedId);

  return (
    <div className="w-full p-8 bg-obsidian text-white relative">
      <h2 className="text-2xl font-bold mb-6">Compliance Matrix</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <motion.div
            layoutId={`card-${record.id}`}
            key={record.id}
            onClick={() => setSelectedId(record.id.toString())}
            className={`cursor-pointer p-6 rounded-xl border transition-colors ${
              record.status === "Breach" 
                ? "border-alert-red bg-[#1a0f0f] hover:bg-[#2a1111]" 
                : "border-border-dark bg-card-bg hover:border-gray-500"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500">{record.department}</span>
              {record.status === "Breach" ? (
                <ShieldAlert className="text-alert-red" size={20} />
              ) : (
                <ShieldCheck className="text-neon-green" size={20} />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">{record.map_item}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{record.regulation_text}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm">
            <motion.div
              layoutId={`card-${selectedRecord.id}`}
              className="w-full max-w-5xl h-[80vh] bg-card-bg border border-border-dark rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
            >
              <button 
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/80 text-white"
                onClick={() => setSelectedId(null)}
              >
                <X size={24} />
              </button>

              {/* Modal Left: Raw text */}
              <div className="w-full md:w-1/2 p-8 border-r border-border-dark flex flex-col overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-gray-800 text-xs font-mono rounded-full">{selectedRecord.department}</span>
                  <span className={`px-3 py-1 text-xs font-mono rounded-full ${selectedRecord.status === 'Breach' ? 'bg-alert-red/20 text-alert-red' : 'bg-neon-green/20 text-neon-green'}`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{selectedRecord.map_item}</h2>
                
                <h4 className="text-sm font-bold text-gray-500 uppercase mt-6 mb-2">Raw Regulatory Source</h4>
                <div className="p-4 bg-black/40 rounded-lg text-gray-300 font-serif leading-relaxed border border-border-dark">
                  {selectedRecord.regulation_text}
                </div>
              </div>

              {/* Modal Right: Live Validation Hook */}
              <div className="w-full md:w-1/2 bg-[#050505] p-6 flex flex-col font-mono relative">
                <div className="flex items-center gap-2 text-gray-500 border-b border-[#222] pb-4 mb-4">
                  <TerminalSquare size={18} />
                  <span className="text-sm uppercase">Live Validation Hook</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 text-sm">
                  <p className="text-blue-400">$ INIT autonomous_validation_routine --target={selectedRecord.department.toLowerCase()}_db</p>
                  <p className="text-gray-400">[{new Date().toISOString()}] Connecting to data source...</p>
                  <p className="text-gray-400">[{new Date().toISOString()}] Connection established. Executing query:</p>
                  <div className="p-3 bg-black border border-[#333] rounded text-yellow-300 overflow-x-auto">
                    {selectedRecord.validation_query}
                  </div>
                  <p className="text-gray-400">[{new Date().toISOString()}] Awaiting response...</p>
                  
                  {selectedRecord.status === "Breach" ? (
                    <div className="mt-6 text-alert-red animate-pulse">
                      <p>CRITICAL EXCEPTION: Query returned non-compliant state!</p>
                      <p>ErrCode: 0xBAD_POLICY</p>
                      <p>Status updated to: BREACH</p>
                    </div>
                  ) : (
                    <div className="mt-6 text-neon-green">
                      <p>200 OK: Validated.</p>
                      <p>No anomalies detected.</p>
                      <p>Status: COMPLIANT</p>
                    </div>
                  )}
                </div>
                
                {/* Decorative terminal elements */}
                <div className="absolute bottom-4 right-6 text-xs text-gray-600">
                  AGENT_ID: 0x9F4A • T-POLL: 3s
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
