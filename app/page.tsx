'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ToolCard from '@/components/ToolCard'
import { 
  Code2, 
  Palette, 
  Database, 
  Zap, 
  Terminal, 
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const tools = [
    {
      title: 'Color Palette Generator',
      description: '브랜드에 맞는 색상 팔레트를 생성하고 내보낼 수 있는 도구',
      icon: <Palette className="w-6 h-6" />,
      href: '/tools/color-palette',
      tags: ['Design', 'CSS', 'Colors']
    },
    {
      title: 'API Response Formatter',
      description: 'JSON API 응답을 읽기 쉽게 포맷팅하고 검증하는 도구',
      icon: <Database className="w-6 h-6" />,
      href: '/tools/api-formatter',
      tags: ['API', 'JSON', 'Development']
    },
    {
      title: 'Code Snippet Manager',
      description: '자주 사용하는 코드 스니펫을 저장하고 관리하는 도구',
      icon: <Code2 className="w-6 h-6" />,
      href: '/tools/snippet-manager',
      tags: ['Code', 'Productivity', 'Snippets']
    },
    {
      title: 'Performance Optimizer',
      description: '웹 성능을 분석하고 최적화 제안을 제공하는 도구',
      icon: <Zap className="w-6 h-6" />,
      href: '/tools/performance',
      tags: ['Performance', 'Optimization', 'Web']
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-purple-700 dark:text-purple-300 text-sm font-medium">Developer Tools</span>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                현업에서 사용하는{' '}
                <span className="gradient-text">개발자 도구</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                실제 업무에서 사용할 수 있는 유용한 개발자 도구들을 만들고 공유합니다. 
                효율적인 개발 워크플로우를 위한 다양한 유틸리티를 제공합니다.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/tools"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  도구 둘러보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.a>
                
                <motion.a
                  href="/blog"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:border-purple-300 hover:text-purple-700 dark:hover:border-purple-400 dark:hover:text-purple-400 transition-colors"
                >
                  블로그 읽기
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                주요 개발자 도구
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                현업에서 실제로 사용할 수 있는 유용한 도구들을 소개합니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ToolCard {...tool} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Terminal className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">현업 중심</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  실제 업무에서 사용할 수 있는 실용적인 도구들을 제공합니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">웹 기반</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  별도 설치 없이 브라우저에서 바로 사용할 수 있습니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">고성능</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  빠르고 효율적인 성능으로 개발 생산성을 향상시킵니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
