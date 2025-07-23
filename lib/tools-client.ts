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
