/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // 67개 카드 × 2개 언어 = 134개 카드 페이지와 OG 이미지를 빌드 시점에 모두 만든다.
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // OG 이미지(ImageResponse)가 쓰는 한글 서브셋 폰트를 서버 번들에 포함한다.
    outputFileTracingIncludes: {
      '/**/*': ['./assets/og-fonts/**/*', './public/images/**/*'],
    },
  },
};
export default nextConfig;
