"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, ExternalLink, Github, Globe, Check, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import CopyButton from "@/components/ui/copy-button";
import ProGate from "@/components/pro-gate";

const VERCEL_DEPLOY = "https://vercel.com/new/clone?repository-url=https://github.com/Ritika8081/Hyred&project-name=my-portfolio";
const NETLIFY_DEPLOY = "https://app.netlify.com/start/deploy?repository=https://github.com/Ritika8081/Hyred";

export default function DeployPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white">
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10">
              <Rocket size={48} className="mx-auto mb-3 text-purple-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Deploy your portfolio in 3 minutes
              </h1>
              <p className="text-gray-600">
                Get your portfolio live at <code className="bg-gray-100 px-1.5 rounded">yourname.com</code> for free. No DevOps. No CLI.
              </p>
            </div>

            <ProGate feature="Unlock 1-click deploy guide" variant="block">
              <div className="space-y-4">
                {/* Step 1: Export data */}
                <DeployStep
                  number={1}
                  active={step === 1}
                  done={step > 1}
                  title="Export your portfolio data"
                  onClick={() => setStep(1)}
                >
                  <p className="text-sm text-gray-700 mb-3">
                    Go to <Link href="/admin" className="text-blue-600 underline">Admin → Quick Actions → Export</Link>.
                    A <code className="bg-gray-100 px-1 rounded">portfolio-data.json</code> file downloads.
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    You&apos;ll drop this into the cloned repo&apos;s <code className="bg-gray-100 px-1 rounded">src/data/portfolio.ts</code> in step 3.
                  </p>
                  <Button onClick={() => setStep(2)}>
                    Done →
                  </Button>
                </DeployStep>

                {/* Step 2: Deploy */}
                <DeployStep
                  number={2}
                  active={step === 2}
                  done={step > 2}
                  title="One-click deploy"
                  onClick={() => setStep(2)}
                >
                  <p className="text-sm text-gray-700 mb-4">
                    Pick a host. Both are free and require zero setup.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a href={VERCEL_DEPLOY} target="_blank" rel="noopener noreferrer">
                      <Card hover={false} className="hover:border-gray-900 cursor-pointer transition">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-black flex items-center justify-center">
                              <span className="text-white font-bold text-sm">▲</span>
                            </div>
                            <p className="font-bold">Vercel</p>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Best for Next.js. Auto HTTPS. Free custom domain.</p>
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold">
                            Deploy <ExternalLink size={11} />
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                    <a href={NETLIFY_DEPLOY} target="_blank" rel="noopener noreferrer">
                      <Card hover={false} className="hover:border-teal-500 cursor-pointer transition">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center">
                              <Globe size={16} className="text-white" />
                            </div>
                            <p className="font-bold">Netlify</p>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Drag &amp; drop friendly. Auto HTTPS. Free.</p>
                          <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-semibold">
                            Deploy <ExternalLink size={11} />
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                  </div>
                  <Button onClick={() => setStep(3)} className="mt-3">
                    I clicked deploy →
                  </Button>
                </DeployStep>

                {/* Step 3: Replace data */}
                <DeployStep
                  number={3}
                  active={step === 3}
                  done={step > 3}
                  title="Paste your data into the deployed repo"
                  onClick={() => setStep(3)}
                >
                  <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside mb-3">
                    <li>In your GitHub repo, open <code className="bg-gray-100 px-1 rounded">src/data/portfolio.ts</code>.</li>
                    <li>
                      Replace the existing <code className="bg-gray-100 px-1 rounded">portfolioData</code> export with the contents of your downloaded JSON, wrapped like this:
                    </li>
                  </ol>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { Portfolio } from '@/types/portfolio';

export const portfolioData: Portfolio = {
  // ← paste contents of portfolio-data.json here
};`}
                    </pre>
                    <div className="absolute top-2 right-2">
                      <CopyButton
                        value={`import { Portfolio } from '@/types/portfolio';\n\nexport const portfolioData: Portfolio = {\n  // ← paste contents of portfolio-data.json here\n};`}
                        label="Copy"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Commit + push. Vercel/Netlify auto-redeploys. Live in ~60 seconds.
                  </p>
                  <Button onClick={() => setStep(4)} className="mt-3">
                    Live? Continue →
                  </Button>
                </DeployStep>

                {/* Step 4: Custom domain */}
                <DeployStep
                  number={4}
                  active={step === 4}
                  done={false}
                  title="Connect a custom domain (optional)"
                  onClick={() => setStep(4)}
                >
                  <p className="text-sm text-gray-700 mb-3">
                    Your portfolio is now at <code className="bg-gray-100 px-1 rounded">my-portfolio.vercel.app</code>. To use your own domain (<code className="bg-gray-100 px-1 rounded">yourname.com</code>):
                  </p>
                  <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside mb-3">
                    <li>
                      Buy a domain. <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Namecheap</a> sells <code className="bg-gray-100 px-1 rounded">.com</code> for ~$10/yr.
                    </li>
                    <li>
                      <strong>Vercel</strong>: Project → Settings → Domains → Add. Vercel tells you which DNS records to add.
                      <br />
                      <strong>Netlify</strong>: Site → Domain Management → Add custom domain. Same flow.
                    </li>
                    <li>
                      Paste the DNS records into your domain registrar. Wait ~10 min for propagation.
                    </li>
                  </ol>
                  <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-start gap-2">
                    <Check size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      That&apos;s it. Auto HTTPS via Let&apos;s Encrypt. Forever free.
                    </span>
                  </div>
                </DeployStep>
              </div>

              <Card hover={false} className="mt-6 bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex items-start gap-2 text-sm text-blue-900">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Stuck?</strong> Email <a href="mailto:support@hyred.io" className="underline font-semibold">support@hyred.io</a> with a screenshot — Pro users get a reply within 24h.
                  </span>
                </CardContent>
              </Card>
            </ProGate>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

function DeployStep({
  number,
  active,
  done,
  title,
  onClick,
  children,
}: {
  number: number;
  active: boolean;
  done: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card hover={false} className={active ? "border-purple-400 ring-1 ring-purple-200" : ""}>
      <CardContent className="p-5">
        <button
          type="button"
          onClick={onClick}
          className="w-full flex items-center gap-3 text-left mb-3"
        >
          <span
            className={`flex-shrink-0 w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center ${
              done
                ? "bg-emerald-500 text-white"
                : active
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {done ? <Check size={16} /> : number}
          </span>
          <h3 className="font-bold text-gray-900 flex-1">{title}</h3>
        </button>
        {active && <div className="ml-11">{children}</div>}
      </CardContent>
    </Card>
  );
}
