/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // 57개 카드 × 2개 언어 = 114개 정적 페이지를 빌드 시점에 모두 만든다.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};
export default nextConfig;
