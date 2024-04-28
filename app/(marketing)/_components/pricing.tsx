"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import styles from "@/pricing.module.css";

export type PricingTierFrequency = {
  id: string;
  value: string;
  label: string;
  priceSuffix: string;
};

export type PricingTier = {
  name: string;
  id: string;
  href: string;
  discountPrice: Record<string, string>;
  price: string | Record<string, string>;
  description: string | React.ReactNode;
  features: string[];
  featured?: boolean;
  highlighted?: boolean;
  cta: string;
  soldOut?: boolean;
};

export const frequencies: PricingTierFrequency[] = [
  { id: "1", value: "1", label: "Monthly", priceSuffix: "/month" },
  { id: "2", value: "2", label: "Annually", priceSuffix: "/year" },
];

export const tiers: PricingTier[] = [
  {
    name: "Free",
    id: "0",
    href: "/sign-up",
    price: { "1": "$0", "2": "$0" },
    discountPrice: { "1": "", "2": "" },
    description: `Get a taste of CountWave, no credit card required.`,
    features: [`1 Workspace`, `3 Tasks `],
    featured: false,
    highlighted: true,
    soldOut: false,
    cta: `Sign up`,
  },
  {
    name: "Pro",
    id: "1",
    href: "/subscribe",
    price: { "1": "$12", "2": "$94.99" },
    discountPrice: { "1": "", "2": "" },
    description: `Get all of CountWaves goodies.`,
    features: [
      `Unlimited Workspaces`,
      `Unlimited Tasks`,
      `Chat room access with other students`,
    ],
    featured: true,
    highlighted: false,
    soldOut: false,
    cta: `Proceed`,
  },
];

export const Pricing = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div
      className={cn("flex flex-col w-full items-center", styles.fancyOverlay)}
    >
      <div className="w-full flex flex-col items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
          <div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
            <h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
              Pricing
            </h1>
          </div>

          {frequencies.length > 1 ? (
            <div className="mt-16 flex justify-center">
              <RadioGroup
                defaultValue={frequency.value}
                onValueChange={(value: string) => {
                  setFrequency(frequencies.find((f) => f.value === value)!);
                }}
                className="grid gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-white dark:bg-black ring-1 ring-inset ring-gray-200/30 dark:ring-gray-800"
                style={{
                  gridTemplateColumns: `repeat(${frequencies.length}, minmax(0, 1fr))`,
                }}
              >
                <Label className="sr-only">Payment frequency</Label>
                {frequencies.map((option) => (
                  <Label
                    className={cn(
                      frequency.value === option.value
                        ? "bg-slate-500/90 text-white dark:bg-slate-900/70 dark:text-white/70"
                        : "bg-transparent text-gray-500 hover:bg-slate-500/10",
                      "cursor-pointer rounded-full px-2.5 py-2 transition-all"
                    )}
                    key={option.value}
                    htmlFor={option.value}
                  >
                    {option.label}

                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="hidden"
                    />
                  </Label>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="mt-12" aria-hidden="true" />
          )}

          <div
            id="pricing"
            className={cn(
              "isolate mx-auto mt-4 mb-28 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none",
              tiers.length === 2 ? "lg:grid-cols-2" : "",
              tiers.length === 3 ? "lg:grid-cols-3" : ""
            )}
          >
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  tier.featured
                    ? "!bg-gray-900 ring-gray-900 dark:!bg-gray-100 dark:ring-gray-100"
                    : "bg-white dark:bg-gray-900/80 ring-gray-300/70 dark:ring-gray-700",
                  "max-w-xs ring-1 rounded-3xl p-8 xl:p-10",
                  tier.highlighted ? styles.fancyGlassContrast : ""
                )}
              >
                <h3
                  id={tier.id}
                  className={cn(
                    tier.featured
                      ? "text-white dark:text-black"
                      : "text-black dark:text-white",
                    "text-2xl font-bold tracking-tight"
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-400",
                    "mt-4 text-sm leading-6"
                  )}
                >
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={cn(
                      tier.featured
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white",
                      "text-4xl font-bold tracking-tight",
                      tier.discountPrice &&
                        tier.discountPrice[frequency.value] &&
                        "line-through"
                    )}
                  >
                    {typeof tier.price === "string"
                      ? tier.price
                      : tier.price[frequency.value]}
                  </span>

                  <span
                    className={cn(
                      tier.featured
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white"
                    )}
                  >
                    {typeof tier.discountPrice === "string"
                      ? tier.discountPrice
                      : tier.discountPrice[frequency.value]}
                  </span>

                  {typeof tier.price !== "string" ? (
                    <span
                      className={cn(
                        tier.featured
                          ? "text-gray-300 dark:text-gray-500"
                          : "dark:text-gray-400 text-gray-600",
                        "text-sm font-semibold leading-6"
                      )}
                    >
                      {frequency.priceSuffix}
                    </span>
                  ) : null}
                </p>
                <Button
                  size="lg"
                  disabled={tier.soldOut}
                  aria-disabled={tier.soldOut}
                  className={cn(
                    "w-full text-black dark:text-white",
                    !tier.highlighted && !tier.featured
                      ? "bg-gray-100 dark:bg-gray-600"
                      : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700",
                    tier.featured || tier.soldOut
                      ? "bg-white dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-black"
                      : "hover:opacity-80 transition-opacity"
                  )}
                  variant={tier.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link
                    href={tier.href}
                    aria-describedby={tier.id}
                    className="flex mt-6 shadow-sm"
                  >
                    {tier.soldOut ? "Sold out" : tier.cta}
                  </Link>
                </Button>

                <ul
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-400",
                    "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle2
                        className={cn(
                          tier.featured ? "text-white dark:text-black" : "",
                          tier.highlighted ? "text-slate-500" : "text-gray-500",

                          "h-6 w-5 flex-none"
                        )}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
