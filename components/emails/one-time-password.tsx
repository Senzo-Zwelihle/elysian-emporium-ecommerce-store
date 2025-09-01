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
} from "@react-email/components";
import { env } from "@/env/server";

interface OneTimePasswordEmailProps {
  userEmail: string;
  username: string;
  otp: string;
  expirationMinutes?: number;
}
const OneTimePasswordEmail = (props: OneTimePasswordEmailProps) => {
  const { userEmail, username, otp, expirationMinutes = 10 } = props;
  const logoUrl = `${env.ELYSIAN_EMPORIUM_LOGO}`;
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Preview>Your verification code for Elysian Emporium</Preview>
          <Container className="bg-white max-w-[600px] mx-auto rounded-[8px] shadow-sm">
            {/* Header */}
            <Section className="px-[32px] pt-[40px] pb-[24px]">
              <div className="text-center">
                <Img
                  src={logoUrl}
                  width="64"
                  height="64"
                  alt="Elysian Emporium Logo"
                  className="mx-auto rounded-[8px] border border-gray-200 p-[8px] bg-white shadow-sm"
                />
              </div>
            </Section>

            {/* Main Content */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="text-[32px] font-bold text-gray-900 text-center mb-[24px] leading-[38px]">
                Verify Your Email Address
              </Heading>

              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px] text-center">
                Hello {username}, we received a request to verify your email
                address for your Elysian Emporium account.
              </Text>

              {/* OTP Code Box */}
              <Section className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-[12px] py-[32px] px-[24px] mb-[32px]">
                <Text className="text-[36px] font-bold text-center text-gray-900 tracking-[8px] mb-[8px]">
                  {otp}
                </Text>
                <Text className="text-[14px] text-gray-600 text-center">
                  This code expires in {expirationMinutes} minutes
                </Text>
              </Section>

              {/* Instructions */}
              <Section className="mb-[32px]">
                <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                  <strong>How to use this code:</strong>
                </Text>
                <Text className="text-[14px] text-gray-600 leading-[22px] mb-[8px]">
                  1. Return to the verification page in your browser
                </Text>
                <Text className="text-[14px] text-gray-600 leading-[22px] mb-[8px]">
                  2. Enter the 6-digit code above
                </Text>
                <Text className="text-[14px] text-gray-600 leading-[22px] mb-[16px]">
                  3. Complete your account setup
                </Text>
              </Section>

              <Text className="text-[14px] text-gray-600 leading-[22px] text-center mb-[24px]">
                If you didn't request this verification code, please ignore this
                email or{" "}
                <Link
                  href="mailto:support@elysianemporium.com"
                  className="text-[#4D00FF] underline"
                >
                  contact our support team
                </Link>{" "}
                if you have concerns about your account security.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-[32px] py-[24px] rounded-b-[8px]">
              <Text className="text-[12px] text-gray-500 text-center leading-[18px] mb-[8px]">
                This email was sent to {userEmail}
              </Text>
              <Text className="text-[12px] text-gray-500 text-center leading-[18px] mb-[16px]">
                Elysian Emporium, South Africa
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OneTimePasswordEmail;
