import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Ensure @swc/helpers is included in Lambda bundle for OpenNext
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@swc/helpers/**/*"],
  },
};

export default nextConfig;
