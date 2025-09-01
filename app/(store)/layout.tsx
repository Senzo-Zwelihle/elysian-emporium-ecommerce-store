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

      {/* this is for ui purposes-- doesnt actually handle cookies, better-auth config is handling this btw */}
      <CookieConsent description="We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking 'Accept', you consent to our use of cookies." />
    </main>
  );
};

export default StoreLayout;
