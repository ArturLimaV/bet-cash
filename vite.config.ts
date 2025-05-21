
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Create the plugin array, ensuring we only include plugins that exist
  const plugins = [react()];
  
  // Only try to use the componentTagger plugin in development mode
  if (mode === 'development') {
    try {
      // Try to dynamically import the tagger if it exists
      const { componentTagger } = require("lovable-tagger");
      if (componentTagger) {
        plugins.push(componentTagger());
      }
    } catch (error) {
      // If the package doesn't exist, just continue without it
      console.warn("lovable-tagger not available, continuing without it");
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true, // Limpa a pasta dist antes de cada build
      sourcemap: false,
      minify: 'terser',
    },
  };
});
