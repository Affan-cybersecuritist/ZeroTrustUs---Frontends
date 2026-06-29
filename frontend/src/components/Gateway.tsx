"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";

export default function Gateway({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setUploading(true);
    // Simulate Sentinel-Swarm analyzing
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setTimeout(() => {
          setUploading(false);
          setSuccess(true);
          setTimeout(() => {
            onUploadComplete();
            // Reset after showing success
            setTimeout(() => {
              setSuccess(false);
            }, 3000);
          }, 1500);
        }, 3000); // Wait 3s to show the cool animation
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 border-b border-border-dark bg-obsidian">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <UploadCloud className="text-neon-green" /> The Vault Gateway
      </h2>
      
      {!uploading && !success && (
        <form 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
          className={`w-full max-w-2xl h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? "border-neon-green bg-card-bg" : "border-border-dark bg-card-bg/50"}`}
        >
          <input type="file" className="hidden" id="file-upload" onChange={handleChange} />
          <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
            <UploadCloud size={48} className="text-gray-400 mb-4" />
            <p className="text-lg text-gray-300">Drag & drop regulatory document here</p>
            <p className="text-sm text-gray-500 mt-2">PDF, DOCX, TXT</p>
          </label>
        </form>
      )}

      {uploading && (
        <div className="w-full max-w-2xl h-64 flex flex-col items-center justify-center border border-border-dark bg-card-bg rounded-xl overflow-hidden relative">
          <p className="z-10 text-xl font-mono text-neon-green mb-4">INITIATING SENTINEL-SWARM...</p>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Swarm Particle Effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 200 - 100,
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 2 }}
                className="absolute w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#22c55e]"
              />
            ))}
          </div>
        </div>
      )}

      {success && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-full max-w-2xl h-64 flex flex-col items-center justify-center border border-neon-green bg-[#112a1d] rounded-xl text-neon-green shadow-[0_0_20px_rgba(34,197,94,0.4)]"
        >
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 0.5 }}>
            <CheckCircle size={64} className="mb-4" />
          </motion.div>
          <p className="text-2xl font-bold tracking-widest uppercase">Extraction Complete</p>
          <p className="text-sm mt-2 opacity-80">MAPs synchronized to main matrix.</p>
        </motion.div>
      )}
    </div>
  );
}
