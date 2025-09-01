import React from "react";
import Navigationbar from "@/components/store/home/navigationbar";
import FooterMenu from "@/components/store/home/footer";
import CookieConsent from "@/components/ui/cookie-consent";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navigationbar />
      {children}
      <FooterMenu />
      <CookieConsent
        description="We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking 'Accept', you consent to our use of cookies."
        learnMoreHref="/cookies"
      />
    </main>
  );
};

export default StoreLayout;
