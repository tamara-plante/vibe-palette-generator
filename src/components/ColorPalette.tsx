
import React from 'react';
import { ColorPalette as ColorPaletteType, copyToClipboard } from "@/services/colorService";
import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  palette: ColorPaletteType;
  isActive?: boolean;
  onSelect?: () => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  palette, 
  isActive = false,
  onSelect
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };
  
  const handleColorClick = (color: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the entire palette click
    copyToClipboard(color);
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "p-4 rounded-lg shadow-sm transition-all duration-200 bg-card", 
        isActive ? "ring-2 ring-primary" : "hover:shadow-md cursor-pointer"
      )}
    >
      {palette.prompt && (
        <h3 className="text-md mb-2 font-medium truncate">{palette.prompt}</h3>
      )}
      
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {palette.colors.map((color, index) => (
          <div key={index} className="space-y-1">
            <div 
              className="w-full aspect-square rounded cursor-pointer relative group"
              style={{ backgroundColor: color }}
              onClick={(e) => handleColorClick(color, e)}
              title={`Click to copy ${color}`}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 text-white text-xs font-mono rounded transition-opacity">
                Copy
              </span>
            </div>
            <p className="text-xs font-mono text-center">{color}</p>
          </div>
        ))}
      </div>
      
      {palette.timestamp && (
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(palette.timestamp).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default ColorPalette;
