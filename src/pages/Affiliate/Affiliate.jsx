import { Link } from 'react-router-dom'

const steps = [
  { n: '1', title: 'Grab your code', body: 'Make an account and you get a unique referral code on the spot.' },
  { n: '2', title: 'Share it', body: 'Drop it in your group chat, your story, wherever your people are.' },
  { n: '3', title: 'Get paid', body: 'They save 15%, you earn cash on every order they place. Simple.' },
]

export default function Affiliate() {
  return (
    <div className="w-full bg-white">
      <section className="bg-pulsar-pink text-white pt-16 pb-16 px-5 sm:px-8 lg:px-16 xl:px-[140px]">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="font-futura font-[800] text-[12px] uppercase tracking-[3px] text-white/80 mb-3">Pulsar Affiliates</p>
          <h1 className="font-futura font-[900] text-[clamp(2.25rem,8vw,4rem)] leading-[1.05] uppercase mb-4">Get paid to spread the word</h1>
          <p className="font-inter text-[16px] sm:text-[18px] text-white/90 max-w-[560px] mx-auto leading-relaxed mb-8">
            You already tell your friends about Pulsar. Might as well get paid for it. No follower minimum, no catch.
          </p>
          <Link to="/account" className="inline-block bg-white text-pulsar-pink font-futura font-[800] text-[14px] uppercase tracking-wide px-8 py-4 rounded-full hover:-translate-y-0.5 transition-transform shadow-md">
            Get my code
          </Link>
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-16 xl:px-[140px] py-16">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map(s => (
            <div key={s.n} className="text-center">
              <div className="w-14 h-14 rounded-full bg-pulsar-blue text-white font-futura font-[900] text-[24px] flex items-center justify-center mx-auto mb-4">{s.n}</div>
              <h2 className="font-futura font-[900] text-[18px] text-pulsar-blue uppercase mb-2">{s.title}</h2>
              <p className="font-inter text-[15px] text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-pulsar-light-blue-bg px-5 sm:px-8 lg:px-16 xl:px-[140px] py-14">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-futura font-[900] text-[26px] text-pulsar-blue uppercase mb-3">Running a bar or a big following?</h2>
          <p className="font-inter text-[15px] text-gray-600 mb-6 max-w-[520px] mx-auto">
            If you move real volume, wholesale gets you better pricing than the affiliate program.
          </p>
          <Link to="/wholesale" className="inline-block bg-pulsar-blue text-white font-futura font-[800] text-[13px] uppercase tracking-wide px-8 py-4 rounded-full hover:bg-pulsar-blue-dark transition-colors">
            See wholesale
          </Link>
        </div>
      </section>
    </div>
  )
}
