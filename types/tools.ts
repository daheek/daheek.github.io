import { ReactNode } from 'react'

export interface ToolMetadata {
  title: string
  description: string
  icon: ReactNode
  href: string
  tags: string[]
}

export interface ToolConfig {
  metadata: {
    title: string
    description: string
    tags: string[]
  }
  iconName: string // Lucide icon name
  slug: string // URL slug for the tool
}

// 서버에서 로드된 도구 데이터 타입
export interface ToolData {
  title: string
  description: string
  href: string
  tags: string[]
  iconName: string
}
