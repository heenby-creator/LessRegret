"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/types";

export function SetHtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
