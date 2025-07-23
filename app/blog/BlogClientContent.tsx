'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Tag, Calendar, X, Filter, ChevronDown } from 'lucide-react'
import { BlogPost, BlogFilter } from '@/types/blog'
import { applyFilters, formatDate, getMonthName, getUniqueYears, getMonthsForYear } from '@/lib/blog-client'
import BlogPostCard from './BlogPostCard'

interface BlogClientContentProps {
  posts: BlogPost[]
  tags: { name: string; count: number }[]
  dateCategories: { year: string; month: string; count: number }[]
}

export default function BlogClientContent({ posts, tags, dateCategories }: BlogClientContentProps) {
  const [filter, setFilter] = useState<BlogFilter>({
    searchQuery: '',
    selectedTags: [],
    selectedYear: '',
    selectedMonth: ''
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  const years = getUniqueYears(posts)
  const months = filter.selectedYear ? getMonthsForYear(posts, filter.selectedYear) : []

  const filteredPosts = useMemo(() => {
    return applyFilters(posts, filter)
  }, [posts, filter])

  const handleSearchChange = (query: string) => {
    setFilter(prev => ({ ...prev, searchQuery: query }))
  }

  const handleTagToggle = (tag: string) => {
    setFilter(prev => ({
      ...prev,
      selectedTags: prev.selectedTags?.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...(prev.selectedTags || []), tag]
    }))
  }

  const handleYearSelect = (year: string) => {
    setFilter(prev => ({
      ...prev,
      selectedYear: year === prev.selectedYear ? '' : year,
      selectedMonth: year === prev.selectedYear ? '' : prev.selectedMonth
    }))
  }

  const handleMonthSelect = (month: string) => {
    setFilter(prev => ({
      ...prev,
      selectedMonth: month === prev.selectedMonth ? '' : month
    }))
  }

  const clearFilters = () => {
    setFilter({
      searchQuery: '',
      selectedTags: [],
      selectedYear: '',
      selectedMonth: ''
    })
  }

  const hasActiveFilters = filter.searchQuery || 
    (filter.selectedTags && filter.selectedTags.length > 0) || 
    filter.selectedYear

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 검색 및 필터 */}
      <div className="mb-8 space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="제목, 내용, 태그로 검색..."
            value={filter.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* 필터 토글 버튼 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            필터
            <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              <X className="w-4 h-4" />
              필터 초기화
            </button>
          )}
        </div>

        {/* 필터 패널 */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4"
            >
              {/* 태그 필터 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">태그</label>
                  <button
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                    className="text-sm text-purple-600 dark:text-purple-400"
                  >
                    {showTagDropdown ? '접기' : '펼치기'}
                  </button>
                </div>
                
                {/* 선택된 태그들 */}
                {filter.selectedTags && filter.selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {filter.selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => handleTagToggle(tag)}
                          className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {showTagDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      {tags.map(tag => (
                        <button
                          key={tag.name}
                          onClick={() => handleTagToggle(tag.name)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                            filter.selectedTags?.includes(tag.name)
                              ? 'bg-purple-600 text-white'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {tag.name} ({tag.count})
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 날짜 필터 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">날짜</label>
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="text-sm text-purple-600 dark:text-purple-400"
                  >
                    {showDateDropdown ? '접기' : '펼치기'}
                  </button>
                </div>

                {/* 선택된 날짜 */}
                {filter.selectedYear && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      <Calendar className="w-3 h-3" />
                      {filter.selectedYear}년 {filter.selectedMonth ? getMonthName(filter.selectedMonth) : ''}
                      <button
                        onClick={() => setFilter(prev => ({ ...prev, selectedYear: '', selectedMonth: '' }))}
                        className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                )}

                <AnimatePresence>
                  {showDateDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      {/* 연도 선택 */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">연도</div>
                        <div className="flex flex-wrap gap-2">
                          {years.map(year => (
                            <button
                              key={year}
                              onClick={() => handleYearSelect(year)}
                              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                filter.selectedYear === year
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
                              }`}
                            >
                              {year}년
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 월 선택 */}
                      {filter.selectedYear && months.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">월</div>
                          <div className="flex flex-wrap gap-2">
                            {months.map(month => (
                              <button
                                key={month}
                                onClick={() => handleMonthSelect(month)}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                  filter.selectedMonth === month
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400'
                                }`}
                              >
                                {getMonthName(month)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 검색 결과 정보 */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {filteredPosts.length === posts.length 
            ? `총 ${posts.length}개의 글`
            : `${posts.length}개 중 ${filteredPosts.length}개의 글을 찾았습니다`
          }
        </p>
      </div>

      {/* 블로그 글 목록 */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <BlogPostCard post={post} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            다른 키워드로 검색하거나 필터를 조정해보세요.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <X className="w-4 h-4" />
              필터 초기화
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}
