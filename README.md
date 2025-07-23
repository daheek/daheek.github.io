# Dahee's Developer Tools Blog

현업에서 사용하는 개발자 도구들을 만들고 공유하는 블로그입니다.

## 🚀 시작하기

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# GitHub Pages 배포용 정적 파일 생성
npm run export
```

### 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Content**: MDX (추후 블로그 글 작성용)
- **Deployment**: GitHub Pages

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── tools/             # 개발자 도구 페이지들
│   └── blog/              # 블로그 페이지들
├── components/            # 재사용 가능한 컴포넌트
│   ├── Header.tsx         # 네비게이션 헤더
│   ├── Footer.tsx         # 푸터
│   └── ToolCard.tsx       # 도구 카드 컴포넌트
├── public/                # 정적 파일
└── styles/                # 추가 스타일 파일
```

## 🎨 디자인 컨셉

- **주 색상**: 보라색 계열 (포인트 컬러로 사용)
- **레이아웃**: 미니멀하고 깔끔한 디자인
- **타이포그래피**: Inter (본문), JetBrains Mono (코드)
- **애니메이션**: Framer Motion으로 부드러운 인터랙션

## 🛠️ 개발 계획

### Phase 1: 기본 구조 (완료)
- [x] Next.js 프로젝트 설정
- [x] 기본 레이아웃 및 네비게이션
- [x] 홈페이지, 도구 목록, 블로그 페이지
- [x] 반응형 디자인

### Phase 2: 도구 개발
- [ ] Color Palette Generator
- [ ] JSON Formatter & Validator
- [ ] Code Snippet Manager
- [ ] Base64 Encoder/Decoder
- [ ] URL Shortener
- [ ] Image Optimizer
- [ ] Lorem Ipsum Generator
- [ ] CSS Unit Converter
- [ ] Regex Tester

### Phase 3: 블로그 기능
- [ ] MDX 블로그 시스템 구축
- [ ] 태그 시스템
- [ ] 검색 기능
- [ ] RSS 피드

### Phase 4: 고급 기능
- [ ] 다크 모드
- [ ] PWA 지원
- [ ] 성능 최적화
- [ ] 분석 도구 연동

## 📝 기여하기

이 프로젝트는 개인 포트폴리오이지만, 개선 제안이나 버그 리포트는 언제나 환영합니다.

## 📄 라이선스

MIT License

---

Made with ❤️ by Dahee
