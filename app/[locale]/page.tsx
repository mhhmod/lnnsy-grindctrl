"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

// Static export can't use a server-side redirect(), so redirect on the client.
// router.replace() automatically applies basePath, so this works under the
// GitHub Pages subpath as well as locally.
export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  useEffect(() => {
    router.replace(`/${locale}/overview`);
  }, [locale, router]);
  return null;
}
