import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/dashboard"
      appearance={{
        elements: {
          cardBox: "shadow-sm",
          formButtonPrimary: "bg-primary hover:bg-primary/90"
        }
      }}
    />
  );
}
