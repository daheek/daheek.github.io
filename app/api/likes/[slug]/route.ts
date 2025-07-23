import { NextRequest, NextResponse } from 'next/server'

// 동적 라우트 설정
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // edge에서 nodejs로 변경

interface LikeData {
  count: number
  userLikes: string[] // IP 주소나 세션 ID 저장
}

// Mock KV for development when Vercel KV is not available
let mockKV: Map<string, LikeData> = new Map()

const getKV = () => {
  // Vercel KV가 사용 가능한지 확인
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      return require('@vercel/kv').kv
    }
  } catch (error) {
    console.log('Vercel KV not available, using mock storage')
  }
  
  // Mock KV 구현
  return {
    async get(key: string) {
      return mockKV.get(key) || null
    },
    async set(key: string, value: LikeData) {
      mockKV.set(key, value)
      return 'OK'
    }
  }
}

// 좋아요 수 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const kv = getKV()
    const likeData = await kv.get(`likes:${slug}`) as LikeData | null
    
    return NextResponse.json({
      count: likeData?.count || 0,
      slug,
      success: true
    })
  } catch (error) {
    console.error('좋아요 조회 오류:', error)
    return NextResponse.json(
      { 
        error: '좋아요 정보를 가져올 수 없습니다.',
        success: false,
        count: 0
      },
      { status: 500 }
    )
  }
}

// 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const userIP = request.ip || 
                  request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') ||
                  `dev-${Date.now()}` // 개발 환경에서는 타임스탬프 사용
    
    const kv = getKV()
    
    // 현재 좋아요 데이터 가져오기
    const currentData = (await kv.get(`likes:${slug}`) as LikeData) || { 
      count: 0, 
      userLikes: [] 
    }
    
    const hasLiked = currentData.userLikes.includes(userIP)
    
    let newData: LikeData
    
    if (hasLiked) {
      // 좋아요 취소
      newData = {
        count: Math.max(0, currentData.count - 1),
        userLikes: currentData.userLikes.filter(ip => ip !== userIP)
      }
    } else {
      // 좋아요 추가
      newData = {
        count: currentData.count + 1,
        userLikes: [...currentData.userLikes, userIP]
      }
    }
    
    // KV에 저장
    await kv.set(`likes:${slug}`, newData)
    
    return NextResponse.json({
      count: newData.count,
      liked: !hasLiked,
      slug,
      success: true,
      mode: process.env.KV_REST_API_URL ? 'vercel-kv' : 'mock'
    })
  } catch (error) {
    console.error('좋아요 처리 오류:', error)
    return NextResponse.json(
      { 
        error: '좋아요 처리 중 오류가 발생했습니다.',
        success: false,
        count: 0,
        liked: false
      },
      { status: 500 }
    )
  }
}

// 사용자의 좋아요 상태 확인
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const userIP = request.ip || 
                  request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') ||
                  `dev-${Date.now()}`
    
    const kv = getKV()
    const likeData = (await kv.get(`likes:${slug}`) as LikeData) || null
    const hasLiked = likeData?.userLikes.includes(userIP) || false
    
    return NextResponse.json({
      count: likeData?.count || 0,
      liked: hasLiked,
      slug,
      success: true,
      mode: process.env.KV_REST_API_URL ? 'vercel-kv' : 'mock'
    })
  } catch (error) {
    console.error('좋아요 상태 확인 오류:', error)
    return NextResponse.json(
      { 
        error: '좋아요 상태를 확인할 수 없습니다.',
        success: false,
        count: 0,
        liked: false
      },
      { status: 500 }
    )
  }
}
