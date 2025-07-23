'use client'

import { useState, useEffect } from 'react'
import { Database, MessageCircle, Heart, RefreshCw, Trash2, Eye } from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  userIP: string
}

interface CommentData {
  comments: Comment[]
  count: number
}

interface LikeData {
  count: number
  userLikes: string[]
}

interface BlogData {
  slug: string
  comments: Comment[]
  commentCount: number
  likes: number
  likeUsers: number
}

export default function AdminPage() {
  const [blogData, setBlogData] = useState<BlogData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null)

  const knownBlogs = [
    'developer-tools-guide',
    'nextjs-blog-optimization',
    'css-grid-vs-flexbox',
    'typescript-best-practices',
    'react-hooks-guide',
    'test-relative-time'
  ]

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const dataPromises = knownBlogs.map(async (slug) => {
        const [commentsRes, likesRes] = await Promise.all([
          fetch(`/api/comments/${slug}`).catch(() => null),
          fetch(`/api/likes/${slug}`, { method: 'PUT' }).catch(() => null)
        ])

        const commentsData = commentsRes?.ok ? await commentsRes.json() : { comments: [], count: 0 }
        const likesData = likesRes?.ok ? await likesRes.json() : { count: 0, userLikes: [] }

        return {
          slug,
          comments: commentsData.comments || [],
          commentCount: commentsData.count || 0,
          likes: likesData.count || 0,
          likeUsers: likesData.userLikes?.length || 0
        }
      })

      const results = await Promise.all(dataPromises)
      setBlogData(results.filter(data => data.commentCount > 0 || data.likes > 0))
    } catch (error) {
      setError(error instanceof Error ? error.message : '데이터 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteComment = async (slug: string, commentId: string) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/comments/${slug}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      })

      if (response.ok) {
        await loadAllData()
        alert('댓글이 삭제되었습니다.')
      } else {
        const error = await response.json()
        alert(error.error || '삭제 실패')
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR')
  }

  const getTotalStats = () => {
    return blogData.reduce(
      (acc, blog) => ({
        totalComments: acc.totalComments + blog.commentCount,
        totalLikes: acc.totalLikes + blog.likes,
        totalBlogs: acc.totalBlogs + (blog.commentCount > 0 || blog.likes > 0 ? 1 : 0)
      }),
      { totalComments: 0, totalLikes: 0, totalBlogs: 0 }
    )
  }

  const stats = getTotalStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                블로그 데이터 관리
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Vercel KV에 저장된 댓글과 좋아요 데이터를 확인하고 관리합니다
              </p>
            </div>
          </div>
          
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalComments}
                </p>
                <p className="text-gray-600 dark:text-gray-400">총 댓글 수</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalLikes}
                </p>
                <p className="text-gray-600 dark:text-gray-400">총 좋아요 수</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalBlogs}
                </p>
                <p className="text-gray-600 dark:text-gray-400">활성 블로그 글</p>
              </div>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">⚠️ {error}</p>
          </div>
        )}

        {/* 블로그 데이터 목록 */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">데이터를 불러오는 중...</p>
            </div>
          ) : blogData.length > 0 ? (
            blogData.map((blog) => (
              <div
                key={blog.slug}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* 블로그 헤더 */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {blog.slug}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          댓글 {blog.commentCount}개
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          좋아요 {blog.likes}개
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                      >
                        <Eye className="w-4 h-4" />
                        글 보기
                      </a>
                      <button
                        onClick={() => setSelectedBlog(selectedBlog === blog.slug ? null : blog.slug)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {selectedBlog === blog.slug ? '접기' : '상세보기'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 댓글 상세 */}
                {selectedBlog === blog.slug && blog.comments.length > 0 && (
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                      댓글 목록
                    </h4>
                    <div className="space-y-4">
                      {blog.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {comment.author}
                              </span>
                              <span>•</span>
                              <span>{formatDate(comment.timestamp)}</span>
                              <span>•</span>
                              <span className="font-mono text-xs">
                                IP: {comment.userIP}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteComment(blog.slug, comment.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              title="댓글 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              아직 저장된 데이터가 없습니다. 댓글이나 좋아요를 추가해보세요!
            </div>
          )}
        </div>

        {/* 도움말 */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 데이터 확인 방법
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• <strong>Vercel 대시보드</strong>: Dashboard → Storage → KV → Data 탭</li>
            <li>• <strong>이 관리자 페이지</strong>: 실시간으로 댓글과 좋아요 확인</li>
            <li>• <strong>API 직접 호출</strong>: <code>/api/comments/[slug]</code>, <code>/api/likes/[slug]</code></li>
            <li>• <strong>개발자 도구</strong>: 브라우저에서 Network 탭으로 API 응답 확인</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
