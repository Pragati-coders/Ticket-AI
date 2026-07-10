import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProfileDropdown } from "@/components/auth/profile-dropdown";
import type { AppRole } from "@/types/auth";

export function Navbar({ role }: { role: AppRole }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 lg:px-6">
      <div className="flex items-center gap-3">
        <MobileNav role={role} />
        <div>
          <p className="text-sm font-semibold">TicketAI</p>
          <p className="text-xs text-muted-foreground capitalize">{role} workspace</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
}
