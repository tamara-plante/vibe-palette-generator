
import React, { useState } from 'react';
import PaletteGenerator from '@/components/PaletteGenerator';
import ColorPalette from '@/components/ColorPalette';
import PaletteHistory from '@/components/PaletteHistory';
import { ColorPalette as ColorPaletteType } from '@/services/colorService';
import { Github } from 'lucide-react';

const Index = () => {
  const [currentPalette, setCurrentPalette] = useState<ColorPaletteType | null>(null);

  const handleGenerate = (palette: ColorPaletteType) => {
    setCurrentPalette(palette);
    // Force a refresh of the history component whenever a new palette is generated
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <PaletteGenerator onGenerate={handleGenerate} />
      
      {/* Current Palette */}
      {currentPalette && (
        <div className="w-full max-w-3xl mx-auto mt-8">
          <ColorPalette palette={currentPalette} isActive={true} />
        </div>
      )}

      {/* History */}
      <PaletteHistory />
      
      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Built with React and Tailwind CSS</p>
        <div className="flex items-center justify-center mt-2 gap-2">
          <a 
            href="https://github.com/yourusername/vibe-palette" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github size={16} /> Source Code
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
