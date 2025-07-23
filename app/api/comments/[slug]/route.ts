import { NextRequest, NextResponse } from 'next/server'

// 동적 라우트 설정
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  userIP: string
}

interface CommentData {
  comments: Comment[]
  count: number
}

// Mock KV for development when Vercel KV is not available
let mockCommentKV: Map<string, CommentData> = new Map()

const getKV = () => {
  // Vercel KV가 사용 가능한지 확인
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      return require('@vercel/kv').kv
    }
  } catch (error) {
    console.log('Vercel KV not available, using mock storage for comments')
  }
  
  // Mock KV 구현
  return {
    async get(key: string) {
      return mockCommentKV.get(key) || null
    },
    async set(key: string, value: CommentData) {
      mockCommentKV.set(key, value)
      return 'OK'
    }
  }
}

// 댓글 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const kv = getKV()
    const commentData = await kv.get(`comments:${slug}`) as CommentData | null
    
    const comments = commentData?.comments || []
    
    // 최신 댓글이 위로 오도록 정렬
    const sortedComments = comments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    return NextResponse.json({
      comments: sortedComments,
      count: comments.length,
      success: true
    })
  } catch (error) {
    console.error('댓글 조회 오류:', error)
    return NextResponse.json(
      { 
        error: '댓글을 가져올 수 없습니다.',
        success: false,
        comments: [],
        count: 0
      },
      { status: 500 }
    )
  }
}

// 새 댓글 추가
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const { author, content } = await request.json()

    // 입력 검증
    if (!author?.trim() || !content?.trim()) {
      return NextResponse.json(
        { 
          error: '작성자 이름과 댓글 내용을 모두 입력해주세요.',
          success: false
        },
        { status: 400 }
      )
    }

    // 길이 제한
    if (author.trim().length > 50) {
      return NextResponse.json(
        { 
          error: '작성자 이름은 50자를 초과할 수 없습니다.',
          success: false
        },
        { status: 400 }
      )
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { 
          error: '댓글은 1000자를 초과할 수 없습니다.',
          success: false
        },
        { status: 400 }
      )
    }

    const userIP = request.ip || 
                  request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') ||
                  `dev-${Date.now()}`

    const kv = getKV()
    
    // 현재 댓글 데이터 가져오기
    const currentData = (await kv.get(`comments:${slug}`) as CommentData) || { 
      comments: [],
      count: 0
    }
    
    // 새 댓글 생성
    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      userIP
    }
    
    // 댓글 추가
    const updatedData: CommentData = {
      comments: [...currentData.comments, newComment],
      count: currentData.comments.length + 1
    }
    
    // KV에 저장
    await kv.set(`comments:${slug}`, updatedData)
    
    return NextResponse.json({
      comment: {
        id: newComment.id,
        author: newComment.author,
        content: newComment.content,
        timestamp: newComment.timestamp
      },
      success: true,
      mode: process.env.KV_REST_API_URL ? 'vercel-kv' : 'mock'
    })
  } catch (error) {
    console.error('댓글 추가 오류:', error)
    return NextResponse.json(
      { 
        error: '댓글 추가 중 오류가 발생했습니다.',
        success: false
      },
      { status: 500 }
    )
  }
}

// 댓글 삭제 (향후 구현 가능)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const { commentId } = await request.json()

    if (!commentId) {
      return NextResponse.json(
        { 
          error: '삭제할 댓글 ID가 필요합니다.',
          success: false
        },
        { status: 400 }
      )
    }

    const userIP = request.ip || 
                  request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') ||
                  'unknown'

    const kv = getKV()
    const currentData = (await kv.get(`comments:${slug}`) as CommentData) || { 
      comments: [],
      count: 0
    }
    
    // 해당 댓글 찾기
    const commentToDelete = currentData.comments.find(c => c.id === commentId)
    
    if (!commentToDelete) {
      return NextResponse.json(
        { 
          error: '댓글을 찾을 수 없습니다.',
          success: false
        },
        { status: 404 }
      )
    }

    // 작성자 IP 확인 (간단한 권한 체크)
    if (commentToDelete.userIP !== userIP) {
      return NextResponse.json(
        { 
          error: '자신이 작성한 댓글만 삭제할 수 있습니다.',
          success: false
        },
        { status: 403 }
      )
    }
    
    // 댓글 삭제
    const updatedComments = currentData.comments.filter(c => c.id !== commentId)
    const updatedData: CommentData = {
      comments: updatedComments,
      count: updatedComments.length
    }
    
    await kv.set(`comments:${slug}`, updatedData)
    
    return NextResponse.json({
      success: true,
      message: '댓글이 삭제되었습니다.'
    })
  } catch (error) {
    console.error('댓글 삭제 오류:', error)
    return NextResponse.json(
      { 
        error: '댓글 삭제 중 오류가 발생했습니다.',
        success: false
      },
      { status: 500 }
    )
  }
}
