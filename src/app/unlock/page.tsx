"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Check, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { hasPro, setPro, clearPro, MONETIZATION, openCheckout } from "@/lib/monetization";
import { useToast } from "@/components/ui/toast";

// Simple offline license validation — accepts any key matching the format HYRED-XXXX-XXXX-XXXX.
// Replace with server-side validation when you wire Stripe webhooks.
function isValidLicense(key: string): boolean {
  return /^HYRED-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(key.trim());
}

export default function UnlockPage() {
  const [licenseKey, setLicenseKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    setUnlocked(hasPro());
  }, []);

  const activate = () => {
    setError(null);
    if (!isValidLicense(licenseKey)) {
      setError("Invalid license format. Should look like: HYRED-XXXX-XXXX-XXXX");
      return;
    }
    setPro(licenseKey.toUpperCase().trim());
    setUnlocked(true);
    toast.success("Pro unlocked! 🎉", "Refresh any page to see Pro features.");
  };

  const deactivate = () => {
    if (!confirm("Deactivate Pro on this browser?")) return;
    clearPro();
    setUnlocked(false);
    setLicenseKey("");
    toast.info("Pro deactivated", "Free features still work.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-white">
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <Crown size={48} className="mx-auto mb-3 text-amber-500" fill="currentColor" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {unlocked ? "Pro is active" : "Activate Hyred Pro"}
              </h1>
              <p className="text-gray-600">
                {unlocked
                  ? "Thanks for supporting Hyred. Every Pro feature is now unlocked on this browser."
                  : "Paste your license key from your purchase email."}
              </p>
            </div>

            {unlocked ? (
              <Card hover={false} className="border-2 border-emerald-200 bg-emerald-50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-200">
                    <Check size={20} className="text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900">Pro features unlocked</p>
                      <p className="text-xs text-gray-600">
                        Application tracker, AI coach, deploy helper, unlimited AI, no footer badge.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/tools">
                      <Button>
                        Go to AI tools
                        <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                    <Button onClick={deactivate} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      Deactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card hover={false}>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        License key
                      </label>
                      <input
                        type="text"
                        value={licenseKey}
                        onChange={e => setLicenseKey(e.target.value.toUpperCase())}
                        placeholder="HYRED-XXXX-XXXX-XXXX"
                        className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                        autoComplete="off"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}

                    <Button onClick={activate} disabled={!licenseKey} className="w-full" size="lg">
                      <Sparkles size={16} className="mr-2" />
                      Activate Pro
                    </Button>
                  </CardContent>
                </Card>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Don&apos;t have a license yet?
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button onClick={() => openCheckout("pro")} variant="outline">
                      Buy Pro · {MONETIZATION.proPriceUSD}
                    </Button>
                    <Button onClick={() => openCheckout("lifetime")} variant="outline">
                      Lifetime · {MONETIZATION.lifetimePriceUSD}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
