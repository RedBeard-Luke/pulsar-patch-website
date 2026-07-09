import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-5 py-24 text-center">
      <div className="max-w-[460px]">
        <p className="font-futura font-[900] text-[clamp(4rem,16vw,7rem)] text-pulsar-light-blue leading-none mb-2">404</p>
        <h1 className="font-futura font-[900] text-[28px] text-pulsar-blue uppercase mb-3">Rough morning?</h1>
        <p className="font-inter text-[16px] text-gray-600 mb-8">
          This page isn't here. But the patches are. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="bg-pulsar-blue text-white font-futura font-[800] text-[13px] uppercase tracking-wide px-7 py-3.5 rounded-full hover:bg-pulsar-blue-dark transition-colors">Home</Link>
          <Link to="/shop" className="bg-pulsar-pink text-white font-futura font-[800] text-[13px] uppercase tracking-wide px-7 py-3.5 rounded-full hover:bg-pulsar-pink-dark transition-colors">Shop patches</Link>
        </div>
      </div>
    </div>
  )
}
