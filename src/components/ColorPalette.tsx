
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorPalette as ColorPaletteType, copyToClipboard } from "@/services/colorService";

interface ColorPaletteProps {
  palette: ColorPaletteType;
  isActive?: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ palette, isActive = false }) => {
  const { prompt, colors } = palette;
  
  // Function to determine if text should be light or dark based on background color
  const getTextColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance - a formula to determine if text should be dark or light
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'text-gray-900' : 'text-white';
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 mb-6",
      isActive ? "border-theme-purple shadow-lg" : "hover:border-theme-purple/50"
    )}>
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-2 truncate">{prompt}</p>
        <div className="flex flex-wrap md:flex-nowrap gap-1">
          {colors.map((color, index) => (
            <div 
              key={index} 
              className="flex-1 h-24 md:h-32 relative group transition-all duration-300 hover:flex-[1.2]"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className={cn("font-mono text-sm", getTextColor(color))}>
                  {color.toUpperCase()}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("mt-2", getTextColor(color))}
                  onClick={() => copyToClipboard(color)}
                >
                  <Copy size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ColorPalette;
