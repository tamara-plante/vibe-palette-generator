
import { toast } from "sonner";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
// This would typically be stored in environment variables
const MODEL = "gemini-pro";

export interface ColorPalette {
  id: string;
  prompt: string;
  colors: string[];
  timestamp: number;
}

export const generateColorPalette = async (prompt: string): Promise<ColorPalette | null> => {
  try {
    let colors: string[];
    
    // Try to use Gemini API if the user provides an API key in localStorage
    const apiKey = localStorage.getItem('gemini_api_key');
    
    if (apiKey) {
      // Gemini API call
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Generate a harmonious color palette of 10 hex colors based on the theme: ${prompt}. 
                  Consider design principles including color theory, the nature of light, human vision, contrast ratios, and aesthetic harmony.
                  Create a balanced palette that works well together from a professional designer's perspective.
                  Return ONLY a JSON array of hex color codes without any explanation.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      try {
        // Extract content from Gemini response
        const content = data.candidates[0].content.parts[0].text;
        // Parse the content as a JSON array of strings
        colors = JSON.parse(content);
        
        // Validate that we got an array of 10 hex colors
        if (!Array.isArray(colors) || colors.length !== 10 || !colors.every(c => /^#[0-9A-F]{6}$/i.test(c))) {
          throw new Error('Invalid color format received');
        }
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        // Fall back to mock colors
        colors = generateMockColors(prompt);
      }
    } else {
      // No API key, use mock generator
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      colors = generateMockColors(prompt);
    }
    
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
    ocean: ['#1A535C', '#4ECDC4', '#F7FFF7', '#006E90', '#2EC4B6', '#76C1D4', '#B7D5D4', '#2F6D80', '#5AACAF', '#A1CCC8'],
    sunset: ['#FF9F1C', '#FFBF69', '#FFFFFF', '#CBF3F0', '#2EC4B6', '#F86F15', '#FFD29D', '#F4A15D', '#E67F2E', '#B64A00'],
    forest: ['#2D3047', '#93B7BE', '#E0CA3C', '#A37B45', '#3A5311', '#5B7C3B', '#708F4C', '#3D500F', '#6A7B38', '#8C9F5D'],
    pastel: ['#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF', '#CDB4DB', '#FBFACD', '#D0F4DE', '#E9ECF5', '#F1C0E8', '#CFBAF0'],
    neon: ['#FF0099', '#00FFFF', '#00FF00', '#FFFF00', '#FF00FF', '#FE01B1', '#7DF9FF', '#39FF14', '#FFDD00', '#BC13FE'],
    vintage: ['#8B5E34', '#EAD2AC', '#CDC6AE', '#906E4D', '#5B4B49', '#A78B71', '#C8B8A9', '#7D4427', '#BCA38F', '#716151'],
    minimal: ['#FFFFFF', '#F5F5F5', '#EBEBEB', '#CCCCCC', '#333333', '#999999', '#666666', '#DDDDDD', '#444444', '#AAAAAA'],
    cyberpunk: ['#FF00FF', '#00FFFF', '#F9FC5B', '#6EF971', '#4820DF', '#FE01B1', '#01FFFF', '#DCFD01', '#39FF14', '#8B00FF'],
    autumn: ['#D55E00', '#F0E442', '#CC9966', '#CC6633', '#AA5500', '#E67E22', '#FFBB77', '#B35900', '#996633', '#CC6600'],
    winter: ['#DEEFF5', '#B0E0E6', '#6495ED', '#4682B4', '#4F6D7A', '#A1C6EA', '#7D9EB7', '#2E5984', '#CAE4F7', '#8EACC6'],
    spring: ['#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7', '#9D8189', '#E8F3D6', '#FCF4DD', '#FFDFD3', '#FEC5BB', '#EAD7D7'],
    summer: ['#F8FD89', '#FFC0CB', '#FF7F50', '#87CEEB', '#00FF00', '#FFBF00', '#40E0D0', '#FF6347', '#FFD700', '#98FB98'],
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

// Function to remove a specific palette by ID
export const removePalette = (id: string): void => {
  const savedPalettes = getSavedPalettes();
  const updatedPalettes = savedPalettes.filter(palette => palette.id !== id);
  localStorage.setItem('colorPalettes', JSON.stringify(updatedPalettes));
  // Dispatch event to notify other components
  window.dispatchEvent(new Event('paletteUpdated'));
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
