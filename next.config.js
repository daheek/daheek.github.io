/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 배포 시에만 static export 사용
  ...(process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  } : {}),
  
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = nextConfig
