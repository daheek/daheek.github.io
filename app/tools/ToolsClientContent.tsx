'use client'

import { motion } from 'framer-motion'
import ToolCard from '@/components/ToolCard'
import { getCategories, getToolsByTag } from '@/lib/tools-client'
import { useState } from 'react'

interface Tool {
  title: string
  description: string
  href: string
  tags: string[]
  icon: React.ReactNode
}

interface ToolsClientContentProps {
  tools: Tool[]
}

export default function ToolsClientContent({ tools }: ToolsClientContentProps) {
  const [filteredTools, setFilteredTools] = useState(tools)
  const [categories, setCategories] = useState(() => getCategories(tools))
  const [activeCategory, setActiveCategory] = useState('All Tools')

  const handleCategoryFilter = (categoryName: string) => {
    setActiveCategory(categoryName)
    
    if (categoryName === 'All Tools') {
      setFilteredTools(tools)
    } else {
      setFilteredTools(getToolsByTag(tools, categoryName))
    }

    // 카테고리 활성 상태 업데이트
    setCategories(prev => prev.map(cat => ({
      ...cat,
      active: cat.name === categoryName
    })))
  }

  return (
    <>
      {/* Filter Categories */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleCategoryFilter(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category.active
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400'
                }`}
              >
                {category.name} ({category.count})
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ToolCard {...tool} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                해당 카테고리에 도구가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
