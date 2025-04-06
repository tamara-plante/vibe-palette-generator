
import { toast } from "sonner";

const API_URL = "https://api.openai.com/v1/chat/completions";
// We're using a free API key from https://platform.openai.com/docs/quickstart
// This would typically be stored in environment variables
const MODEL = "gpt-3.5-turbo";

export interface ColorPalette {
  id: string;
  prompt: string;
  colors: string[];
  timestamp: number;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const generateColorPalette = async (prompt: string): Promise<ColorPalette | null> => {
  try {
    // Since we're making this as a frontend-only app for GitHub pages,
    // we'll use a mock response for demonstration purposes
    // In a real app, you would call the actual API with a valid key
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a semi-random but thematically appropriate color palette based on the prompt
    const colors = generateMockColors(prompt);
    
    const palette: ColorPalette = {
      id: generateId(),
      prompt,
      colors,
      timestamp: Date.now(),
    };
    
    return palette;
  } catch (error) {
    console.error("Error generating color palette:", error);
    toast.error("Failed to generate color palette. Please try again.");
    return null;
  }
};

// Helper function to generate mock colors based on the prompt
function generateMockColors(prompt: string): string[] {
  const lowercasePrompt = prompt.toLowerCase();
  
  // Base seed colors for different themes
  const themeColors: Record<string, string[]> = {
    ocean: ['#1A535C', '#4ECDC4', '#F7FFF7', '#006E90', '#2EC4B6'],
    sunset: ['#FF9F1C', '#FFBF69', '#FFFFFF', '#CBF3F0', '#2EC4B6'],
    forest: ['#2D3047', '#93B7BE', '#E0CA3C', '#A37B45', '#3A5311'],
    pastel: ['#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF', '#CDB4DB'],
    neon: ['#FF0099', '#00FFFF', '#00FF00', '#FFFF00', '#FF00FF'],
    vintage: ['#8B5E34', '#EAD2AC', '#CDC6AE', '#906E4D', '#5B4B49'],
    minimal: ['#FFFFFF', '#F5F5F5', '#EBEBEB', '#CCCCCC', '#333333'],
    cyberpunk: ['#FF00FF', '#00FFFF', '#F9FC5B', '#6EF971', '#4820DF'],
    autumn: ['#D55E00', '#F0E442', '#CC9966', '#CC6633', '#AA5500'],
    winter: ['#DEEFF5', '#B0E0E6', '#6495ED', '#4682B4', '#4F6D7A'],
    spring: ['#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7', '#9D8189'],
    summer: ['#F8FD89', '#FFC0CB', '#FF7F50', '#87CEEB', '#00FF00'],
  };
  
  // Determine which theme to use based on the prompt
  let selectedTheme = 'minimal';
  for (const theme in themeColors) {
    if (lowercasePrompt.includes(theme) || 
        (theme === 'ocean' && (lowercasePrompt.includes('blue') || lowercasePrompt.includes('water') || lowercasePrompt.includes('sea'))) ||
        (theme === 'sunset' && (lowercasePrompt.includes('orange') || lowercasePrompt.includes('warm') || lowercasePrompt.includes('evening'))) ||
        (theme === 'forest' && (lowercasePrompt.includes('green') || lowercasePrompt.includes('nature') || lowercasePrompt.includes('trees'))) ||
        (theme === 'pastel' && (lowercasePrompt.includes('soft') || lowercasePrompt.includes('light') || lowercasePrompt.includes('gentle'))) ||
        (theme === 'neon' && (lowercasePrompt.includes('bright') || lowercasePrompt.includes('vibrant') || lowercasePrompt.includes('night'))) ||
        (theme === 'vintage' && (lowercasePrompt.includes('retro') || lowercasePrompt.includes('old') || lowercasePrompt.includes('classic')))) {
      selectedTheme = theme;
      break;
    }
  }
  
  // Add slight variations to the colors
  return themeColors[selectedTheme].map(color => {
    // Generate a slight variation of the hex color
    return adjustColorBrightness(color, Math.random() * 20 - 10);
  });
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex: string, percent: number): string {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  // Adjust brightness
  r = Math.min(255, Math.max(0, Math.round(r * (1 + percent / 100))));
  g = Math.min(255, Math.max(0, Math.round(g * (1 + percent / 100))));
  b = Math.min(255, Math.max(0, Math.round(b * (1 + percent / 100))));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Function to save palettes to local storage
export const savePalette = (palette: ColorPalette): void => {
  const savedPalettes = getSavedPalettes();
  const updatedPalettes = [palette, ...savedPalettes.slice(0, 9)]; // Keep only the last 10 palettes
  localStorage.setItem('colorPalettes', JSON.stringify(updatedPalettes));
};

// Function to get saved palettes from local storage
export const getSavedPalettes = (): ColorPalette[] => {
  const savedData = localStorage.getItem('colorPalettes');
  return savedData ? JSON.parse(savedData) : [];
};

// Function to copy color to clipboard
export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success(`Copied ${text} to clipboard`);
    })
    .catch(() => {
      toast.error("Failed to copy to clipboard");
    });
};
