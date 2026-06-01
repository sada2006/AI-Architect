"use client";

import { useState } from "react";
import { Upload, Sparkles } from "lucide-react";
import Viewer3D from "../components/Viewer3D";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [specs, setSpecs] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("specifications", specs);

      // Processing pipeline link to the n8n automation hub
      const response = await fetch(
        "https://nikhil2743.app.n8n.cloud/webhook/generate-3d",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to communicate with the AI synthesis pipeline.");
      }

      // Capture the generated architectural texture buffer cleanly
      const blob = await response.blob();
      const localImageUrl = URL.createObjectURL(blob);
      
      setGeneratedImgUrl(localImageUrl);
      alert("Architectural concept synthesized and projected successfully!");

    } catch (error) {
      console.error("Connection Error:", error);
      alert("Pipeline synchronization boundary error encountered.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Left Control Column: Parameters & Synthesis Inputs */}
      <div className="w-full lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              AI Architect
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Translating structural parameters into immersive concept designs.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Spatial Layout / Site Blueprint</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-slate-400 mb-2 transition-colors" />
                  {image ? (
                    <p className="text-sm text-teal-400 font-medium truncate max-w-xs">{image.name}</p>
                  ) : (
                    <p className="text-sm text-slate-300">Upload parcel layout or top-down footprint</p>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} required />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Design Matrices & Constraints</label>
              <textarea
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="e.g., Project: 'Coastal Villa'. Utilize a steep 15-degree southern slope to create a multi-level structure that steps down..."
                className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-teal-500 text-slate-200 text-sm placeholder:text-slate-700 resize-none transition-all"
                required
              />
            </div>

            <button type="submit" disabled={isGenerating} className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              <Sparkles className="w-5 h-5" />
              {isGenerating ? "Synthesizing Architecture..." : "Synthesize Design Concept"}
            </button>
          </form>
        </div>
        <div className="text-xs text-slate-600 text-center pt-6">
          Orchestrated via n8n Automation Engine & WebGL Canvas Components
        </div>
      </div>

      {/* Unified Right Column: Immersive Spatial Visualization Viewport */}
      <div className="flex-1 p-6 flex flex-col h-full bg-slate-900/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">Interactive 360° Studio Spatial View</h2>
          <span className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-950/50 border border-teal-800/60 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" /> Synthesis Engine Active
          </span>
        </div>
        <div className="flex-1 h-full">
          {/* Projecting the synthesized design concept directly onto the spatial viewport panel */}
          <Viewer3D imageUrl={generatedImgUrl} />
        </div>
      </div>
    </main>
  );
}