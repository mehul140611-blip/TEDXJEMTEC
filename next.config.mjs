/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plain static files: hosting (possibly shared hosting) is decided later.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
