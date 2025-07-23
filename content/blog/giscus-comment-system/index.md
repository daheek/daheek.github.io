---
title: "GitHub Discussions로 만드는 완전 무료 댓글 시스템 - Giscus 도입기"
excerpt: "비용 걱정 없는 완전 무료 댓글 시스템! GitHub Discussions와 Giscus를 활용해 개발자 친화적인 댓글 기능을 구축한 실전 경험을 공유합니다."
date: "2025-07-23 14:52"
tags: ["React", "GitHub", "Giscus", "댓글시스템", "무료", "Next.js"]
author: "dahee"
published: true
---

개인 블로그를 운영하면서 가장 고민되는 부분 중 하나가 바로 **댓글 시스템**입니다. 방문자들과 소통할 수 있는 창구이지만, 대부분의 댓글 서비스는 비용이 발생하거나 광고가 노출되는 단점이 있었습니다.

그러다 발견한 것이 바로 **Giscus** - GitHub Discussions를 활용한 완전 무료 댓글 시스템입니다. 실제 도입 과정과 경험을 공유해보겠습니다.

## 🤔 기존 댓글 시스템의 문제점

### Disqus의 한계
- 무료 플랜에서 광고 강제 노출
- 사용자 데이터 수집 이슈
- 느린 로딩 속도

### Vercel KV + 자체 구현의 문제
- 무료 한도 초과 시 월 $5-20+ 요금
- 서버 관리 부담
- 스팸 방지 기능 직접 구현 필요

## 💡 Giscus를 선택한 이유

### 완전 무료
GitHub Discussions 기반으로 **영구 무료** 사용 가능합니다.

### 개발자 친화적
- GitHub 계정으로 로그인
- 마크다운 지원
- 코드 블록, 이모지 반응 지원

### 완전한 관리 권한
- GitHub에서 직접 댓글 관리
- 스팸 차단, 사용자 차단 가능
- 댓글 수정/삭제 권한

## 🛠️ 설치 과정 (5분이면 완료!)

### 1단계: GitHub 저장소 준비
```bash
# 저장소가 Public이어야 함
# Settings → Features → Discussions 활성화
```

### 2단계: Giscus 앱 설치
[github.com/apps/giscus](https://github.com/apps/giscus)에서 저장소에 앱을 설치합니다.

### 3단계: 설정 정보 생성
[giscus.app](https://giscus.app)에서 저장소 정보를 입력하면 자동으로 설정 코드가 생성됩니다.

### 4단계: 설정 정보 확인
[giscus.app/ko](https://giscus.app/ko)에서 생성된 스크립트를 확인하세요:

```html
<!-- giscus.app에서 생성된 스크립트 예시 -->
<script src="https://giscus.app/client.js"
        data-repo="username/repository"
        data-repo-id="R_kgDONlFNrQ"
        data-category="General"
        data-category-id="DIC_kwDONlFNrc4Cl9mE"
        ...>
</script>
```

> 💡 **중요**: `data-repo-id`와 `data-category-id` 값을 복사해서 아래 React 컴포넌트에 사용하세요!

### 5단계: React 컴포넌트 구현
```typescript
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

  // ⚠️ 아래 값들을 giscus.app에서 생성된 스크립트의 값으로 교체하세요!
  const REPO = 'username/repository'  // data-repo 값
  const REPO_ID = 'R_kgDONlFNrQ'     // data-repo-id 값 복사
  const CATEGORY_ID = 'DIC_kwDONlFNrc4Cl9mE'  // data-category-id 값 복사

  useEffect(() => {
    // 다크 모드 자동 감지
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }

    updateTheme()
    
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!ref.current) return
    
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
    script.setAttribute('data-theme', theme)
    script.setAttribute('data-lang', 'ko')

    script.onload = () => setIsLoaded(true)

    ref.current.appendChild(script)
  }, [slug, theme])

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          댓글
        </h3>
        
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">GitHub Discussions</span>
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
```

## ⚙️ 핵심 설정 포인트

### 페이지-댓글 매핑
```typescript
// 각 블로그 글마다 고유한 Discussion 생성
script.setAttribute('data-mapping', 'specific')
script.setAttribute('data-term', `blog-${slug}`)
```

### 다크모드 자동 전환
```typescript
// 사이트 테마에 따라 댓글 테마도 자동 변경
script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
```

### 한국어 설정
```typescript
script.setAttribute('data-lang', 'ko')
```

## 🎯 실제 사용 경험

### 장점들
1. **완전 무료**: 비용 걱정 없이 영구 사용
2. **빠른 로딩**: CDN을 통한 빠른 스크립트 로딩
3. **개발자 친화적**: 마크다운, 코드 블록 지원
4. **스팸 방지**: GitHub 계정 인증으로 스팸 차단
5. **SEO 친화적**: 댓글이 GitHub에 실제 콘텐츠로 저장

### 아쉬운 점들
1. **GitHub 계정 필요**: 일반 사용자에게는 진입장벽
2. **익명 댓글 불가**: 실명 기반 댓글만 가능
3. **커스터마이징 제한**: 디자인 변경에 한계

## 📈 성과 및 통계

도입 후 실제 변화:
- **로딩 속도**: 3초 → 1초로 개선
- **댓글 품질**: GitHub 인증으로 스팸 완전 차단
- **운영 비용**: $10/월 → $0/월
- **관리 편의성**: GitHub 통합으로 관리 용이

## 🚀 추가 최적화 팁

### 1. 로딩 성능 개선
```typescript
// 댓글 영역 근처에서만 로딩
script.setAttribute('data-loading', 'lazy')
```

### 2. 테마 커스터마이징
```css
/* 댓글 영역 스타일링 */
.giscus-frame {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
```

### 3. 백링크 설정
```html
<!-- 짧은 URL로 백링크 설정 -->
<meta name="giscus:backlink" content="https://yourblog.com/short-url">
```

## 🎉 결론

Giscus는 개인 블로그 운영자에게 **완벽한 댓글 솔루션**입니다. 특히:

- **비용 절약**: 월 $10+ 절약
- **개발자 블로그**: 기술적 댓글에 최적화
- **장기 운영**: 영구 무료로 지속 가능

GitHub를 사용하는 개발자라면 주저 없이 추천합니다!

## 🔗 참고 링크

- [Giscus 공식 사이트](https://giscus.app)
- [GitHub Discussions 문서](https://docs.github.com/discussions)
- [Giscus GitHub 저장소](https://github.com/giscus/giscus)


