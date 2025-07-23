import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mock KV storage
let mockCommentKV: Map<string, any> = new Map()
let mockLikeKV: Map<string, any> = new Map()

const getKV = () => {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      return require('@vercel/kv').kv
    }
  } catch (error) {
    console.log('Vercel KV not available, using mock storage')
  }
  
  return {
    async get(key: string) {
      if (key.startsWith('comments:')) {
        return mockCommentKV.get(key) || null
      } else if (key.startsWith('likes:')) {
        return mockLikeKV.get(key) || null
      }
      return null
    },
    async set(key: string, value: any) {
      if (key.startsWith('comments:')) {
        mockCommentKV.set(key, value)
      } else if (key.startsWith('likes:')) {
        mockLikeKV.set(key, value)
      }
      return 'OK'
    },
    // Mock에서 모든 키 조회 (실제 Vercel KV에서는 scan 사용)
    async keys(pattern: string) {
      const allKeys = [
        ...Array.from(mockCommentKV.keys()),
        ...Array.from(mockLikeKV.keys())
      ]
      return allKeys.filter(key => key.includes(pattern.replace('*', '')))
    }
  }
}

// 모든 저장된 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const kv = getKV()
    
    // 기본 블로그 슬러그들
    const knownSlugs = [
      'developer-tools-guide',
      'nextjs-blog-optimization', 
      'css-grid-vs-flexbox',
      'typescript-best-practices',
      'react-hooks-guide',
      'test-relative-time'
    ]

    const data: any = {
      comments: {},
      likes: {},
      summary: {
        totalComments: 0,
        totalLikes: 0,
        activeBlogCount: 0
      }
    }

    // 각 블로그의 데이터 조회
    for (const slug of knownSlugs) {
      try {
        // 댓글 데이터
        const commentData = await kv.get(`comments:${slug}`)
        if (commentData && commentData.comments && commentData.comments.length > 0) {
          data.comments[slug] = {
            count: commentData.count || commentData.comments.length,
            comments: commentData.comments.map((comment: any) => ({
              id: comment.id,
              author: comment.author,
              content: comment.content,
              timestamp: comment.timestamp,
              userIP: comment.userIP?.substring(0, 10) + '...' // IP 마스킹
            }))
          }
          data.summary.totalComments += commentData.comments.length
        }

        // 좋아요 데이터
        const likeData = await kv.get(`likes:${slug}`)
        if (likeData && likeData.count > 0) {
          data.likes[slug] = {
            count: likeData.count,
            userCount: likeData.userLikes?.length || 0,
            userIPs: likeData.userLikes?.map((ip: string) => ip.substring(0, 10) + '...') || [] // IP 마스킹
          }
          data.summary.totalLikes += likeData.count
        }

        // 활성 블로그 카운트
        if ((commentData && commentData.comments && commentData.comments.length > 0) || 
            (likeData && likeData.count > 0)) {
          data.summary.activeBlogCount++
        }
      } catch (error) {
        console.error(`Error loading data for ${slug}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      mode: process.env.KV_REST_API_URL ? 'vercel-kv' : 'mock',
      data
    })

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// 특정 데이터 삭제 (관리자용)
export async function DELETE(request: NextRequest) {
  try {
    const { type, slug, id } = await request.json()

    if (!type || !slug) {
      return NextResponse.json(
        { success: false, error: '타입과 슬러그가 필요합니다.' },
        { status: 400 }
      )
    }

    const kv = getKV()

    if (type === 'comment' && id) {
      // 특정 댓글 삭제
      const commentData = await kv.get(`comments:${slug}`)
      if (commentData && commentData.comments) {
        const updatedComments = commentData.comments.filter((c: any) => c.id !== id)
        await kv.set(`comments:${slug}`, {
          comments: updatedComments,
          count: updatedComments.length
        })
      }
    } else if (type === 'likes') {
      // 좋아요 데이터 초기화
      await kv.set(`likes:${slug}`, { count: 0, userLikes: [] })
    } else if (type === 'comments') {
      // 모든 댓글 삭제
      await kv.set(`comments:${slug}`, { comments: [], count: 0 })
    }

    return NextResponse.json({
      success: true,
      message: '데이터가 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.'
      },
      { status: 500 }
    )
  }
}
