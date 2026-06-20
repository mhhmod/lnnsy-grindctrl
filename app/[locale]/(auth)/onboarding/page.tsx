"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ConnectCard } from "@/components/onboarding/ConnectCard";
import { Button } from "@/components/ui/button";
import { Brandmark } from "@/components/brand/Brandmark";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const locale = useLocale();

  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [bostaConnected, setBostaConnected] = useState(false);

  const bothConnected = shopifyConnected && bostaConnected;

  return (
    <div className="w-full max-w-[440px] space-y-6">
      {/* Brandmark */}
      <div className="flex justify-center">
        <Brandmark />
      </div>

      {/* Heading */}
      <div className="text-center space-y-1">
        <h1 className="font-display text-[22px] font-semibold">{t("title")}</h1>
        <p className="font-sans text-[13px] text-muted-foreground max-w-sm mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Connect cards */}
      <div className="space-y-px">
        <ConnectCard
          letter="S"
          name={t("shopifyName")}
          desc={t("shopifyDesc")}
          connected={shopifyConnected}
          onConnect={() => setShopifyConnected(true)}
          connectLabel={t("connectLabel")}
          connectedLabel={t("connectedLabel")}
        />
        <ConnectCard
          letter="B"
          name={t("bostaName")}
          desc={t("bostaDesc")}
          connected={bostaConnected}
          onConnect={() => setBostaConnected(true)}
          connectLabel={t("connectLabel")}
          connectedLabel={t("connectedLabel")}
        />
      </div>

      {/* Continue button — disabled (40% opacity) until both connected */}
      {bothConnected ? (
        <Button asChild className="w-full">
          <Link href={`/${locale}/overview`}>{t("continue")}</Link>
        </Button>
      ) : (
        <Button disabled className="w-full opacity-40">
          {t("continue")}
        </Button>
      )}
    </div>
  );
}
