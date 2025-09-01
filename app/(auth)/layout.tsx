import React from "react";
import { CookieConsent } from "@/components/ui/cookie-consent";

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      {children}
      <CookieConsent 
        variant="small"
        description="We use cookies to provide you with a secure authentication experience."
        learnMoreHref="/cookies"
      />
    </main>
  );
};

export default AuthenticationLayout;
