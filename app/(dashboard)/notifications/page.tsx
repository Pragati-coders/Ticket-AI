import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrCreateCurrentUser } from "@/services/auth";
import { listNotifications } from "@/services/notifications";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function NotificationsPage() {
  const user = await getOrCreateCurrentUser();
  const notifications = user ? await listNotifications(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Notifications</h1>
        <p className="mt-2 text-sm text-muted-foreground">System and ticket updates for your workspace.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Latest operational updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length ? (
            notifications.map(function (notification: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; body: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }): import("react").JSX.Element {
              return (
                <article key={notification.id} className="rounded-lg border p-4">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.body}</p>
                </article>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
