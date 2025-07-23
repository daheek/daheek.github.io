#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

const availableIcons = [
  'Code2', 'Palette', 'Database', 'Zap', 'Terminal', 
  'FileText', 'Image', 'Calculator', 'Hash', 'Link'
]

async function createTool() {
  try {
    console.log('🛠️  새로운 도구 생성')
    console.log('='.repeat(30))
    
    const title = await question('도구 이름: ')
    const description = await question('도구 설명: ')
    const slug = await question('URL slug (예: css-converter): ')
    const tagsInput = await question('태그들 (쉼표로 구분): ')
    const tags = tagsInput.split(',').map(tag => tag.trim())
    
    console.log('\n사용 가능한 아이콘:')
    availableIcons.forEach((icon, index) => {
      console.log(`${index + 1}. ${icon}`)
    })
    
    const iconChoice = await question('\n아이콘 번호를 선택하세요: ')
    const iconName = availableIcons[parseInt(iconChoice) - 1]
    
    if (!iconName) {
      console.error('❌ 잘못된 아이콘 선택입니다.')
      process.exit(1)
    }

    // 디렉토리 생성
    const toolDir = path.join(process.cwd(), 'app', 'tools', slug)
    if (fs.existsSync(toolDir)) {
      console.error('❌ 해당 slug로 도구가 이미 존재합니다.')
      process.exit(1)
    }

    fs.mkdirSync(toolDir, { recursive: true })

    // config.ts 파일 생성
    const configContent = `import { ToolConfig } from '@/types/tools'

export const toolConfig: ToolConfig = {
  metadata: {
    title: '${title}',
    description: '${description}',
    tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
  },
  iconName: '${iconName}',
  slug: '${slug}'
}

export default toolConfig
`

    fs.writeFileSync(path.join(toolDir, 'config.ts'), configContent)

    // page.tsx 파일 생성
    const pageContent = `export default function ${title.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">${title}</h1>
      <p className="text-gray-600">${description}</p>
      {/* 여기에 도구 구현 */}
    </div>
  )
}
`

    fs.writeFileSync(path.join(toolDir, 'page.tsx'), pageContent)

    console.log('\n✅ 새로운 도구가 성공적으로 생성되었습니다!')
    console.log(`📁 위치: app/tools/${slug}/`)
    console.log(`🌐 URL: /tools/${slug}`)
    console.log('\n다음 단계:')
    console.log(`1. app/tools/${slug}/page.tsx에서 도구를 구현하세요`)
    console.log('2. 웹사이트를 새로고침하면 도구가 자동으로 나타납니다')

  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
  } finally {
    rl.close()
  }
}

createTool()
