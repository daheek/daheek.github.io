'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ToolCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
  tags: string[]
}

export default function ToolCard({ title, description, icon, href, tags }: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative h-full"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg dark:hover:shadow-2xl hover:shadow-purple-100 dark:hover:shadow-purple-900/20 transition-all duration-300 h-full">
        {/* Icon */}
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
          <div className="text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Link overlay */}
        <a
          href={href}
          className="absolute inset-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={`${title} 도구로 이동`}
        />
      </div>
    </motion.div>
  )
}
