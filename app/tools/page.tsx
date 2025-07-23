import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ToolCard from '@/components/ToolCard'
import { getAllToolsServer } from '@/lib/tools-server'
import { getIconComponent } from '@/lib/tools-client'
import ToolsClientContent from './ToolsClientContent'

export default async function ToolsPage() {
  // 서버에서 도구 데이터 로드
  const toolsData = await getAllToolsServer()
  
  // 아이콘과 함께 완전한 도구 객체 생성
  const tools = toolsData.map(tool => ({
    ...tool,
    icon: getIconComponent(tool.iconName)
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                개발자 <span className="gradient-text">도구 모음</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                현업에서 실제로 사용할 수 있는 다양한 개발자 도구들을 제공합니다. 
                별도 설치 없이 브라우저에서 바로 사용하세요.
              </p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                총 {tools.length}개의 도구
              </div>
            </div>
          </div>
        </section>

        {/* 클라이언트 컴포넌트에서 상호작용 처리 */}
        <ToolsClientContent tools={tools} />

        {/* CTA Section */}
        <section className="py-16 bg-purple-600 dark:bg-purple-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                더 많은 도구가 필요하신가요?
              </h2>
              <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                제안하고 싶은 도구나 개선사항이 있다면 언제든 연락해주세요. 
                함께 더 나은 개발 환경을 만들어갑시다.
              </p>
              <a
                href="mailto:contact@example.com"
                className="inline-flex items-center px-8 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                제안하기
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
