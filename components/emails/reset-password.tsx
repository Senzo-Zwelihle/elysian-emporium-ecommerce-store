import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Button,
} from "@react-email/components";
import { env } from "@/env/server";

interface ResetPasswordEmailProps {
  username: string;
  resetUrl: string;
  userEmail: string;
  updatedDate?: Date;
}

const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
  const { username, resetUrl, userEmail, updatedDate } = props;
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(updatedDate);
  const logoUrl = `${env.ELYSIAN_EMPORIUM_LOGO}`;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[8px] overflow-hidden shadow-lg">
            {/* Header with centered logo */}
            <Section className="bg-linear-to-r from-[#4D00FF] to-black  py-[32px] px-[40px] text-center">
              <Img
                src={logoUrl}
                alt="Logo"
                className="w-[120px] h-auto object-cover mx-auto"
              />
            </Section>

            {/* Main content */}
            <Section className="px-[40px] py-[32px]">
              <Heading className="text-[#1a1a1a] text-[24px] font-bold mb-[16px] mt-0">
                Reset Your Password
              </Heading>

              <Text className="text-[#666666] text-[16px] leading-[24px] mb-[16px] mt-0">
                Hi {username},
              </Text>

              <Text className="text-[#666666] text-[16px] leading-[24px] mb-[24px] mt-0">
                We received a request to reset the password for your account
                associated with {userEmail}. If you made this request, click the
                button below to reset your password.
              </Text>

              {/* Reset button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={resetUrl}
                  className="bg-[#4D00FF] text-white px-[32px] py-[12px] rounded-full text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[#666666] text-[14px] leading-[20px] mb-[16px] mt-0">
                If the button doesn't work, you can copy and paste this link
                into your browser:
              </Text>

              <Text className="text-[#4D00FF] text-[14px] leading-[20px] mb-[24px] mt-0 break-all">
                <Link href={resetUrl} className="text-[#4D00FF] underline">
                  {resetUrl}
                </Link>
              </Text>

              <Text className="text-[#666666] text-[14px] leading-[20px] mb-[16px] mt-0">
                <strong>Important:</strong> This link will expire in 24 hours
                for security reasons.
              </Text>

              <Text className="text-[#666666] text-[14px] leading-[20px] mb-[24px] mt-0">
                If you didn't request a password reset, you can safely ignore
                this email. Your password will remain unchanged.
              </Text>

              {updatedDate && (
                <Text className="text-[#999999] text-[12px] leading-[16px] mb-0 mt-0">
                  Request made on: {formattedDate}
                </Text>
              )}
            </Section>

            {/* Footer */}
            <Section className="bg-[#f8f9fa] px-[40px] py-[24px] border-t border-solid border-[#e5e5e5]">
              <Text className="text-[#999999] text-[12px] leading-[16px] mb-[8px] mt-0 m-0">
                © 2025 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[#999999] text-[12px] leading-[16px] mb-[8px] mt-0 m-0">
                123 Business Street, Suite 100, City, State 12345
              </Text>
              <Text className="text-[#999999] text-[12px] leading-[16px] mb-0 mt-0 m-0">
                <Link href="#" className="text-[#4D00FF] underline text-[12px]">
                  Unsubscribe
                </Link>
                {" | "}
                <Link href="#" className="text-[#4D00FF] underline text-[12px]">
                  Privacy Policy
                </Link>
                {" | "}
                <Link href="#" className="text-[#4D00FF] underline text-[12px]">
                  Contact Support
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  username: "streamer_pro",
  resetUrl: "https://yoursite.com/reset-password?token=abc123xyz",
  userEmail: "user@example.com",
  updatedDate: new Date(),
};

export default ResetPasswordEmail;
