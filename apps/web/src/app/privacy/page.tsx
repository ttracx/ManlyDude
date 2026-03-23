import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ManlyDude',
  description: 'Privacy Policy for the ManlyDude fitness platform.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 pt-24 text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-4xl font-black">Privacy Policy</h1>
        <p className="mb-12 text-sm text-gray-500">Last updated: March 23, 2026</p>

        <div className="space-y-8 text-gray-300 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_p]:leading-relaxed [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1">
          <section>
            <h2>1. Introduction</h2>
            <p>
              ManlyDude, operated by NeuralQuantum.ai LLC through its VibeCaaS.com division, is
              committed to protecting your privacy. This policy explains how we collect, use, and
              safeguard your personal information when you use our fitness platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="mt-3 text-gray-400">
              <li>
                <strong className="text-gray-300">Account information:</strong> Email address, name,
                and profile details you provide during registration
              </li>
              <li>
                <strong className="text-gray-300">Body metrics:</strong> Height, weight, date of
                birth, and gender (optional, used for personalized AI coaching)
              </li>
              <li>
                <strong className="text-gray-300">Fitness data:</strong> Workout logs, exercise
                history, progress photos, and nutrition entries
              </li>
              <li>
                <strong className="text-gray-300">AI interactions:</strong> Messages sent to the AI
                coach for the purpose of providing responses
              </li>
              <li>
                <strong className="text-gray-300">Payment information:</strong> Processed securely
                through Stripe; we do not store credit card numbers
              </li>
              <li>
                <strong className="text-gray-300">Usage data:</strong> App interactions, device info,
                and crash reports
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="mt-3 text-gray-400">
              <li>Provide and improve the ManlyDude service</li>
              <li>Generate personalized AI workout and nutrition plans</li>
              <li>Power the AI coaching chat with context about your fitness profile</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service updates and notifications</li>
              <li>Analyze aggregate usage patterns to improve the platform</li>
            </ul>
          </section>

          <section>
            <h2>4. AI Data Processing</h2>
            <p>
              Our AI features are powered by Anthropic Claude. When you use AI-powered features
              (workout generation, nutrition plans, AI coach chat), relevant profile data and your
              inputs are sent to Anthropic&apos;s API for processing. Anthropic does not use your data
              to train their models. We do not share your personal data with any other AI providers.
            </p>
          </section>

          <section>
            <h2>5. Data Storage &amp; Security</h2>
            <p>
              Your data is stored securely using Supabase (hosted on AWS) with row-level security
              policies ensuring users can only access their own data. All data is encrypted in transit
              (TLS) and at rest. We implement industry-standard security practices to protect your
              information.
            </p>
          </section>

          <section>
            <h2>6. Data Sharing</h2>
            <p>
              We do not sell your personal data. We share data only with the following service
              providers who are necessary to operate the platform:
            </p>
            <ul className="mt-3 text-gray-400">
              <li><strong className="text-gray-300">Supabase:</strong> Database and authentication</li>
              <li><strong className="text-gray-300">Stripe:</strong> Payment processing</li>
              <li><strong className="text-gray-300">Anthropic:</strong> AI workout/nutrition generation and coaching</li>
              <li><strong className="text-gray-300">Vercel:</strong> Web application hosting</li>
            </ul>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="mt-3 text-gray-400">
              <li>Access and download your personal data</li>
              <li>Correct inaccurate information in your profile</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you delete your account,
              we will remove your personal data within 30 days, except where we are required to retain
              it for legal or compliance purposes.
            </p>
          </section>

          <section>
            <h2>9. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We do not use
              third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2>10. Children&apos;s Privacy</h2>
            <p>
              ManlyDude is not intended for users under the age of 16. We do not knowingly collect
              personal information from children under 16.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant
              changes via email or in-app notification.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              For privacy-related inquiries, contact us at{' '}
              <a href="mailto:privacy@vibecaas.com" className="text-blue-400 underline hover:text-blue-300">
                privacy@vibecaas.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
