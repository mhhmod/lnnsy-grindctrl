"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Brandmark } from "@/components/brand/Brandmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();

  return (
    <div className="w-full max-w-[380px] space-y-6">
      {/* Brandmark */}
      <div className="flex justify-center">
        <Brandmark />
      </div>

      {/* Card */}
      <div className="border p-8 space-y-6">
        {/* Heading */}
        <div className="space-y-1 text-center">
          <h1 className="font-display text-[22px] font-semibold">{t("title")}</h1>
          <p className="font-sans text-[13px] text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="font-sans text-[12px] text-muted-foreground"
            >
              {t("email")}
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className="font-sans text-[13px]"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="font-sans text-[12px] text-muted-foreground"
            >
              {t("password")}
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              className="font-sans text-[13px]"
            />
          </div>
        </div>

        {/* Sign in button — links to overview (no real auth) */}
        <Button asChild className="w-full">
          <Link href={`/${locale}/overview`}>{t("submit")}</Link>
        </Button>
      </div>

      {/* Create workspace link */}
      <p className="text-center font-sans text-[12px] text-muted-foreground">
        {t("noWorkspace")}{" "}
        <Link
          href={`/${locale}/onboarding`}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
