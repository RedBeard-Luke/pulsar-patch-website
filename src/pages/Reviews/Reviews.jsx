import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useReviews } from '../../context/ReviewsContext'
import reviewsHeroBg from '../../assets/reviews-hero.jpg'
import iconArrow from '../../assets/icon-arrow.svg'

export default function Reviews() {
  // Only approved reviews are public. New submissions go to the screening queue.
  const { liveReviews: reviews, submitReview } = useReviews()
  const [visibleCount, setVisibleCount] = useState(3)
  const [filterStars, setFilterStars] = useState(0) // 0 = all
  const [sortBy, setSortBy] = useState('newest')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', title: '', text: '', stars: 0, email: '', phone: '', orderNumber: '', didItWork: 10, recommend: 10 })
  const [hoverStar, setHoverStar] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [formError, setFormError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Compute star breakdown from actual reviews
  const starBreakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map(s => ({
      stars: s,
      count: reviews.filter(r => r.stars === s).length,
    }))
  }, [reviews])

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.stars, 0) / totalReviews).toFixed(1)
    : '0.0'

  // Filter & sort
  const filteredReviews = useMemo(() => {
    let result = filterStars > 0 ? reviews.filter(r => r.stars === filterStars) : [...reviews]
    if (sortBy === 'highest') result.sort((a, b) => b.stars - a.stars)
    else if (sortBy === 'lowest') result.sort((a, b) => a.stars - b.stars)
    // 'newest' keeps default order (newest first since we prepend)
    return result
  }, [reviews, filterStars, sortBy])

  const visibleReviews = filteredReviews.slice(0, visibleCount)
  const hasMore = visibleCount < filteredReviews.length

  function handleFormChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmitReview(e) {
    e.preventDefault()

    if (formData.stars === 0) {
      setFormError('Please pick a star rating first.')
      return
    }
    if (!formData.name.trim()) {
      setFormError('Please add your name.')
      return
    }
    if (!formData.text.trim()) {
      setFormError('Please write a few words about your experience.')
      return
    }

    // Goes to the screening queue as 'pending' and emails the team. It only
    // appears on this page once someone approves it.
    submitReview({
      stars: formData.stars,
      title: formData.title.toUpperCase(),
      text: formData.text,
      author: formData.name.toUpperCase(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      orderNumber: formData.orderNumber.trim(),
      didItWork: formData.didItWork,
      recommend: formData.recommend,
    })
    setFormData({ name: '', title: '', text: '', stars: 0, email: '', phone: '', orderNumber: '', didItWork: 10, recommend: 10 })
    setFormError('')
    setShowForm(false)
    setShowSuccess(true)
    setVisibleCount(3)
  }

  return (
    <div className="w-full bg-white flex flex-col" id="reviews-page">

      {/* ═══════════════════════════════════════════════════════════
         1. HERO — Shorter to fit above the fold with review summary
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[50vh] bg-pulsar-light-blue-bg bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${reviewsHeroBg})` }}>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
          <svg className="block w-full h-[40px] sm:h-[70px] lg:h-[120px]" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80 L 1440 120 L 0 120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         2. CUSTOMER REVIEWS HEADER
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-[40px] pb-[30px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          <h2 className="font-futura font-bold text-[24px] text-pulsar-dark uppercase tracking-wide mb-8">
            CUSTOMER REVIEWS
          </h2>

          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[80px]">
            {/* Left: Star breakdown + filter + write */}
            <div className="flex-shrink-0 w-full lg:w-[280px]">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#DE64A5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <span className="font-inter text-[13px] text-gray-500 ml-2">{avgRating} / {totalReviews} REVIEWS</span>
              </div>

              {/* Star bars — clickable to filter */}
              <div className="flex flex-col gap-2 mb-6">
                {starBreakdown.map((row) => (
                  <button
                    key={row.stars}
                    onClick={() => setFilterStars(filterStars === row.stars ? 0 : row.stars)}
                    className={`flex items-center gap-3 transition-opacity ${filterStars > 0 && filterStars !== row.stars ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <span className="font-inter text-[12px] text-gray-500 w-[12px]">{row.stars}</span>
                    <div className="flex-1 h-[8px] bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pulsar-pink rounded-full transition-all duration-300"
                        style={{ width: totalReviews > 0 ? `${(row.count / totalReviews) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <span className="font-inter text-[11px] text-gray-400 w-[20px] text-right">{row.count}</span>
                  </button>
                ))}
              </div>

              {/* Write Review + Filter side by side */}
              <div className="flex gap-3 items-start">
                {/* Filter button + expandable panel */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className={`flex items-center gap-2 px-5 py-3 font-futura font-bold text-[11px] uppercase tracking-wide transition-all duration-300 ${showFilter ? 'bg-pulsar-pink text-white rounded-t-[16px] rounded-b-none' : 'bg-pulsar-pink text-white rounded-[16px] hover:-translate-y-0.5'}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                    </svg>
                    FILTER
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="white" className={`ml-1 transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`}>
                      <path d="M2 4l4 4 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  {showFilter && (
                    <div className="absolute top-full right-0 sm:right-auto sm:left-0 bg-pulsar-pink rounded-b-[16px] rounded-tr-[16px] px-6 py-5 z-50 w-max min-w-[260px] max-w-[calc(100vw-2.5rem)] shadow-lg">
                      {/* Sort by */}
                      <div className="mb-4">
                        <span className="font-futura font-bold text-[10px] text-white/60 uppercase tracking-widest block mb-2">SORT BY</span>
                        <div className="flex flex-col gap-1">
                          {[{ value: 'newest', label: 'NEWEST' }, { value: 'highest', label: 'HIGHEST RATED' }, { value: 'lowest', label: 'LOWEST RATED' }].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setSortBy(opt.value)}
                              className={`text-left font-futura font-bold text-[12px] uppercase tracking-wide px-3 py-1.5 rounded-[8px] transition-colors ${sortBy === opt.value ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="w-full border-t border-white/20 mb-4"></div>

                      {/* Filter by stars */}
                      <div>
                        <span className="font-futura font-bold text-[10px] text-white/60 uppercase tracking-widest block mb-2">FILTER BY STARS</span>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => { setFilterStars(0); setShowFilter(false) }}
                            className={`text-left font-futura font-bold text-[12px] uppercase tracking-wide px-3 py-1.5 rounded-[8px] transition-colors ${filterStars === 0 ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                          >
                            ALL STARS
                          </button>
                          {[5, 4, 3, 2, 1].map((s) => (
                            <button
                              key={s}
                              onClick={() => { setFilterStars(s); setShowFilter(false) }}
                              className={`text-left font-futura font-bold text-[12px] uppercase tracking-wide px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-2 ${filterStars === s ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                            >
                              {s} {s === 1 ? 'STAR' : 'STARS'}
                              <span className="font-inter text-[10px] text-white/40">({starBreakdown.find(b => b.stars === s)?.count || 0})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { setShowForm(!showForm); setFormError(''); setShowSuccess(false) }}
                  className="bg-pulsar-blue text-white font-futura font-bold text-[11px] uppercase tracking-wide px-5 py-3 rounded-[16px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-blue-dark"
                >
                  {showForm ? 'CANCEL' : 'WRITE A REVIEW'}
                </button>
              </div>
            </div>

            {/* Right: Big headline */}
            <div className="flex-1 flex flex-col items-start">
              <h2 className="font-futura font-bold text-[clamp(2.25rem,6vw,48px)] leading-[1.1] text-pulsar-blue uppercase tracking-wide">WE'RE BIASED.</h2>
              <div className="bg-pulsar-pink text-white px-4 py-1 inline-block mb-6">
                <h2 className="font-futura font-bold text-[clamp(2.25rem,6vw,48px)] leading-[1.1] uppercase tracking-wide">THEY'RE NOT.</h2>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-3 bg-pulsar-pink text-white font-futura font-bold text-[13px] uppercase tracking-[1px] px-7 py-3 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5">
                SHOP NOW
                <img src={iconArrow} alt="Arrow" className="w-[18px] h-auto" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         3. WRITE A REVIEW FORM (collapsible)
         ═══════════════════════════════════════════════════════════ */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showForm ? 'max-h-[1700px] lg:max-h-[900px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <section className="bg-pulsar-blue">
          <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px] py-[50px]">
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
              {/* Top row: Title + Stars */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                <h3 className="font-futura font-bold text-[22px] text-white uppercase tracking-wide shrink-0">Pulsar Patch Review:</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      width="24" height="24"
                      viewBox="0 0 24 24"
                      fill={s <= (hoverStar || formData.stars) ? '#DE64A5' : 'rgba(255,255,255,0.3)'}
                      className="cursor-pointer transition-colors"
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setFormData({ ...formData, stars: s })}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>

              {/* Name + Email row */}
              <div className="flex flex-col sm:flex-row gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                  className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Phone + Order number row — used by the team to verify and follow up */}
              <div className="flex flex-col sm:flex-row gap-6">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors"
                />
                <input
                  type="text"
                  name="orderNumber"
                  placeholder="Order number (optional)"
                  value={formData.orderNumber}
                  onChange={handleFormChange}
                  className="flex-1 bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Title */}
              <input
                type="text"
                name="title"
                placeholder="Review Title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors"
              />

              {/* Profile Picture prompt */}
              <input
                type="text"
                placeholder="Profile Picture (optional URL)"
                className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors"
              />

              {/* Review text */}
              <textarea
                name="text"
                placeholder="Write your review here... *"
                required
                rows={4}
                value={formData.text}
                onChange={handleFormChange}
                className="w-full bg-white/10 border border-white/30 rounded-[8px] px-4 py-3 font-inter text-[14px] text-white placeholder-white/50 outline-none focus:border-white transition-colors resize-none"
              ></textarea>

              {/* Bottom row: photo + sliders + submit */}
              <div className="flex flex-col md:flex-row gap-8 md:items-end">
                {/* Add photo */}
                <div className="flex flex-col gap-2">
                  <span className="font-futura font-bold text-[12px] text-white/70 uppercase tracking-wide">Add Photo or Video</span>
                  <label className="w-[80px] h-[80px] border-2 border-dashed border-white/40 rounded-[12px] flex items-center justify-center cursor-pointer hover:border-white transition-colors">
                    <span className="text-white/50 text-[28px]">+</span>
                    <input type="file" accept="image/*,video/*" className="hidden" />
                  </label>
                </div>

                {/* Sliders */}
                <div className="w-full md:flex-1 flex flex-col sm:flex-row gap-8">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex justify-between">
                      <span className="font-futura font-bold text-[12px] text-white/70 uppercase tracking-wide">Did The Patch Work for You?</span>
                      <span className="font-futura font-bold text-[14px] text-white">{formData.didItWork}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.didItWork}
                      onChange={(e) => setFormData({ ...formData, didItWork: Number(e.target.value) })}
                      className="w-full h-[6px] rounded-full appearance-none cursor-pointer accent-pulsar-pink bg-white/20"
                    />
                    <div className="flex justify-between">
                      <span className="font-inter text-[10px] text-white/40">1</span>
                      <span className="font-inter text-[10px] text-white/40">10</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex justify-between">
                      <span className="font-futura font-bold text-[12px] text-white/70 uppercase tracking-wide">Would you recommend Pulsar Patch?</span>
                      <span className="font-futura font-bold text-[14px] text-white">{formData.recommend}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.recommend}
                      onChange={(e) => setFormData({ ...formData, recommend: Number(e.target.value) })}
                      className="w-full h-[6px] rounded-full appearance-none cursor-pointer accent-pulsar-pink bg-white/20"
                    />
                    <div className="flex justify-between">
                      <span className="font-inter text-[10px] text-white/40">1</span>
                      <span className="font-inter text-[10px] text-white/40">10</span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full md:w-auto bg-pulsar-pink text-white font-futura font-bold text-[14px] uppercase tracking-widest px-10 py-3.5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-pulsar-pink-dark shrink-0"
                >
                  SUBMIT
                </button>
              </div>

              {/* Inline validation message */}
              {formError && (
                <p className="font-inter text-[14px] text-white bg-pulsar-pink-dark/90 rounded-[8px] px-4 py-3">
                  {formError}
                </p>
              )}
            </form>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         4. REVIEWS LIST
         ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white pb-[100px]">
        <div className="max-w-[1920px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-[140px]">
          {/* Success confirmation */}
          {showSuccess && (
            <div className="flex items-center justify-between gap-4 mt-8 mb-2 bg-pulsar-light-blue-bg border border-pulsar-blue/30 rounded-[12px] px-5 py-4">
              <p className="font-inter text-[14px] text-pulsar-blue-dark">
                Thanks! Your review is in. Our team gives every review a quick look before it goes live, so hang tight.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="font-inter text-[13px] text-pulsar-blue hover:text-pulsar-pink transition-colors underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Filter active indicator */}
          {filterStars > 0 && (
            <div className="flex items-center gap-3 mb-6 pt-6">
              <span className="font-inter text-[13px] text-gray-500">Showing {filterStars}-star reviews</span>
              <button onClick={() => setFilterStars(0)} className="font-inter text-[13px] text-pulsar-blue hover:text-pulsar-pink transition-colors underline">
                Clear filter
              </button>
            </div>
          )}

          {filteredReviews.length === 0 ? (
            <p className="font-inter text-[15px] text-gray-500 py-16 text-center">
              No reviews match that filter yet.
            </p>
          ) : (
          <div className="flex flex-col gap-0">
            {visibleReviews.map((review, index) => (
              <div key={review.id} className={`flex flex-col md:flex-row py-10 border-b border-gray-200 ${index === 0 ? 'border-t' : ''}`}>
                {/* Left Column: Author Info */}
                <div className="w-full md:flex-[0_0_250px] flex flex-col pr-0 md:pr-8 mb-4 md:mb-0">
                  <p className="font-futura font-bold text-[16px] text-pulsar-pink uppercase tracking-widest mb-1">{review.author}</p>
                  <p className="font-inter text-[13px] text-pulsar-blue mb-2">{review.date}</p>
                  {review.verified && (
                    <span className="font-inter font-semibold text-[12px] text-gray-500 tracking-wide uppercase">Verified Buyer</span>
                  )}
                </div>

                {/* Right Column: Review */}
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.stars)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#44C8E8">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  {review.title && (
                    <h3 className="font-futura font-bold text-[14px] text-pulsar-dark uppercase tracking-wide mb-3">{review.title}</h3>
                  )}
                  <p className="font-inter text-[14px] leading-[1.6] text-gray-700">
                    {review.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* More Reviews Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="inline-flex items-center gap-3 bg-pulsar-pink text-white font-futura font-bold text-[15px] uppercase tracking-[1px] px-8 py-3.5 rounded-full transition-all duration-300 hover:bg-pulsar-pink-dark hover:-translate-y-0.5"
              >
                MORE REVIEWS
                <img src={iconArrow} alt="Arrow" className="w-[20px] h-auto" />
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
