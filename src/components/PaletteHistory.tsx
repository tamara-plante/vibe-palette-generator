
import React, { useState, useEffect } from 'react';
import { getSavedPalettes, ColorPalette as ColorPaletteType } from "@/services/colorService";
import ColorPalette from "./ColorPalette";
import { cn } from "@/lib/utils";

const PaletteHistory: React.FC = () => {
  const [savedPalettes, setSavedPalettes] = useState<ColorPaletteType[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const palettes = getSavedPalettes();
    setSavedPalettes(palettes);
    setIsVisible(palettes.length > 0);
  }, []);
  
  if (!isVisible || savedPalettes.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Palettes</h2>
        <button 
          onClick={() => {
            localStorage.removeItem('colorPalettes');
            setSavedPalettes([]);
            setIsVisible(false);
          }}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear History
        </button>
      </div>
      
      <div className={cn(
        "grid grid-cols-1 gap-4",
        savedPalettes.length > 2 ? "md:grid-cols-2" : ""
      )}>
        {savedPalettes.map((palette) => (
          <ColorPalette key={palette.id} palette={palette} />
        ))}
      </div>
    </div>
  );
};

export default PaletteHistory;
