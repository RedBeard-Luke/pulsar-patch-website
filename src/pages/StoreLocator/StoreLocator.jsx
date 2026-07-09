import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { STORES } from './storeData'

const STATES = [
  { code: 'all', label: 'All' },
  { code: 'AZ', label: 'Arizona' },
  { code: 'NV', label: 'Nevada' },
]

export default function StoreLocator() {
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return STORES.filter(s => {
      if (stateFilter !== 'all' && s.state !== stateFilter) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.zip.includes(q) ||
        s.type.toLowerCase().includes(q)
      )
    })
  }, [query, stateFilter])

  // Group results by state → city for a scannable list
  const grouped = useMemo(() => {
    const map = {}
    for (const s of results) {
      map[s.state] ||= {}
      map[s.state][s.city] ||= []
      map[s.state][s.city].push(s)
    }
    return map
  }, [results])

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section className="bg-pulsar-blue text-white pt-14 pb-12 px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-futura font-[800] text-[12px] uppercase tracking-[3px] text-white/80 mb-3">60+ locations across AZ &amp; NV</p>
          <h1 className="font-futura font-[900] text-[clamp(2.25rem,7vw,3.5rem)] leading-[1.05] uppercase mb-4">Find Pulsar near you</h1>
          <p className="font-inter text-[16px] sm:text-[18px] text-white/90 max-w-[520px] leading-relaxed">
            Grab a patch before the night starts. Search a city or ZIP to see the bars, markets, and shops that stock us.
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="px-5 sm:px-8 lg:px-16 xl:px-[140px] -mt-8 relative z-10">
        <div className="max-w-[1100px] mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 flex flex-col gap-4">
          <label htmlFor="store-search" className="sr-only">Search by city, ZIP, or store</label>
          <div className="flex items-center gap-3 border-2 border-pulsar-light-blue rounded-full px-5 py-3 focus-within:border-pulsar-blue transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-pulsar-blue shrink-0">
              <circle cx="8.5" cy="8.5" r="7" stroke="currentColor" strokeWidth="1.8" />
              <line x1="13.5" y1="13.5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id="store-search"
              type="search"
              inputMode="search"
              placeholder="City, ZIP, or store name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none font-inter text-[16px] text-gray-800 placeholder-gray-400"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search" className="text-gray-400 hover:text-pulsar-pink text-[20px] leading-none">×</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {STATES.map(s => (
              <button
                key={s.code}
                onClick={() => setStateFilter(s.code)}
                className={`font-futura font-[800] text-[12px] uppercase tracking-wide px-5 py-2 rounded-full transition-colors ${
                  stateFilter === s.code ? 'bg-pulsar-blue text-white' : 'bg-pulsar-light-blue-bg text-pulsar-blue hover:bg-pulsar-light-blue'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-5 sm:px-8 lg:px-16 xl:px-[140px] py-12">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-inter text-[14px] text-gray-500 mb-6" aria-live="polite">
            {results.length} {results.length === 1 ? 'location' : 'locations'}
            {stateFilter !== 'all' && ` in ${STATES.find(s => s.code === stateFilter).label}`}
            {query && ` matching “${query}”`}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
              <h2 className="font-futura font-[900] text-[24px] text-pulsar-blue uppercase mb-2">No stores there yet</h2>
              <p className="font-inter text-[15px] text-gray-500 max-w-[420px] mx-auto mb-6">
                We add new spots every month. Order online in the meantime, or tell your local bar to stock us.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/shop" className="bg-pulsar-pink text-white font-futura font-[800] text-[13px] uppercase tracking-wide px-7 py-3 rounded-full hover:bg-pulsar-pink-dark transition-colors">Shop online</Link>
                <Link to="/wholesale" className="bg-pulsar-light-blue-bg text-pulsar-blue font-futura font-[800] text-[13px] uppercase tracking-wide px-7 py-3 rounded-full hover:bg-pulsar-light-blue transition-colors">Stock Pulsar</Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {Object.entries(grouped).map(([state, cities]) => (
                <div key={state}>
                  <h2 className="font-futura font-[900] text-[20px] text-pulsar-pink uppercase tracking-wide mb-4">
                    {state === 'AZ' ? 'Arizona' : 'Nevada'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(cities).flatMap(([, stores]) =>
                      stores.map(store => (
                        <div key={store.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all bg-white">
                          <p className="font-futura font-[800] text-[11px] text-pulsar-blue uppercase tracking-widest mb-1">{store.type}</p>
                          <h3 className="font-futura font-[900] text-[18px] text-gray-900 leading-tight mb-2">{store.name}</h3>
                          <p className="font-inter text-[14px] text-gray-600 leading-snug">{store.address}</p>
                          <p className="font-inter text-[14px] text-gray-600 mb-4">{store.city}, {store.state} {store.zip}</p>
                          <div className="flex flex-wrap gap-3">
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(`${store.name} ${store.address} ${store.city} ${store.state}`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="font-futura font-[800] text-[12px] uppercase tracking-wide text-pulsar-pink hover:text-pulsar-pink-dark transition-colors inline-flex items-center gap-1"
                            >
                              Directions →
                            </a>
                            <a href={`tel:${store.phone.replace(/\D/g, '')}`} className="font-inter text-[13px] text-gray-500 hover:text-pulsar-blue transition-colors">{store.phone}</a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Retailer CTA */}
      <section className="bg-pulsar-light-blue-bg px-5 sm:px-8 lg:px-16 xl:px-[140px] py-14">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-futura font-[900] text-[24px] text-pulsar-blue uppercase mb-1">Want Pulsar in your store?</h2>
            <p className="font-inter text-[15px] text-gray-600">Low minimums, real margins, no contracts.</p>
          </div>
          <Link to="/wholesale" className="bg-pulsar-blue text-white font-futura font-[800] text-[13px] uppercase tracking-wide px-8 py-4 rounded-full hover:bg-pulsar-blue-dark transition-colors whitespace-nowrap shrink-0">
            See wholesale
          </Link>
        </div>
      </section>
    </div>
  )
}
