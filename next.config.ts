import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto: evita que Next infiera mal el root por lockfiles
  // sueltos en directorios superiores.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
