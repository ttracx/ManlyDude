import Link from 'next/link';

const APP_NAME = 'ManlyDude';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-black tracking-tight text-white">
              MANLY<span className="text-blue-400">DUDE</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              AI-powered strength training for the most manliest of dudes.
              Manliness is a state of mind. Lift heavy, be kind.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-gray-400">
              Company
            </p>
            <Link href="/#features" className="text-sm text-gray-500 hover:text-white">
              Features
            </Link>
            <Link href="/#tiers" className="text-sm text-gray-500 hover:text-white">
              Pricing
            </Link>
            <Link href="/support" className="text-sm text-gray-500 hover:text-white">
              Support
            </Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-gray-400">Legal</p>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 {APP_NAME} powered by{' '}
            <a
              href="https://vibecaas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 underline hover:text-white"
            >
              VibeCaaS.com
            </a>{' '}
            a division of{' '}
            <a
              href="https://neuralquantum.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 underline hover:text-white"
            >
              NeuralQuantum.ai
            </a>{' '}
            LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
