import { auth } from "@clerk/nextjs/server";

import { ThemeSwitch } from "@/components/theme-switch";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";

import { Features } from "./_components/features";
import { Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { Navbar } from "./_components/navbar";
import { Pricing } from "./_components/pricing";

const MarketingPage = async () => {
  const isSubscribed = await checkSubscription();
  const { userId } = auth();
  const isLoggedIn = !!userId;

  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <Features />

      <Separator className="mb-12" />

      <Pricing isSubscribed={isSubscribed} isLoggedIn={isLoggedIn} />

      <Footer />

      <aside>
        <ThemeSwitch />
      </aside>
    </main>
  );
};

export default MarketingPage;
