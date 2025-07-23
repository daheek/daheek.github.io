export interface BlogPost {
  title: string
  excerpt: string
  content: string
  date: string
  slug: string
  readTime: string
  tags: string[]
  author?: string
  coverImage?: string
  published: boolean
}

export interface BlogMetadata {
  title: string
  excerpt: string
  date: string
  tags: string[]
  author?: string
  coverImage?: string
  published?: boolean
}

export interface BlogFilter {
  searchQuery?: string
  selectedTags?: string[]
  selectedYear?: string
  selectedMonth?: string
}

export interface BlogCategory {
  name: string
  count: number
  active: boolean
}
