import { useState } from 'react'
import { Link } from 'react-router-dom'
import squigleBg from '../../assets/footer_Squigle.svg'

const featuredPost = {
  id: 'what-is-pulsar-patch',
  category: 'SCIENCE',
  title: 'WHAT IS PULSAR PATCH',
  excerpt: "You've seen the patches. You've heard the buzz. But what exactly is Pulsar Patch, and how does a little square on your arm help you feel better the morning after? Let's break it down.",
}

const posts = [
  // Lifestyle
  {
    id: 'how-often-use-pulsar',
    category: 'LIFESTYLE',
    tag: 'LIFESTYLE',
    tagColor: 'bg-pulsar-blue',
    title: 'HOW OFTEN CAN I USE A PULSAR PATCH?',
    date: 'MAY 8',
  },
  {
    id: 'weekend-plans-monday-energy',
    category: 'LIFESTYLE',
    tag: 'LIFESTYLE',
    tagColor: 'bg-pulsar-blue',
    title: 'WEEKEND PLANS, MONDAY ENERGY',
    date: 'MAY 8',
  },
  {
    id: '1-bottle-wine-vs-pulsar',
    category: 'LIFESTYLE',
    tag: 'LIFESTYLE',
    tagColor: 'bg-pulsar-blue',
    title: '1 BOTTLE OF WINE VS 1 PULSAR PATCH',
    date: 'MAY 8',
  },
  // Science
  {
    id: 'why-do-hangovers-happen',
    category: 'SCIENCE',
    tag: 'SCIENCE',
    tagColor: 'bg-pulsar-pink',
    title: 'WHY DO HANGOVERS EVEN HAPPEN',
    date: 'MAY 8',
  },
  {
    id: 'science-behind-pulsar',
    category: 'SCIENCE',
    tag: 'SCIENCE',
    tagColor: 'bg-pulsar-pink',
    title: 'THE SCIENCE BEHIND PULSAR PATCH',
    date: 'MAY 8',
  },
  {
    id: 'hangovers-arent-inevitable',
    category: 'SCIENCE',
    tag: 'SCIENCE',
    tagColor: 'bg-pulsar-pink',
    title: "HANGOVERS AREN'T INEVITABLE!",
    date: 'MAY 8',
  },
  // Recipes
  {
    id: 'low-calorie-margarita',
    category: 'RECIPES',
    tag: 'RECIPES',
    tagColor: 'bg-[#FFA700]',
    title: 'LOW CALORIE MARGARITA',
    date: 'MAY 8',
  },
  {
    id: 'fasted-old-fashion',
    category: 'RECIPES',
    tag: 'RECIPES',
    tagColor: 'bg-[#FFA700]',
    title: 'FASTED OLD FASHION FOR AFTER WORK',
    date: 'MAY 8',
  },
  {
    id: 'best-low-regret-cocktails',
    category: 'RECIPES',
    tag: 'RECIPES',
    tagColor: 'bg-[#FFA700]',
    title: 'BEST LOW-REGRET COCKTAILS',
    date: 'MAY 8',
  },
]

function CategoryRow({ category, items, tagColor }) {
  const [scrollIndex, setScrollIndex] = useState(0)
  const maxIndex = Math.max(0, items.length - 3)

  return (
    <div className="mb-16">
      <h3 className="font-futura font-bold text-[24px] text-pulsar-dark uppercase tracking-wide mb-8">{category}</h3>
      <div className="relative">
        {/* Left arrow */}
        {scrollIndex > 0 && (
          <button
            onClick={() => setScrollIndex(Math.max(0, scrollIndex - 1))}
            className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}

        {/* Right arrow */}
        {scrollIndex < maxIndex && (
          <button
            onClick={() => setScrollIndex(Math.min(maxIndex, scrollIndex + 1))}
            className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        <div className="overflow-hidden">
          <div
            className="flex gap-8 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${scrollIndex * (33.333 + 2)}%)` }}
          >
            {items.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="flex-[0_0_calc(33.333%-22px)] flex flex-col group">
                <div className="w-full aspect-[4/3] bg-[#757575] rounded-[16px] mb-4 overflow-hidden relative shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className={`absolute bottom-3 left-3 ${post.tagColor} text-white font-futura font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full`}>
                    {post.tag}
                  </div>
                </div>
                <h4 className="font-futura font-bold text-[16px] text-pulsar-dark uppercase tracking-wide leading-[1.2] mb-2 group-hover:text-pulsar-pink transition-colors">
                  {post.title}
                </h4>
                <span className="font-inter text-[12px] text-gray-400 uppercase tracking-wide">{post.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Blog() {
  const lifestylePosts = posts.filter(p => p.category === 'LIFESTYLE')
  const sciencePosts = posts.filter(p => p.category === 'SCIENCE')
  const recipePosts = posts.filter(p => p.category === 'RECIPES')

  return (
    <div className="w-full bg-white flex flex-col" id="blog-page">

      {/* ═══════════════════════════════════════════════════════════
         1. HERO
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-pulsar-blue pb-[105px] overflow-hidden">
        {/* Squiggle background */}
        <img src={squigleBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-[0.05]" />

        <div className="relative z-10 max-w-[1920px] mx-auto px-[140px] pt-[90px] pb-[10px]">
          <h1 className="font-futura font-bold text-[54px] text-white uppercase tracking-wide text-center mb-12">
            PATCHED UP NEWS
          </h1>


          {/* Featured Post */}
          <div className="flex items-center gap-[60px]">
            {/* Left: Image */}
            <div className="flex-[0_0_42%]">
              <div className="w-full aspect-[4/3] bg-[#555555] rounded-[20px] shadow-2xl"></div>
            </div>

            {/* Right: Title + Excerpt + CTA */}
            <div className="flex-1">
              <h2 className="font-futura font-bold text-[28px] text-white uppercase tracking-wide mb-4">
                WHAT IS PULSAR PATCH
              </h2>
              <p className="font-inter text-[14px] leading-[1.6] text-white/80 mb-6">
                {featuredPost.excerpt}
              </p>
              <Link to={`/blog/${featuredPost.id}`} className="inline-flex items-center gap-3 bg-pulsar-pink text-white font-futura font-bold text-[13px] uppercase tracking-[1px] px-7 py-3 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5">
                READ MORE
              </Link>
            </div>
          </div>
        </div>

        {/* White wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. CATEGORY FILTER
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-[60px] pb-[40px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <h2 className="font-futura font-bold text-[28px] text-pulsar-blue uppercase tracking-wide text-center mb-8">
            READ BY CATEGORY
          </h2>
          <div className="flex justify-center gap-6">
            <span className="font-futura font-bold text-[13px] uppercase tracking-widest px-10 py-3 rounded-full bg-pulsar-blue text-white">LIFE STYLE</span>
            <span className="font-futura font-bold text-[13px] uppercase tracking-widest px-10 py-3 rounded-full bg-pulsar-pink text-white">SCIENCE</span>
            <span className="font-futura font-bold text-[13px] uppercase tracking-widest px-10 py-3 rounded-full bg-[#FFA700] text-white">RECIPES</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. BLOG POSTS BY CATEGORY
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white pb-[100px]">
        <div className="max-w-[1920px] mx-auto px-[140px]">
          <CategoryRow category="LIFESTYLE" items={lifestylePosts} />
          <CategoryRow category="SCIENCE" items={sciencePosts} />
          <CategoryRow category="RECIPES" items={recipePosts} />
        </div>
      </section>

    </div>
  )
}
