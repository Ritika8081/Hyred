"use client";

import Link from "next/link";
import { Star, Quote, ArrowRight, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { MONETIZATION } from "@/lib/monetization";

// 👉 Add real reviews here as you collect them via the feedback widget.
// Each entry must come from a real user — never fake.
interface Review {
  name: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
}

const REVIEWS: Review[] = [
  // Example shape — uncomment + replace with real reviews:
  // { name: "Aarav P.", role: "CS student", rating: 5, quote: "..." },
];

export default function ReviewsPage() {
  const hasReviews = REVIEWS.length > 0;

  // Only compute aggregate if we have real reviews
  const avgRating = hasReviews
    ? (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)
    : null;

  // Stats — only show items that have a real value
  const stats = [
    MONETIZATION.stats.resumesBuilt > 0 && {
      label: "Resumes built",
      value: MONETIZATION.stats.resumesBuilt.toLocaleString() + "+",
    },
    MONETIZATION.stats.avgAtsLift && {
      label: "Avg ATS score lift",
      value: MONETIZATION.stats.avgAtsLift,
    },
    MONETIZATION.stats.avgBuildMinutes > 0 && {
      label: "Avg time to first portfolio",
      value: `${MONETIZATION.stats.avgBuildMinutes} min`,
    },
    hasReviews && {
      label: "Reviews avg",
      value: `${avgRating} ★`,
    },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-gray-900 mb-3 tracking-tightest leading-[1.05]">
              {hasReviews ? (
                <>
                  <span className="gradient-text italic font-normal">Loved</span> by students worldwide
                </>
              ) : (
                <>
                  Reviews{" "}
                  <span className="gradient-text italic font-normal">coming soon</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {hasReviews
                ? "Real feedback from people who got Hyred using our tools."
                : "We're new — and we'd rather show nothing than fake reviews. Be one of the first to share your experience."}
            </p>
          </AnimatedSection>

          {/* Stats band — only renders if we have real numbers */}
          {stats.length > 0 && (
            <div className={`grid gap-4 mb-16 ${
              stats.length === 1 ? "grid-cols-1 max-w-xs mx-auto" :
              stats.length === 2 ? "grid-cols-2 max-w-md mx-auto" :
              stats.length === 3 ? "grid-cols-3 max-w-2xl mx-auto" :
              "grid-cols-2 md:grid-cols-4"
            }`}>
              {stats.map(s => (
                <Card key={s.label} hover={false}>
                  <CardContent className="p-5 text-center">
                    <div className="font-display text-2xl md:text-3xl font-semibold text-gray-900 mb-1 tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      {s.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Reviews grid OR empty state */}
          {hasReviews ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {REVIEWS.map(r => (
                <StaggerItem key={r.name}>
                  <Card className="h-full" hover={false}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-0.5 mb-3">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < r.rating ? "text-yellow-400" : "text-gray-200"}
                            fill={i < r.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <Quote size={20} className="text-brand-300 mb-2" />
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                        &ldquo;{r.quote}&rdquo;
                      </p>
                      <div className="border-t pt-3">
                        <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <Card hover={false} className="max-w-2xl mx-auto">
              <CardContent className="p-10 text-center">
                <Quote size={36} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-display text-2xl font-semibold text-gray-900 mb-2">
                  No reviews yet — by design
                </h3>
                <p className="text-gray-600 leading-relaxed mb-5 max-w-md mx-auto">
                  Other tools paste invented quotes here. We won&apos;t. We&apos;ll publish real reviews from real users only — including critical ones.
                </p>
                <Link href="/tools">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition">
                    Try Hyred — be the first reviewer
                    <ArrowRight size={14} />
                  </button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* CTA — share your story */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-brand-600 to-coral-600 text-white text-center">
            <MessageCircle size={32} className="mx-auto mb-3 opacity-90" />
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2 tracking-tight">
              Got a Hyred story?
            </h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Send your real experience with a screenshot. If we feature it, you get a free Pro upgrade. Honest reviews only — including criticism. Nothing fake, ever.
            </p>
            <a
              href={`mailto:${MONETIZATION.feedbackEmail}?subject=My Hyred story`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-brand-700 font-semibold hover:scale-105 transition"
            >
              Send your story
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-12 text-center">
            <Link href="/pricing">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition">
                See pricing →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
