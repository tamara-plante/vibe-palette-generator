
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2, Settings2 } from "lucide-react";
import { generateColorPalette, ColorPalette as ColorPaletteType, savePalette } from "@/services/colorService";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PaletteGeneratorProps {
  onGenerate: (palette: ColorPaletteType) => void;
}

const PaletteGenerator: React.FC<PaletteGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("gemini_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

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
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      toast.success("API key saved successfully");
    } else {
      localStorage.removeItem("gemini_api_key");
      toast.info("API key removed");
    }
    setIsDialogOpen(false);
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
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-4xl font-bold mb-2 title-gradient">
            Vibe Palette
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-secondary hover:bg-secondary/80" 
                  title="API Settings"
                >
                  <Settings2 size={18} className="text-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gemini API Settings</DialogTitle>
                  <DialogDescription>
                    Enter your Google Gemini API key to generate more accurate color palettes.
                    Leave empty to use the built-in mock generator.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSyA..."
                    type="password"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your API key is stored locally in your browser and never sent to our servers.
                  </p>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveApiKey}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <p className="text-muted-foreground">
          Enter a vibe, mood, or theme to generate a custom 10-color palette with design principles in mind
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
        <Button 
          type="submit" 
          disabled={isLoading || !prompt.trim()}
          className="btn-deep-blue"
        >
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
