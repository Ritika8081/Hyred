"use client";

import { useState } from "react";
import { Share2, Copy, Check, Twitter, Linkedin, MessageCircle, AlertCircle } from "lucide-react";
import { Portfolio } from "@/types/portfolio";
import { buildShareUrl } from "@/lib/share";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

interface SharePortfolioProps {
  portfolio: Portfolio;
}

export default function SharePortfolio({ portfolio }: SharePortfolioProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const url = buildShareUrl(portfolio);
  const tooLong = url.length > 4000;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied!", "Paste it anywhere to share.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy", "Select the link manually.");
    }
  };

  const tweet = `Just built my portfolio with Hyred 🚀 take a look:`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${tweet} ${url}`)}`;

  return (
    <Card className="mb-6 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50" hover={false}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <Share2 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              🚀 Share your portfolio
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              One link. Works anywhere. Recruiters open it, see your portfolio instantly — no signup, no hosting needed.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            readOnly
            onClick={e => (e.target as HTMLInputElement).select()}
            className="flex-1 p-2.5 border border-gray-300 rounded-lg font-mono text-xs bg-white truncate"
          />
          <Button onClick={copy} size="sm">
            {copied ? (
              <>
                <Check size={14} className="mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} className="mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>

        {tooLong && (
          <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">
            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
            <span>
              Link is {Math.round(url.length / 1000)}KB — most platforms work, but some (like SMS) may truncate. For a permanent short URL, deploy your portfolio to GitHub Pages or Vercel (free).
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Twitter size={14} className="mr-1.5" />
              Share on X
            </Button>
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Linkedin size={14} className="mr-1.5" />
              LinkedIn
            </Button>
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <MessageCircle size={14} className="mr-1.5" />
              WhatsApp
            </Button>
          </a>
        </div>

        <p className="text-xs text-gray-500">
          💡 Your data lives inside the link itself — nothing is uploaded. Anyone with the link sees a read-only snapshot of your portfolio.
        </p>
      </CardContent>
    </Card>
  );
}
