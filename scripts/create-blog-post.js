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

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .trim('-') // 앞뒤 하이픈 제거
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0]
}

async function createBlogPost() {
  try {
    console.log('📝 새로운 블로그 글 생성')
    console.log('='.repeat(30))
    
    const title = await question('글 제목: ')
    const excerpt = await question('글 요약: ')
    const tagsInput = await question('태그들 (쉼표로 구분): ')
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
    const author = await question('작성자 (기본값: Dahee Kim): ') || 'Dahee Kim'
    
    const autoSlug = generateSlug(title)
    const slug = await question(`URL slug (기본값: ${autoSlug}): `) || autoSlug
    
    const date = getCurrentDate()

    // 디렉토리 생성
    const blogDir = path.join(process.cwd(), 'content', 'blog', slug)
    if (fs.existsSync(blogDir)) {
      console.error('❌ 해당 slug로 글이 이미 존재합니다.')
      process.exit(1)
    }

    fs.mkdirSync(blogDir, { recursive: true })

    // 마크다운 파일 생성
    const frontmatter = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
author: "${author}"
published: true
---

# ${title}

${excerpt}

## 개요

여기에 글 내용을 작성하세요.

## 결론

글의 마무리 내용을 작성하세요.
`

    fs.writeFileSync(path.join(blogDir, 'index.md'), frontmatter)

    console.log('\n✅ 새로운 블로그 글이 성공적으로 생성되었습니다!')
    console.log(`📁 위치: content/blog/${slug}/`)
    console.log(`🌐 URL: /blog/${slug}`)
    console.log('\n다음 단계:')
    console.log(`1. content/blog/${slug}/index.md에서 글을 작성하세요`)
    console.log('2. 웹사이트를 새로고침하면 글이 자동으로 나타납니다')

  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
  } finally {
    rl.close()
  }
}

createBlogPost()
