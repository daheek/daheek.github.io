'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react'
import { BlogPost } from '@/types/blog'
import { formatDate, getRelativeTime, shouldShowRelativeTime } from '@/lib/blog-client'

interface BlogPostCardProps {
  post: BlogPost
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const showRelativeTime = shouldShowRelativeTime(post.date)
  const dateDisplay = showRelativeTime ? getRelativeTime(post.date) : formatDate(post.date)
  
  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-2xl hover:shadow-purple-100 dark:hover:shadow-purple-900/20 transition-all duration-300 group">
      <div className="space-y-4">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date} title={formatDate(post.date)}>
              {dateDisplay}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} 읽기</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Read More & Like */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors group-hover:gap-3"
          >
            자세히 읽기
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>          
        </div>
      </div>
    </article>
  )
}
