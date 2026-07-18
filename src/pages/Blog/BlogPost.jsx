import { Link, useParams, Navigate } from 'react-router-dom'
import { blogPosts } from './blogData'
import Seo, { JsonLd } from '../../components/Seo/Seo'
import { blogPostJsonLd, blogPostMeta } from './blogSeo'
import iconArrow from '../../assets/icon-arrow.svg'

export default function BlogPost() {
  const { id } = useParams()
  const post = blogPosts[id]

  if (!post) return <Navigate to="/blog" replace />

  const meta = blogPostMeta(post, id)

  return (
    <div className="w-full bg-white flex flex-col" id="blog-post-page">

      <Seo
        title={meta.title}
        description={meta.description}
        path={`/blog/${id}`}
        image={meta.image}
        type="article"
      />
      <JsonLd data={blogPostJsonLd(post, id)} />

      {/* ═══════════════════════════════════════════════════════════
         1. HERO IMAGE
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[55vh] bg-pulsar-light-blue-bg overflow-hidden">
        {post.heroImg && (
          <img
            src={post.heroImg}
            alt={post.heroAlt || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute -bottom-px left-0 w-full leading-none z-10">
          <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. ARTICLE CONTENT
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-[60px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <article className="max-w-[800px] mx-auto">

            {/* Category tag + Date */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`${post.tagColor} text-white font-futura font-bold text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full`}>
                {post.category}
              </span>
              <span className="font-inter text-[13px] text-gray-400 uppercase tracking-wide">{post.date}</span>
            </div>

            {/* Title */}
            <h1 className="font-futura font-bold text-[clamp(2rem,6vw,48px)] leading-[1.1] text-pulsar-blue uppercase tracking-wide mb-6">
              {post.title}
            </h1>

            {/* Intro */}
            <p className="font-inter text-[16px] leading-[1.7] text-gray-600 mb-10">
              {post.heroDescription}
            </p>

            {/* Divider */}
            <div className="w-full h-[2px] bg-gray-200 mb-10"></div>

            {/* Content blocks */}
            {post.content.map((block, i) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={i} className="font-futura font-bold text-[clamp(1.5rem,4vw,28px)] leading-[1.2] text-pulsar-blue uppercase tracking-wide mt-10 mb-4">
                    {block.body}
                  </h2>
                )
              }
              if (block.type === 'text') {
                return (
                  <p key={i} className="font-inter text-[15px] leading-[1.8] text-gray-700 mb-6 whitespace-pre-line">
                    {block.body}
                  </p>
                )
              }
              if (block.type === 'image') {
                return (
                  <div key={i} className="my-10">
                    <div className="w-full aspect-[16/9] bg-pulsar-light-blue-bg rounded-[24px] shadow-lg overflow-hidden">
                      {block.img && (
                        <img src={block.img} alt={block.alt || ''} className="w-full h-full object-cover" />
                      )}
                    </div>
                    {block.source && (
                      <p className="font-inter text-[11px] text-gray-400 mt-2 text-center italic">Image: {block.source}</p>
                    )}
                  </div>
                )
              }
              return null
            })}

            {/* Sources */}
            {post.sources && post.sources.length > 0 && (
              <div className="mt-12 mb-6">
                <div className="w-full h-[1px] bg-gray-200 mb-6"></div>
                <h3 className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide mb-4">SOURCES</h3>
                <ul className="flex flex-col gap-2">
                  {post.sources.map((source, i) => (
                    <li key={i}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-inter text-[12px] text-pulsar-blue hover:text-pulsar-pink transition-colors underline">
                        {source.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom divider */}
            <div className="w-full h-[2px] bg-gray-200 mt-6 mb-10"></div>

            {/* Back + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-4 sm:justify-between">
              <Link to="/blog" className="font-futura font-bold text-[14px] text-pulsar-blue uppercase tracking-wide hover:text-pulsar-pink transition-colors">
                &larr; BACK TO ALL POSTS
              </Link>
              <Link to="/shop" className="inline-flex items-center gap-3 bg-pulsar-pink text-white font-futura font-bold text-[13px] uppercase tracking-[1px] px-7 py-3 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5">
                SHOP NOW
                <img src={iconArrow} alt="Arrow" className="w-[18px] h-auto" />
              </Link>
            </div>

          </article>
        </div>
      </section>

    </div>
  )
}
