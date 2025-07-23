import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, BlogMetadata } from '@/types/blog'

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog')

// 읽기 시간 계산 (평균 250단어/분)
function calculateReadTime(content: string): string {
  const wordsPerMinute = 250
  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime}분`
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!fs.existsSync(BLOG_DIRECTORY)) {
      return []
    }

    const blogSlugs = fs.readdirSync(BLOG_DIRECTORY, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    const posts = await Promise.all(
      blogSlugs.map(async (slug) => {
        const post = await getBlogPost(slug)
        return post
      })
    )

    return posts
      .filter((post): post is BlogPost => post !== null && post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const postDir = path.join(BLOG_DIRECTORY, slug)
    const filePath = path.join(postDir, 'index.md')

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    const metadata = data as BlogMetadata

    return {
      title: metadata.title,
      excerpt: metadata.excerpt,
      content,
      date: metadata.date,
      slug,
      readTime: calculateReadTime(content),
      tags: metadata.tags || [],
      author: metadata.author,
      coverImage: metadata.coverImage,
      published: metadata.published !== false, // 기본값 true
    }
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error)
    return null
  }
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllBlogPosts()
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getDateCategories(): Promise<{ year: string; month: string; count: number }[]> {
  const posts = await getAllBlogPosts()
  const dateCounts = posts.reduce((acc, post) => {
    const date = new Date(post.date)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const key = `${year}-${month}`
    
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(dateCounts)
    .map(([dateKey, count]) => {
      const [year, month] = dateKey.split('-')
      return { year, month, count }
    })
    .sort((a, b) => `${b.year}-${b.month}`.localeCompare(`${a.year}-${a.month}`))
}

export function searchBlogPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts

  const searchTerm = query.toLowerCase()
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function filterPostsByTags(posts: BlogPost[], tags: string[]): BlogPost[] {
  if (tags.length === 0) return posts
  
  return posts.filter(post =>
    tags.some(tag => post.tags.includes(tag))
  )
}

export function filterPostsByDate(posts: BlogPost[], year?: string, month?: string): BlogPost[] {
  if (!year) return posts

  return posts.filter(post => {
    const postDate = new Date(post.date)
    const postYear = postDate.getFullYear().toString()
    const postMonth = (postDate.getMonth() + 1).toString().padStart(2, '0')

    if (month) {
      return postYear === year && postMonth === month
    } else {
      return postYear === year
    }
  })
}

// 관련 글 추천 (태그 기반)
export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit: number = 3): BlogPost[] {
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug)
  
  // 공통 태그 수를 기준으로 점수 계산
  const scoredPosts = otherPosts.map(post => {
    const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag))
    return { post, score: commonTags.length }
  })

  return scoredPosts
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post)
}
