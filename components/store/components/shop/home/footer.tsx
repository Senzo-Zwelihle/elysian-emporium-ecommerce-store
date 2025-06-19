import React from "react";
import Link from "next/link";
import ElysianEmporiumLogo from "@/public/brand/elysian-logo-square.svg";
import Image from "next/image";
import { footerMenuItems } from "@/constants/store/navigation";

const Footer = () => {
  return (
    <footer className="py-8 md:py-10">
      <div className="mx-auto px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Image
            src={ElysianEmporiumLogo}
            height={40}
            width={40}
            quality={95}
            alt="Elysian Emporium Logo"
            className="rounded-sm"
          />
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {footerMenuItems.map((link, index) => (
            <Link
              key={index}
              href={link.target}
              className=" hover:text-primary block duration-150"
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} Elysian Emporium Ecommerce, All rights reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
