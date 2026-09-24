import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La píldora de "N Issues" del dev overlay tapaba botones reales en las capturas
  // de revisión a 375px (defecto real, 8ª revisión de Inicio) — es ruido de
  // desarrollo, no UI del producto.
  devIndicators: false,
};

export default nextConfig;
