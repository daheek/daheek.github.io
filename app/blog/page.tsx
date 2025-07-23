import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllBlogPosts, getAllTags, getDateCategories } from '@/lib/blog-server'
import BlogClientContent from './BlogClientContent'

export default async function BlogPage() {
  // 서버에서 블로그 데이터 로드
  const [posts, tags, dateCategories] = await Promise.all([
    getAllBlogPosts(),
    getAllTags(),
    getDateCategories()
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                개발 <span className="gradient-text">블로그</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                개발하면서 얻은 인사이트와 노하우를 공유합니다. 
                실무에서 바로 적용할 수 있는 팁들을 제공합니다.
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                총 {posts.length}개의 글 • {tags.length}개의 태그
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <BlogClientContent 
            posts={posts} 
            tags={tags} 
            dateCategories={dateCategories} 
          />
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                새 글 알림 받기
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                새로운 개발 팁과 도구 소식을 가장 먼저 받아보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                  구독하기
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
