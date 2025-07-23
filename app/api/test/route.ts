import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const hasVercelKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
    
    return NextResponse.json({
      status: 'API 작동 중',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelKV: hasVercelKV ? '설정됨' : '설정되지 않음 (Mock KV 사용)',
      features: {
        likes: '활성화됨',
        comments: '활성화됨 (실시간 동기화)',
        storage: hasVercelKV ? 'Vercel KV' : 'Mock Storage'
      },
      links: {
        admin: '/admin',
        adminAPI: '/api/admin',
        testBlog: '/blog/test-relative-time'
      },
      success: true
    })
  } catch (error) {
    return NextResponse.json({
      status: 'API 오류',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      success: false
    }, { status: 500 })
  }
}
