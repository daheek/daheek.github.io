import type { Metadata } from 'next'
import { ThemeProvider } from '@/lib/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dahee\'s Dev Tools',
  description: '현업에서 사용하는 개발자 도구들을 공유하는 블로그',
  keywords: ['개발자 도구', 'Developer Tools', '웹 개발', 'Frontend', 'Backend'],
  authors: [{ name: 'Dahee' }],
  openGraph: {
    title: 'Dahee\'s Dev Tools',
    description: '현업에서 사용하는 개발자 도구들을 공유하는 블로그',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <ThemeProvider defaultTheme="system" storageKey="dahee-blog-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
