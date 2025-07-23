'use client'

import { useTheme } from '@/lib/theme-provider'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    if (actualTheme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-gray-800 transition-colors"
      aria-label="테마 변경"
    >
      {actualTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  )
}
