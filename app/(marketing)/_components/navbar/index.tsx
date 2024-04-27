import { Logo } from "@/components/logo";

import { ActionButtons } from "./action-buttons";

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-10 border-b shadow-md fixed w-full py-1 bg-background">
      <Logo />
      <div className="flex items-center justify-between">
        <ActionButtons />
      </div>
    </header>
  );
};
