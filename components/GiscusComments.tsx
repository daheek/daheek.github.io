'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Github } from 'lucide-react'

interface GiscusCommentsProps {
  slug: string
}

export default function GiscusComments({ slug }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // 실제 저장소 정보
  const REPO = 'daheek/daheek.github.io'
  const REPO_ID = 'MDEwOlJlcG9zaXRvcnkyNTM5OTA2MDM='
  const CATEGORY_ID = 'DIC_kwDODyOWy84CtTTI'

  useEffect(() => {
    // 다크 모드 감지
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }

    updateTheme()
    
    // 다크 모드 변경 감지
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!ref.current) return
    
    // 기존 스크립트 제거
    const existingScript = ref.current.querySelector('script')
    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    
    // Giscus 설정
    script.setAttribute('data-repo', REPO)
    script.setAttribute('data-repo-id', REPO_ID)
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', CATEGORY_ID)
    script.setAttribute('data-mapping', 'specific')
    script.setAttribute('data-term', `blog-${slug}`)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', theme === 'dark' ? 'fro' : 'light_tritanopia')
    script.setAttribute('data-lang', 'ko')

    script.onload = () => setIsLoaded(true)
    script.onerror = () => setIsLoaded(false)

    ref.current.appendChild(script)
  }, [slug, theme])

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          댓글
        </h3>
        
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500 dark:text-gray-400">GitHub Discussions</span>
        </div>
      </div>

      {!isLoaded && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400">댓글 시스템 로딩 중...</p>
        </div>
      )}

      <div ref={ref} className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}