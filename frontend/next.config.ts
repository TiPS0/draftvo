import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.TAURI_BUILD === "true" ? "export" : undefined,
};

export default nextConfig;
