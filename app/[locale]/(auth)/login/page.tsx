"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Brandmark } from "@/components/brand/Brandmark";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";

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
      <div className="border border-hairline bg-paper p-8 space-y-6">
        {/* Heading */}
        <div className="space-y-1 text-center">
          <h1 className="font-display text-[22px] font-semibold text-ink">
            {t("title")}
          </h1>
          <p className="font-sans text-[13px] text-muted2">
            {t("subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block font-sans text-[12px] text-muted2"
            >
              {t("email")}
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block font-sans text-[12px] text-muted2"
            >
              {t("password")}
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
            />
          </div>
        </div>

        {/* Sign in button — links to overview (no real auth) */}
        <Button variant="primary" href={`/${locale}/overview`} className="w-full">
          {t("submit")}
        </Button>
      </div>

      {/* Create workspace link */}
      <p className="text-center font-sans text-[12px] text-muted2">
        {t("noWorkspace")}{" "}
        <Link
          href={`/${locale}/onboarding`}
          className="underline underline-offset-2 text-ink hover:text-muted2 transition-colors duration-[140ms]"
        >
          {t("createOne")}
        </Link>
      </p>
    </div>
  );
}
