
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './providers/ThemeProvider'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
