import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GiscusComments from '@/components/GiscusComments'
import { getBlogPost, getAllBlogPosts, getRelatedPosts } from '@/lib/blog-server'
import { formatDate, getRelativeTime, shouldShowRelativeTime } from '@/lib/blog-client'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: '글을 찾을 수 없습니다',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    notFound()
  }

  const allPosts = await getAllBlogPosts()
  const relatedPosts = getRelatedPosts(post, allPosts, 3)
  
  const showRelativeTime = shouldShowRelativeTime(post.date)
  const dateDisplay = showRelativeTime ? getRelativeTime(post.date) : formatDate(post.date)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 뒤로가기 */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              블로그로 돌아가기
            </Link>
          </div>

          {/* 헤더 */}
          <header className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
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

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mb-8">
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

            {/* 요약 */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-lg">
              <p className="text-gray-700 dark:text-gray-300 italic">
                {post.excerpt}
              </p>
            </div>
          </header>

          {/* 콘텐츠 */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-purple">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = node?.data?.meta !== undefined ? false : !match
                  return !isInline && match ? (
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 댓글 시스템 */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <GiscusComments slug={post.slug} />
          </div>

          {/* 관련 글 */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                관련 글
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20 transition-all duration-300 group"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(relatedPost.date)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 내비게이션 */}
          <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex justify-between items-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                모든 글 보기
              </Link>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.readTime} 읽기 완료
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
