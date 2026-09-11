import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client", "@node-rs/argon2", "bcryptjs"],
};

export default nextConfig;
