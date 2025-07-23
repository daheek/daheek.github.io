import { BlogPost, BlogFilter } from '@/types/blog'

export function getRelativeTime(dateString: string): string {
  const now = new Date()
  const postDate = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

  // 미래 날짜인 경우 (시스템 시간 오차 등)
  if (diffInSeconds < 0) {
    return '방금 전'
  }

  // 1분 미만
  if (diffInSeconds < 60) {
    return '방금 전'
  }

  // 1시간 미만
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}분 전`
  }

  // 24시간 미만
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}시간 전`
  }

  // 7일 미만
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}일 전`
  }

  // 30일 미만
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks}주 전`
  }

  // 12개월 미만
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months}개월 전`
  }

  // 1년 이상
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years}년 전`
}

export function shouldShowRelativeTime(dateString: string): boolean {
  const now = new Date()
  const postDate = new Date(dateString)
  const diffInDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // 7일 이내의 글만 상대적 시간으로 표시
  return diffInDays <= 7
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts

  const searchTerm = query.toLowerCase()
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
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

export function applyFilters(posts: BlogPost[], filter: BlogFilter): BlogPost[] {
  let filteredPosts = [...posts]

  // 검색어 필터
  if (filter.searchQuery) {
    filteredPosts = searchPosts(filteredPosts, filter.searchQuery)
  }

  // 태그 필터
  if (filter.selectedTags && filter.selectedTags.length > 0) {
    filteredPosts = filterPostsByTags(filteredPosts, filter.selectedTags)
  }

  // 날짜 필터
  if (filter.selectedYear) {
    filteredPosts = filterPostsByDate(filteredPosts, filter.selectedYear, filter.selectedMonth)
  }

  return filteredPosts
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  })
}

export function getMonthName(month: string): string {
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]
  return monthNames[parseInt(month) - 1] || month
}

export function groupPostsByYear(posts: BlogPost[]): Record<string, BlogPost[]> {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear().toString()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<string, BlogPost[]>)
}

export function getUniqueYears(posts: BlogPost[]): string[] {
  const years = posts.map(post => new Date(post.date).getFullYear().toString())
  return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a))
}

export function getMonthsForYear(posts: BlogPost[], year: string): string[] {
  const monthsInYear = posts
    .filter(post => new Date(post.date).getFullYear().toString() === year)
    .map(post => (new Date(post.date).getMonth() + 1).toString().padStart(2, '0'))
  
  return Array.from(new Set(monthsInYear)).sort((a, b) => b.localeCompare(a))
}
