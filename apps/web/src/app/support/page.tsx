import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support - ManlyDude',
  description: 'Get help with ManlyDude. FAQs, contact support, and troubleshooting.',
};

const faqs = [
  {
    q: 'How do I get started with ManlyDude?',
    a: 'Download the app, create a free account, and start logging your workouts immediately. No credit card required for the free tier.',
  },
  {
    q: 'What AI features are included in each tier?',
    a: 'Free tier includes manual workout logging. Plus ($19/mo) adds AI-generated training plans, strength scores, and nutrition targets. Premium ($99/mo) includes the AI coach chat, video form review, and custom plans.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. Cancel anytime from your account settings. Your subscription remains active until the end of your current billing period. No cancellation fees.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. We use Supabase with row-level security, encrypt all data in transit and at rest, and never sell your personal information. See our Privacy Policy for details.',
  },
  {
    q: 'How does the AI coach work?',
    a: 'The AI coach (Premium tier) is powered by Anthropic Claude. It uses your profile, workout history, and goals to provide personalized coaching advice, form tips, and programming guidance in real-time.',
  },
  {
    q: 'Does the app work offline?',
    a: 'Yes. The mobile app is offline-first — log workouts without WiFi and everything syncs automatically when you reconnect.',
  },
  {
    q: 'Can I export my workout data?',
    a: 'Yes. You can request a full export of your data at any time from your account settings or by contacting support.',
  },
  {
    q: 'What if the AI gives bad advice?',
    a: 'Our AI is trained to prioritize safety and evidence-based practices. However, AI-generated plans are informational — always consult a healthcare professional before starting new exercise programs, especially if you have health conditions.',
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 pt-24 text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-4 text-4xl font-black">Support</h1>
        <p className="mb-12 text-lg text-gray-400">
          Need help? We&apos;ve got your back (and your lats).
        </p>

        {/* Contact */}
        <section className="mb-16 rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
          <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
          <p className="mb-6 text-gray-400">
            Can&apos;t find what you need in the FAQs? Reach out directly.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:support@vibecaas.com"
              className="flex items-center gap-3 rounded-xl border border-gray-700 px-6 py-4 text-gray-300 transition-all hover:border-blue-500 hover:text-white"
            >
              <span className="text-2xl">@</span>
              <div>
                <p className="font-bold">Email Support</p>
                <p className="text-sm text-gray-500">support@vibecaas.com</p>
              </div>
            </a>
            <a
              href="https://github.com/ttracx/ManlyDude/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-gray-700 px-6 py-4 text-gray-300 transition-all hover:border-blue-500 hover:text-white"
            >
              <span className="text-2xl">&lt;/&gt;</span>
              <div>
                <p className="font-bold">Bug Reports</p>
                <p className="text-sm text-gray-500">GitHub Issues</p>
              </div>
            </a>
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="mb-8 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-gray-800 bg-gray-900/50 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between px-6 py-5 text-lg font-semibold text-white transition-colors hover:text-blue-400">
                  {faq.q}
                  <span className="ml-4 text-gray-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 leading-relaxed text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <p className="text-gray-500">
            Ready to get back to training?{' '}
            <Link href="/#tiers" className="font-bold text-blue-400 hover:text-blue-300">
              View plans
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
