
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { generateColorPalette, ColorPalette as ColorPaletteType, savePalette } from "@/services/colorService";

interface PaletteGeneratorProps {
  onGenerate: (palette: ColorPaletteType) => void;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const palette = await generateColorPalette(prompt);
      if (palette) {
        onGenerate(palette);
        savePalette(palette);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const placeholders = [
    "Ocean sunset",
    "Neon cyberpunk",
    "Forest morning",
    "Vintage cafe",
    "Pastel spring",
    "Summer beach",
    "Cozy autumn"
  ];
  
  const [placeholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length)]
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-theme-purple to-theme-dark-purple bg-clip-text text-transparent">
          Vibe Palette
        </h1>
        <p className="text-muted-foreground">
          Enter a vibe, mood, or theme to generate a custom color palette
        </p>
      </div>
      
      <form onSubmit={handleGenerate} className="flex gap-2 mb-8">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Try "${placeholder}"`}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Wand2 size={18} className="animate-spin" /> Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Wand2 size={18} /> Generate
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default PaletteGenerator;
