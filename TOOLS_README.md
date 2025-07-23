# Tools 시스템

이 프로젝트는 동적으로 도구를 관리할 수 있는 시스템을 제공합니다.

## 구조

```
app/tools/
├── page.tsx                    # 도구 목록 페이지
├── [tool-name]/
│   ├── config.ts              # 도구 메타데이터
│   └── page.tsx               # 도구 구현
└── ...
```

## 새로운 도구 추가하기

### 방법 1: CLI 스크립트 사용 (권장)

```bash
npm run create-tool
```

대화형 프롬프트를 따라 도구를 생성하세요.

### 방법 2: 수동 생성

1. `app/tools/` 아래에 새 디렉토리 생성
2. `config.ts` 파일 생성:

```typescript
import { ToolConfig } from '@/types/tools'

export const toolConfig: ToolConfig = {
  metadata: {
    title: '도구 이름',
    description: '도구 설명',
    tags: ['태그1', '태그2']
  },
  iconName: 'Calculator', // Lucide 아이콘 이름
  slug: 'tool-slug'
}

export default toolConfig
```

3. `page.tsx` 파일 생성:

```typescript
export default function MyToolPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">도구 이름</h1>
      {/* 도구 구현 */}
    </div>
  )
}
```

## 사용 가능한 아이콘

- Code2
- Palette  
- Database
- Zap
- Terminal
- FileText
- Image
- Calculator
- Hash
- Link

추가 아이콘이 필요하면 `lib/tools.ts`의 `iconMap`에 추가하세요.

## 자동 기능

- 도구는 자동으로 메인 도구 페이지에 표시됩니다
- 태그 기반 필터링이 자동으로 활성화됩니다
- 카테고리 카운트가 자동으로 계산됩니다
- URL 라우팅이 자동으로 설정됩니다

## 타입 정의

도구의 타입은 `types/tools.ts`에 정의되어 있습니다:

```typescript
export interface ToolConfig {
  metadata: Omit<ToolMetadata, 'icon' | 'href'>
  iconName: string
  slug: string
}
```
