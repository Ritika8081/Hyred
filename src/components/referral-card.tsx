"use client";

import { useEffect, useState } from "react";
import { Gift, Copy, Check, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyReferralCode, getMyReferralUrl, getReferralCount } from "@/lib/referral";
import { useToast } from "@/components/ui/toast";

const PRO_GOAL = 3;

export default function ReferralCard() {
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setCode(getMyReferralCode());
    setUrl(getMyReferralUrl());
    setCount(getReferralCount());
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const remaining = Math.max(0, PRO_GOAL - count);
  const tweet = `Free AI resume builder that actually works. Paste your resume, get a portfolio site + cover letter + interview prep in 7 minutes. Use my link 👇`;

  return (
    <Card className="mb-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50" hover={false}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              🎁 Invite friends → unlock Pro free
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              When {PRO_GOAL} friends sign up with your code, we send you a free Pro license.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">
              Progress: <strong>{count}</strong> of {PRO_GOAL}
            </span>
            {remaining === 0 ? (
              <span className="text-xs font-bold text-emerald-700">🎉 Pro unlocked!</span>
            ) : (
              <span className="text-xs text-gray-500">
                {remaining} to go
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (count / PRO_GOAL) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            readOnly
            onClick={e => (e.target as HTMLInputElement).select()}
            className="flex-1 p-2.5 border border-gray-300 rounded-lg font-mono text-xs bg-white"
          />
          <Button onClick={copy} size="sm">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <Twitter size={14} className="mr-1.5" />
              Tweet
            </Button>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <Linkedin size={14} className="mr-1.5" />
              LinkedIn
            </Button>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${tweet} ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <MessageCircle size={14} className="mr-1.5" />
              WhatsApp
            </Button>
          </a>
        </div>

        <p className="text-xs text-gray-500">
          💡 Your code: <code className="bg-white px-1.5 py-0.5 rounded border">{code}</code> · Email <a className="underline" href="mailto:hello@hyred.io?subject=Referral%20reward%20claim">hello@hyred.io</a> to claim your Pro license when you hit {PRO_GOAL}.
        </p>
      </CardContent>
    </Card>
  );
}
