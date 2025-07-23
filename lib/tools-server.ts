import { ToolConfig } from '@/types/tools'
import { 
  Code2, 
  Palette, 
  Database, 
  Zap, 
  Terminal, 
  FileText,
  Image,
  Calculator,
  Hash,
  Link,
  LucideIcon
} from 'lucide-react'
import fs from 'fs'
import path from 'path'
import { createElement } from 'react'

// Lucide 아이콘 매핑
const iconMap: Record<string, LucideIcon> = {
  'Code2': Code2,
  'Palette': Palette,
  'Database': Database,
  'Zap': Zap,
  'Terminal': Terminal,
  'FileText': FileText,
  'Image': Image,
  'Calculator': Calculator,
  'Hash': Hash,
  'Link': Link,
}

export async function getToolMetadata(toolSlug: string): Promise<ToolConfig | null> {
  try {
    const toolPath = path.join(process.cwd(), 'app/tools', toolSlug)
    const configPath = path.join(toolPath, 'config.ts')
    
    if (!fs.existsSync(configPath)) {
      return null
    }

    // 동적으로 config 파일 import
    const config = await import(`@/app/tools/${toolSlug}/config`)
    return config.default || config.toolConfig
  } catch (error) {
    console.error(`Error loading tool config for ${toolSlug}:`, error)
    return null
  }
}

// 서버 컴포넌트에서만 사용 가능
export async function getAllToolsServer(): Promise<Array<{
  title: string
  description: string
  href: string
  tags: string[]
  iconName: string
}>> {
  try {
    const toolsPath = path.join(process.cwd(), 'app/tools')
    
    if (!fs.existsSync(toolsPath)) {
      return []
    }

    const entries = fs.readdirSync(toolsPath, { withFileTypes: true })
    
    const toolPromises = entries
      .filter(entry => entry.isDirectory())
      .map(async (entry) => {
        const config = await getToolMetadata(entry.name)
        if (!config) return null

        return {
          ...config.metadata,
          href: `/tools/${config.slug}`,
          iconName: config.iconName
        }
      })

    const tools = await Promise.all(toolPromises)
    return tools.filter((tool): tool is NonNullable<typeof tool> => tool !== null)
  } catch (error) {
    console.error('Error loading tools:', error)
    return []
  }
}

export function getToolsByTag<T extends { tags: string[] }>(tools: T[], tag: string): T[] {
  return tools.filter(tool => tool.tags.includes(tag))
}

export function getCategories<T extends { tags: string[] }>(tools: T[]) {
  const categories = [
    { name: 'All Tools', count: tools.length, active: true },
  ]

  const tagCounts = tools.reduce((acc, tool) => {
    tool.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // 주요 카테고리들만 추가
  const mainCategories = ['Frontend', 'Backend', 'Design', 'Utility']
  mainCategories.forEach(category => {
    if (tagCounts[category]) {
      categories.push({
        name: category,
        count: tagCounts[category],
        active: false
      })
    }
  })

  return categories
}

// 아이콘을 클라이언트에서 렌더링하기 위한 함수
export function getIconComponent(iconName: string) {
  const IconComponent = iconMap[iconName]
  return IconComponent ? createElement(IconComponent, { className: "w-6 h-6" }) : null
}
