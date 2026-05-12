"use client";

import { useEffect } from "react";
import { captureReferralFromUrl } from "@/lib/referral";

export default function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);
  return null;
}
