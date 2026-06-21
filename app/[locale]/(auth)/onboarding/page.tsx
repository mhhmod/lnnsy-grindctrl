"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Brandmark } from "@/components/brand/Brandmark";
import { Button } from "@/components/primitives/Button";
import { Chip } from "@/components/primitives/Chip";
import { Glyph } from "@/components/brand/Glyph";
import { cx } from "@/lib/cx";

interface CardDef {
  key: string;
  letter: string;
  nameKey: "shopifyName" | "bostaName";
  descKey: "shopifyDesc" | "bostaDesc";
}

const CARDS: CardDef[] = [
  { key: "shopify", letter: "S", nameKey: "shopifyName", descKey: "shopifyDesc" },
  { key: "bosta",   letter: "B", nameKey: "bostaName",   descKey: "bostaDesc"   },
];

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const locale = useLocale();

  const [connected, setConnected] = useState<Record<string, boolean>>({
    shopify: false,
    bosta: false,
  });

  const bothConnected = connected.shopify && connected.bosta;

  function handleConnect(key: string) {
    setConnected((prev) => ({ ...prev, [key]: true }));
  }

  return (
    <div className="w-full max-w-[440px] space-y-6">
      {/* Brandmark */}
      <div className="flex justify-center">
        <Brandmark />
      </div>

      {/* Heading */}
      <div className="text-center space-y-1">
        <h1 className="font-display text-[22px] font-semibold text-ink">
          {t("title")}
        </h1>
        <p className="font-sans text-[13px] text-muted2 max-w-sm mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Connect cards */}
      <div className="space-y-px">
        {CARDS.map(({ key, letter, nameKey, descKey }) => {
          const isConnected = connected[key];
          return (
            <div
              key={key}
              className={cx(
                "flex items-center gap-4 border border-hairline p-4 transition-colors duration-[200ms]",
                isConnected ? "surface-inverted" : "bg-paper"
              )}
            >
              <Glyph letter={letter} inverted={isConnected} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-[14px] font-semibold">
                  {t(nameKey)}
                </div>
                <div
                  className={cx(
                    "font-sans text-[12px]",
                    isConnected ? "opacity-70" : "text-muted2"
                  )}
                >
                  {t(descKey)}
                </div>
              </div>
              {isConnected ? (
                <Chip variant="muted">{t("connectedLabel")}</Chip>
              ) : (
                <Button size="sm" onClick={() => handleConnect(key)}>
                  {t("connectLabel")}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue button — disabled at 40% opacity until both connected */}
      {bothConnected ? (
        <Button variant="primary" href={`/${locale}/overview`} className="w-full">
          {t("continue")}
        </Button>
      ) : (
        <div className="space-y-2">
          <Button variant="primary" className="w-full" disabled>
            {t("continue")}
          </Button>
          <p className="text-center font-sans text-[12px] text-faint">
            {t("connectBothHint")}
          </p>
        </div>
      )}
    </div>
  );
}
