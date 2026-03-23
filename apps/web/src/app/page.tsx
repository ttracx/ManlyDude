import Link from 'next/link';

/** Landing page for ManlyDude */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
          Made by Men of Men, for the Most Manliest of Dudes
        </p>
        <h1 className="mb-6 text-7xl font-black leading-tight tracking-tight md:text-8xl">
          MANLY<span className="text-blue-400">DUDE</span>
        </h1>
        <p className="mb-4 max-w-2xl text-xl text-gray-300 md:text-2xl">
          The only fitness app that understands your gains are not just physical &mdash;
          they&apos;re <span className="font-bold text-white">spiritual</span>.
        </p>
        <p className="mb-10 max-w-xl text-lg text-gray-400">
          AI-powered coaching so advanced, it once convinced a barbell to lift itself.
          Your muscles will write thank-you letters.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="#tiers"
            className="rounded-2xl bg-blue-600 px-10 py-4 text-lg font-bold transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/30"
          >
            Unleash the Beast
          </a>
          <a
            href="#features"
            className="rounded-2xl border-2 border-gray-600 px-10 py-4 text-lg font-bold text-gray-300 transition-all hover:border-white hover:text-white"
          >
            Witness the Power
          </a>
        </div>
        <p className="mt-8 text-xs text-gray-600">
          Warning: Side effects may include extreme confidence, involuntary flexing, and shirts that no longer fit.
        </p>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-800 bg-gray-900/50 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {[
            { value: '600+', label: 'Exercises', subtitle: 'Each manlier than the last' },
            { value: '10M+', label: 'Sets Logged', subtitle: 'Gains verified' },
            { value: '99.9%', label: 'Uptime', subtitle: 'Unlike your excuses' },
            { value: '∞', label: 'Motivation', subtitle: 'AI-generated hype' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-black text-blue-400">{stat.value}</p>
              <p className="text-lg font-semibold text-white">{stat.label}</p>
              <p className="text-sm text-gray-500">{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-5xl font-black">
            Features So Powerful,<br />
            <span className="text-blue-400">Your Gym Will Be Jealous</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
            Every feature forged in the fires of a thousand workouts.
            Tested by actual dudes. Approved by science (probably).
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '🤖',
                title: 'AI Coach That Actually Gets You',
                desc: 'Powered by Claude AI. It knows when you skipped leg day. It always knows.',
              },
              {
                icon: '💪',
                title: 'Workout Logging at Light Speed',
                desc: 'Log sets faster than you can say "one more rep." Offline-first because gains wait for no WiFi.',
              },
              {
                icon: '📊',
                title: 'Strength Score',
                desc: 'A single number that defines your worth as a human being. Just kidding. But also not really.',
              },
              {
                icon: '🎥',
                title: 'AI Form Review',
                desc: 'Upload a video. Our AI will roast your squat depth with surgical precision. You\'re welcome.',
              },
              {
                icon: '🥩',
                title: 'Nutrition That Slaps',
                desc: 'AI-generated meal plans. Protein targets so optimized, chickens are filing restraining orders.',
              },
              {
                icon: '🏆',
                title: 'Progress Photos',
                desc: 'Document your glow-up. Before and after pics that\'ll make your past self proud and slightly jealous.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-blue-800 hover:bg-gray-900"
              >
                <span className="text-4xl">{feature.icon}</span>
                <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-gray-800 bg-gray-900/30 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-16 text-5xl font-black">
            Three Steps to <span className="text-orange-400">Legendary</span>
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: '01', title: 'Download', desc: 'Install the app. Your phone will feel heavier. That\'s the gains downloading.' },
              { step: '02', title: 'Train', desc: 'Follow AI-generated plans or go rogue. Either way, ManlyDude has your back (and your lats).' },
              { step: '03', title: 'Dominate', desc: 'Watch your strength score climb. Flex in the mirror. Tell everyone about ManlyDude. Repeat.' },
            ].map((item) => (
              <div key={item.step}>
                <p className="text-6xl font-black text-blue-400/30">{item.step}</p>
                <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
                <p className="mt-2 text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tiers" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-5xl font-black">
            Choose Your <span className="text-blue-400">Destiny</span>
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-lg text-gray-400">
            All plans include unlimited manliness. Premium plans include extra swagger.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Tier */}
            <div className="rounded-3xl border border-gray-800 bg-gray-900/50 p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Free</p>
              <p className="mt-2 text-5xl font-black">$0</p>
              <p className="text-gray-500">Forever free. Like air. But for gains.</p>
              <ul className="mt-8 space-y-3">
                {['Unlimited workout logging', 'Exercise library (600+)', 'Rest timer', 'Social groups'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-xl border-2 border-gray-700 py-3 font-bold text-gray-300 transition-all hover:border-white hover:text-white">
                Start Free
              </button>
            </div>

            {/* Plus Tier */}
            <div className="relative rounded-3xl border-2 border-blue-500 bg-blue-950/30 p-8 shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-400">Plus</p>
              <p className="mt-2 text-5xl font-black">$19<span className="text-xl text-gray-400">/mo</span></p>
              <p className="text-gray-400">For dudes who are serious about the grind.</p>
              <ul className="mt-8 space-y-3">
                {[
                  'Everything in Free',
                  'AI-generated training plans',
                  'Strength score tracking',
                  'Nutrition targets',
                  'Custom exercises & supersets',
                  'Progress photos',
                  'Educational lessons',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <span className="text-blue-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-bold transition-all hover:bg-blue-500">
                Get Plus
              </button>
            </div>

            {/* Premium Tier */}
            <div className="rounded-3xl border border-orange-500/30 bg-orange-950/10 p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-orange-400">Premium</p>
              <p className="mt-2 text-5xl font-black">$99<span className="text-xl text-gray-400">/mo</span></p>
              <p className="text-gray-400">For the most manliest of all dudes.</p>
              <ul className="mt-8 space-y-3">
                {[
                  'Everything in Plus',
                  'AI coach chat (Claude-powered)',
                  'Video form review by AI',
                  'Custom training & nutrition',
                  'Weekly AI progress reviews',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <span className="text-orange-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 py-3 font-bold transition-all hover:from-orange-500 hover:to-orange-400">
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-gray-800 bg-gray-900/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-center text-4xl font-black">
            What the <span className="text-blue-400">Dudes</span> Are Saying
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: 'ManlyDude made me so strong, I accidentally opened a pickle jar from across the room. With my mind.',
                name: 'Chad Thunderlift',
                title: 'Professional Gain Enthusiast',
              },
              {
                quote: 'The AI coach told me my squat form was "mid." I cried. Then I fixed it. Now my squat form makes grown men weep.',
                name: 'Brock McBenchPress',
                title: 'Squat Redemption Arc Survivor',
              },
              {
                quote: 'I showed my strength score to my cat. Even she was impressed. She still doesn\'t care about me, but she respects the gains.',
                name: 'Dave "The Dumbbell" Davidson',
                title: 'Cat Dad & Deadlift Enthusiast',
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
                <p className="text-lg text-gray-300">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6">
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-black">
            Your Muscles Are <span className="text-orange-400">Waiting</span>
          </h2>
          <p className="mb-10 text-xl text-gray-400">
            Every second you spend not using ManlyDude is a second your gains are crying.
            Don&apos;t make your gains cry.
          </p>
          <a
            href="#tiers"
            className="inline-block rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-12 py-5 text-xl font-bold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30"
          >
            Join the Brotherhood
          </a>
          <p className="mt-6 text-sm text-gray-600">
            No credit card required for free tier. Your dignity is optional but recommended.
          </p>
        </div>
      </section>

    </main>
  );
}
