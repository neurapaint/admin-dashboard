import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const getAdminConfig = () => {
  return {
    build: {
      outDir: "dist-admin",
    },
    server: {
      host: "::",
      port: 8081,
    },
  };
};

const getMainConfig = () => {
  return {
    server: {
      host: "::",
      port: 8080,
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const isProduction = mode === "production";
  const isAdmin = process.env.VITE_ADMIN === "true";

  const config = isAdmin ? getAdminConfig() : getMainConfig();

  return {
    ...config,
    plugins: [
      react(),
      isDev && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
