import { Github, Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">About</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              현업에서 실제로 사용하는 개발자 도구들을 만들고 공유하는 공간입니다. 
              효율적인 개발 워크플로우를 위한 다양한 유틸리티를 제공합니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/tools" 
                  className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Developer Tools
                </a>
              </li>
              <li>
                <a 
                  href="/blog" 
                  className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Blog Posts
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/daheek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Dahee's Dev Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
