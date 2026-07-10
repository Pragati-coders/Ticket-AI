"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function ProfileDropdown() {
  const { user, isLoaded } = useUser();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="max-w-40 truncate text-sm font-medium">{isLoaded ? user?.fullName ?? "TicketAI user" : "Loading"}</p>
        <p className="text-xs text-muted-foreground">Profile</p>
      </div>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: "h-9 w-9"
          }
        }}
      />
    </div>
  );
}
