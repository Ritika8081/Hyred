'use client';

import Link from 'next/link';
import { Heart, Twitter, Github, Linkedin, Mail, Shield, Globe, GitBranch } from 'lucide-react';
import Logo from '@/components/ui/logo';
import { SITE } from '@/lib/site-config';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { name: 'AI Tools', href: '/tools' },
      { name: 'Live example', href: '/preview' },
      { name: 'Help & onboarding', href: '/help' },
      { name: 'Deploy guide', href: '/deploy' },
    ],
  },
  {
    title: 'AI Tools',
    links: [
      { name: 'Recruiter View', href: '/tools/recruiter-view' },
      { name: 'Roast Resume', href: '/tools/roast' },
      { name: 'JD Matcher', href: '/tools/match' },
      { name: 'Mock Interview', href: '/tools/interview' },
      { name: 'All tools →', href: '/tools' },
    ],
  },
  {
    title: 'Open source',
    links: [
      { name: 'GitHub repo', href: 'https://github.com/Ritika8081/Hyred' },
      { name: 'Discussions', href: 'https://github.com/Ritika8081/Hyred/discussions' },
      { name: 'Report a bug', href: 'https://github.com/Ritika8081/Hyred/issues' },
      { name: 'Contribute', href: 'https://github.com/Ritika8081/Hyred/blob/main/CONTRIBUTING.md' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 text-gray-400">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Logo size={28} variant="white" className="mb-4" />
            <p className="text-sm leading-relaxed max-w-sm mb-5 text-gray-400">
              Open-source AI career toolkit. Build a portfolio + resume + ten job-hunt copilots — in your browser, on your terms.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Ritika8081/Hyred"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition"
                aria-label="GitHub"
              >
                <Github size={14} />
              </a>
              <a
                href="https://twitter.com/hyred"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter size={14} />
              </a>
              <a
                href="https://linkedin.com/company/hyred"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition"
                aria-label="Email"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-400 hover:text-white transition"
                      {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-12 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-emerald-400" />
            <span>Your data stays in your browser. Always.</span>
          </div>
          <div className="flex items-center gap-2 md:justify-center">
            <GitBranch size={14} className="text-brand-400" />
            <span>MIT-licensed · Forever free · No accounts</span>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <Globe size={14} className="text-blue-400" />
            <span>Built for job seekers worldwide</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} Hyred. MIT-licensed open source.</p>
          <p className="inline-flex items-center gap-1">
            Made with <Heart size={11} className="text-red-400 fill-red-400" /> for job seekers
          </p>
        </div>
      </div>
    </footer>
  );
}
